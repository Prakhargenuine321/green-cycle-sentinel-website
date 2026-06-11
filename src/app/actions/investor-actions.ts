"use server";

import { cookies } from "next/headers";

// 1. Verify Investor Boardroom Passcode
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
