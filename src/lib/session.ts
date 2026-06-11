import { cookies } from "next/headers";
import crypto from "crypto";

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("CRITICAL SECURITY ERROR: SESSION_SECRET environment variable must be defined in production mode.");
}
const SECRET_KEY = process.env.SESSION_SECRET || "green-cycle-sentinel-fallback-secret-2026";
// AES-256-GCM expects a 32-byte key. We derive one from the secret.
const key = crypto.scryptSync(SECRET_KEY, "salt-gcs", 32);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  expiresAt: string;
}

// Encrypt payload to a secure string
export function encrypt(payload: SessionPayload): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  
  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Format: iv.encrypted.authTag
  return `${iv.toString("hex")}.${encrypted}.${authTag}`;
}

// Decrypt secure string to payload
export function decrypt(sessionToken: string): SessionPayload | null {
  try {
    const [ivHex, encryptedHex, authTagHex] = sessionToken.split(".");
    if (!ivHex || !encryptedHex || !authTagHex) return null;
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    const parsed = JSON.parse(decrypted) as SessionPayload;
    
    // Check expiration
    if (new Date(parsed.expiresAt).getTime() < Date.now()) {
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to decrypt session cookie:", error);
    return null;
  }
}

// Create new session cookie
export async function createSession(userId: string, email: string, name: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const payload: SessionPayload = {
    userId,
    email,
    name,
    role,
    expiresAt: expiresAt.toISOString(),
  };
  
  const token = encrypt(payload);
  const cookieStore = await cookies();
  
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  // Edge-compatible cookies for middleware access
  cookieStore.set("user_authenticated", "true", {
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("user_role", role, {
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Read active session
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  return decrypt(sessionCookie);
}

// Destroy session
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("user_authenticated");
  cookieStore.delete("user_role");
  cookieStore.delete("investor_bypass");
}
