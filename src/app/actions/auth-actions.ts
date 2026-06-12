"use server";

import { db } from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/session";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sendOtpEmail } from "@/lib/email";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const pbkdf2Async = promisify(crypto.pbkdf2);

// 1. Asynchronous PBKDF2 Password Hashing Helpers (OWASP compliant: 600k iterations)
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashBuffer = await pbkdf2Async(password, salt, 600000, 64, "sha512");
  return `${salt}:${hashBuffer.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const verifyHashBuffer = await pbkdf2Async(password, salt, 600000, 64, "sha512");
    return hash === verifyHashBuffer.toString("hex");
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

const REGISTRATION_SECRET_KEY = process.env.SESSION_SECRET || "green-cycle-sentinel-fallback-secret-2026";
const derivedKey = crypto.scryptSync(REGISTRATION_SECRET_KEY, "salt-gcs-reg", 32);

interface PendingRegistrationData {
  name: string;
  email: string;
  passwordHash: string;
  otpCode: string;
  otpExpiresAt: number;
  attempts: number; // For rate-limiting brute-force attempts
}

function encryptPendingData(data: PendingRegistrationData): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", derivedKey, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}.${encrypted}.${authTag}`;
}

function decryptPendingData(token: string): PendingRegistrationData | null {
  try {
    const [ivHex, encryptedHex, authTagHex] = token.split(".");
    if (!ivHex || !encryptedHex || !authTagHex) return null;
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", derivedKey, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted) as PendingRegistrationData;
  } catch (error) {
    console.error("Failed to decrypt pending registration:", error);
    return null;
  }
}

// Helper to log OTP generated in development to terminal console and local otp-debug.log file
function logOtpInDevelopment(email: string, otpCode: string, action: string) {
  if (process.env.NODE_ENV !== "production") {
    const logMessage = `[${new Date().toISOString()}] [${action}] Email: ${email} | OTP: ${otpCode}\n`;
    console.log(`\n🔑 [DEV ONLY] Generated OTP for ${email}: ${otpCode}\n`);
    try {
      const logPath = path.join(process.cwd(), "otp-debug.log");
      fs.appendFileSync(logPath, logMessage);
    } catch (e) {
      console.error("Failed to write to otp-debug.log:", e);
    }
  }
}

// 2. User Registration Ingestion
export async function registerAction(data: { name: string; email: string; password: string }) {
  try {
    console.log("[REGISTER_ACTION_TRIGGERED] New sign-up attempt for:", data.email);
    const existing = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "Email is already registered" };
    }

    const passwordHash = await hashPassword(data.password);
    
    // Generate random 6-digit OTP code and set 10 minute expiration
    // Use crypto.randomInt for cryptographically secure pseudo-random integers (prevents predictability)
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Log the OTP code in development mode for easy developer/tester access
    logOtpInDevelopment(data.email, otpCode, "REGISTER");

    // Send OTP via email
    const emailResult = await sendOtpEmail(data.email, otpCode, data.name);
    if (!emailResult.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[DEV ONLY] Failed to send OTP email to ${data.email}, but continuing registration flow in development:`, emailResult.error);
      } else {
        return { success: false, error: "Failed to send verification email. Please try again." };
      }
    }

    // Save registration details in an encrypted cookie
    const pendingData: PendingRegistrationData = {
      name: data.name,
      email: data.email,
      passwordHash,
      otpCode,
      otpExpiresAt: otpExpiresAt.getTime(),
      attempts: 0,
    };

    const cookieStore = await cookies();
    cookieStore.set("pending_registration", encryptPendingData(pendingData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60, // 10 minutes
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 3. OTP Verification with Rate Limiting (Attempt Threshold Lock)
export async function verifyOtpAction(email: string, code: string) {
  try {
    const cookieStore = await cookies();
    const pendingCookie = cookieStore.get("pending_registration")?.value;
    if (!pendingCookie) {
      return { success: false, error: "Verification session expired. Please register again." };
    }

    const pendingData = decryptPendingData(pendingCookie);
    if (!pendingData) {
      return { success: false, error: "Invalid verification session." };
    }

    // Double check that the email matches the verification session email
    if (pendingData.email !== email) {
      return { success: false, error: "Invalid email session" };
    }

    if (pendingData.otpExpiresAt < Date.now()) {
      cookieStore.delete("pending_registration");
      return { success: false, error: "Verification code has expired. Please register again." };
    }

    // Validate code match and handle brute-force rate limit
    if (pendingData.otpCode !== code) {
      pendingData.attempts += 1;
      const maxAttempts = 5;
      if (pendingData.attempts >= maxAttempts) {
        cookieStore.delete("pending_registration");
        return { success: false, error: "Too many failed attempts. Verification session has been locked. Please sign up again." };
      }

      // Re-save cookie with incremented attempt counter
      cookieStore.set("pending_registration", encryptPendingData(pendingData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: Math.max(0, Math.floor((pendingData.otpExpiresAt - Date.now()) / 1000)),
        sameSite: "lax",
        path: "/",
      });

      return { success: false, error: `Invalid verification code. You have ${maxAttempts - pendingData.attempts} attempts remaining.` };
    }

    // Now save the user to the database since OTP is successfully verified!
    let role = "CITIZEN";
    if (pendingData.email.endsWith("@sentinel.com")) {
      role = "ADMIN";
    } else if (pendingData.email.endsWith("@investor.com")) {
      role = "INVESTOR";
    }

    // Ensure user was not registered by another request in the meantime
    const existing = await db.user.findUnique({
      where: { email: pendingData.email },
    });
    if (existing) {
      cookieStore.delete("pending_registration");
      return { success: false, error: "Email is already registered" };
    }

    const newUser = await db.user.create({
      data: {
        email: pendingData.email,
        passwordHash: pendingData.passwordHash,
        name: pendingData.name,
        role,
        isVerified: true, // Mark verified!
      },
    });

    // Write encrypted session and helper cookies
    await createSession(newUser.id, newUser.email, newUser.name, newUser.role);

    // Clear the pending registration cookie
    cookieStore.delete("pending_registration");

    return { success: true, role: newUser.role };
  } catch (error) {
    console.error("OTP verification failed:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 4. Resend OTP
export async function resendOtpAction(email: string) {
  try {
    const cookieStore = await cookies();
    const pendingCookie = cookieStore.get("pending_registration")?.value;
    if (!pendingCookie) {
      return { success: false, error: "Registration session expired. Please register again." };
    }

    const pendingData = decryptPendingData(pendingCookie);
    if (!pendingData) {
      return { success: false, error: "Invalid verification session." };
    }

    if (pendingData.email !== email) {
      return { success: false, error: "Invalid email session" };
    }

    // Generate fresh 6-digit OTP code and set 10 minute expiration
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    pendingData.otpCode = otpCode;
    pendingData.otpExpiresAt = otpExpiresAt.getTime();
    pendingData.attempts = 0; // Reset attempts on resend

    // Log the OTP code in development mode for easy developer/tester access
    logOtpInDevelopment(email, otpCode, "RESEND");

    // Send fresh OTP via email
    const emailResult = await sendOtpEmail(email, otpCode, pendingData.name);
    if (!emailResult.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[DEV ONLY] Failed to resend OTP email to ${email}, but continuing flow in development:`, emailResult.error);
      } else {
        return { success: false, error: "Failed to resend OTP email. Please try again." };
      }
    }

    // Save updated cookie
    cookieStore.set("pending_registration", encryptPendingData(pendingData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60,
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("OTP resend failed:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 5. User Login
export async function loginAction(data: { email: string; password: string }) {
  try {
    const user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return { success: false, error: "Invalid email or password" };
    }

    // Block unverified accounts from logging in
    if (!user.isVerified) {
      return {
        success: false,
        error: "Your email is not verified. Please check your inbox for the OTP and complete verification.",
        unverified: true,
        email: user.email,
      };
    }

    // Write encrypted session and helper cookies
    await createSession(user.id, user.email, user.name, user.role);

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 6. User Logout
export async function logoutAction() {
  await deleteSession();
  revalidatePath("/", "layout");
  return { success: true };
}

// 6b. Get current session (safe to call from Client Components via Server Action)
export async function getSessionAction() {
  return await getSession();
}
