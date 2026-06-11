"use server";

import { db } from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/session";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sendOtpEmail, sendWasteReportEmail } from "@/lib/email";
import fs from "fs";
import path from "path";

// 1. PBKDF2 Password Hashing Helpers
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

const REGISTRATION_SECRET_KEY = process.env.SESSION_SECRET || "green-cycle-sentinel-fallback-secret-2026";
const derivedKey = crypto.scryptSync(REGISTRATION_SECRET_KEY, "salt-gcs-reg", 32);

interface PendingRegistrationData {
  name: string;
  email: string;
  passwordHash: string;
  otpCode: string;
  otpExpiresAt: number;
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

// 2. User Registration
export async function registerAction(data: { name: string; email: string; password: string }) {
  try {
    console.log("[REGISTER_ACTION_TRIGGERED] New sign-up attempt for:", data.email);
    const existing = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "Email is already registered" };
    }

    const passwordHash = hashPassword(data.password);
    
    // Generate random 6-digit OTP code and set 10 minute expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP via email
    const emailResult = await sendOtpEmail(data.email, otpCode, data.name);
    if (!emailResult.success) {
      return { success: false, error: "Failed to send verification email. Please try again." };
    }

    // Save registration details in an encrypted cookie
    const pendingData = {
      name: data.name,
      email: data.email,
      passwordHash,
      otpCode,
      otpExpiresAt: otpExpiresAt.getTime(),
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

// 3. OTP Verification
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

    if (pendingData.otpCode !== code) {
      return { success: false, error: "Invalid verification code" };
    }

    if (pendingData.otpExpiresAt < Date.now()) {
      return { success: false, error: "Verification code has expired. Please register again." };
    }

    // Now save the user to the database since OTP is successfully verified!
    // Default role is "CITIZEN" unless email domain is "sentinel.com" or "investor.com"
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
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    pendingData.otpCode = otpCode;
    pendingData.otpExpiresAt = otpExpiresAt.getTime();

    // Send fresh OTP via email
    const emailResult = await sendOtpEmail(email, otpCode, pendingData.name);
    if (!emailResult.success) {
      return { success: false, error: "Failed to resend OTP email. Please try again." };
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

    if (!user || !verifyPassword(data.password, user.passwordHash)) {
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

// 7. Verify Investor Boardroom Passcode
export async function verifyInvestorPasscodeAction(passcode: string) {
  try {
    if (passcode === "Sentinel2026") {
      const cookieStore = await cookies();
      cookieStore.set("investor_bypass", "true", {
        secure: process.env.NODE_ENV === "production",
        maxAge: 604800, // 7 days
        sameSite: "lax",
        path: "/",
      });
      return { success: true };
    }
    return { success: false, error: "Invalid decryption passcode. Security logged." };
  } catch (error) {
    console.error("Investor passcode verification failed:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 8. File Upload
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename to prevent overwrites
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    return { success: true, fileUrl: `/uploads/${filename}` };
  } catch (error) {
    console.error("File upload action failed:", error);
    return { success: false, error: "File upload failed on server" };
  }
}

// 9. Submit Waste Report
export async function submitWasteReportAction(data: {
  reporterName: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  quantity: number;
  description: string;
  fileUrl?: string | null;
}) {
  try {
    // Read session to ensure user is logged in
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Authentication required to submit reports" };
    }

    // Store in database with default status "not clear"
    await db.wasteReport.create({
      data: {
        reporterId: session.userId,
        reporterName: data.reporterName,
        type: data.category,
        description: data.description,
        location: data.location,
        quantity: data.quantity,
        status: "not clear",
        fileUrl: data.fileUrl || null,
      },
    });

    // Send email notification with details
    try {
      await sendWasteReportEmail({
        reporterName: data.reporterName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        category: data.category,
        quantity: data.quantity,
        description: data.description,
        fileUrl: data.fileUrl || null,
      });
    } catch (emailErr) {
      // Log email error but do not fail the database submission
      console.error("Email notification failed during waste report submission:", emailErr);
    }

    revalidatePath("/report-waste");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit waste report:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 10. Get Waste Reports for Active User
export async function getActiveUserReportsAction() {
  try {
    const session = await getSession();
    if (!session) return { success: false, reports: [] };

    const reports = await db.wasteReport.findMany({
      where: { reporterId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, reports: JSON.parse(JSON.stringify(reports)) };
  } catch (error) {
    console.error("Failed to fetch waste reports:", error);
    return { success: false, reports: [] };
  }
}

// 11. Submit Contact Inquiry
export async function submitContactInquiryAction(data: {
  name: string;
  email: string;
  org?: string;
  subject: string;
  message: string;
}) {
  try {
    await db.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        organization: data.org || null,
        message: data.message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact inquiry:", error);
    return { success: false, error: "Internal server error" };
  }
}

// 12. Sustainability ESG Telemetry database actions
const defaultCarbon = [
  { type: "CARBON", metric: "Jan", value: 1200 },
  { type: "CARBON", metric: "Feb", value: 1900 },
  { type: "CARBON", metric: "Mar", value: 3200 },
  { type: "CARBON", metric: "Apr", value: 4800 },
  { type: "CARBON", metric: "May", value: 6100 },
  { type: "CARBON", metric: "Jun", value: 8409 },
];

const defaultAir = [
  { type: "AIR", metric: "Mon", value: 72 },
  { type: "AIR", metric: "Tue", value: 68 },
  { type: "AIR", metric: "Wed", value: 85 },
  { type: "AIR", metric: "Thu", value: 50 },
  { type: "AIR", metric: "Fri", value: 45 },
  { type: "AIR", metric: "Sat", value: 30 },
  { type: "AIR", metric: "Sun", value: 28 },
];

const defaultEnergy = [
  { type: "ENERGY", metric: "Wk 1", value: 1.2 },
  { type: "ENERGY", metric: "Wk 2", value: 2.5 },
  { type: "ENERGY", metric: "Wk 3", value: 4.1 },
  { type: "ENERGY", metric: "Wk 4", value: 5.8 },
  { type: "ENERGY", metric: "Wk 5", value: 7.2 },
  { type: "ENERGY", metric: "Wk 6", value: 8.4 },
];

export async function getTelemetryLogsAction() {
  try {
    let logs = await db.telemetryLog.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (logs.length === 0) {
      const defaults = [
        ...defaultCarbon,
        ...defaultAir,
        ...defaultEnergy,
      ];
      
      await db.telemetryLog.createMany({
        data: defaults,
      });

      logs = await db.telemetryLog.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    const carbon = logs.filter(l => l.type === "CARBON").map(l => ({ month: l.metric, offset: l.value }));
    const air = logs.filter(l => l.type === "AIR").map(l => ({ day: l.metric, aqi: l.value }));
    const energy = logs.filter(l => l.type === "ENERGY").map(l => ({ week: l.metric, yield: l.value }));

    return { success: true, carbon, air, energy };
  } catch (error) {
    console.error("Failed to fetch telemetry logs:", error);
    return { success: false, carbon: [], air: [], energy: [] };
  }
}

export async function updateTelemetryLogsAction() {
  try {
    const logs = await db.telemetryLog.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (logs.length === 0) {
      return getTelemetryLogsAction();
    }

    // 1. Carbon (increment last offset metric)
    const carbonLogs = logs.filter(l => l.type === "CARBON");
    const lastCarbon = carbonLogs[carbonLogs.length - 1];
    const newCarbonVal = Math.min(lastCarbon.value + Math.floor(Math.random() * 50) + 10, 15000);
    await db.telemetryLog.update({
      where: { id: lastCarbon.id },
      data: { value: newCarbonVal },
    });

    // 2. Air (fluctuate AQI on random days)
    const airLogs = logs.filter(l => l.type === "AIR");
    for (const item of airLogs) {
      if (Math.random() > 0.6) {
        const change = Math.floor(Math.random() * 5) - 2;
        const newAqi = Math.max(Math.min(item.value + change, 120), 15);
        await db.telemetryLog.update({
          where: { id: item.id },
          data: { value: newAqi },
        });
      }
    }

    // 3. Energy (increment last weekly yield metric)
    const energyLogs = logs.filter(l => l.type === "ENERGY");
    const lastEnergy = energyLogs[energyLogs.length - 1];
    const newEnergyVal = Number((lastEnergy.value + Math.random() * 0.15).toFixed(2));
    await db.telemetryLog.update({
      where: { id: lastEnergy.id },
      data: { value: newEnergyVal },
    });

    const freshLogs = await db.telemetryLog.findMany({
      orderBy: { createdAt: "asc" },
    });

    const carbon = freshLogs.filter(l => l.type === "CARBON").map(l => ({ month: l.metric, offset: l.value }));
    const air = freshLogs.filter(l => l.type === "AIR").map(l => ({ day: l.metric, aqi: l.value }));
    const energy = freshLogs.filter(l => l.type === "ENERGY").map(l => ({ week: l.metric, yield: l.value }));

    revalidatePath("/sustainability");
    return { success: true, carbon, air, energy };
  } catch (error) {
    console.error("Failed to update telemetry logs:", error);
    return { success: false };
  }
}

// 13. Admin Dashboard Actions
export async function getAdminWasteReportsAction() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Admin access required", reports: [] };
    }

    const reports = await db.wasteReport.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, reports: JSON.parse(JSON.stringify(reports)) };
  } catch (error) {
    console.error("Failed to fetch admin waste reports:", error);
    return { success: false, error: "Internal server error", reports: [] };
  }
}

export async function updateWasteReportStatusAction(reportId: string, newStatus: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Admin access required" };
    }

    await db.wasteReport.update({
      where: { id: reportId },
      data: { status: newStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/report-waste");
    return { success: true };
  } catch (error) {
    console.error("Failed to update waste report status:", error);
    return { success: false, error: "Internal server error" };
  }
}
