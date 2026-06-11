"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sendWasteReportEmail } from "@/lib/email";

// 1. File Upload (Safe serverless Base64 converter)
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    // Server-side size check (< 1MB)
    if (file.size > 1024 * 1024) {
      return { success: false, error: "File exceeds 1MB limit" };
    }

    // MIME type check to prevent malicious uploads (like Stored XSS)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Only JPEG, PNG, and WEBP images are allowed." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert directly to base64 Data URL to bypass serverless read-only filesystem limitations
    const base64String = buffer.toString("base64");
    const fileUrl = `data:${file.type};base64,${base64String}`;

    return { success: true, fileUrl };
  } catch (error) {
    console.error("File upload action failed:", error);
    return { success: false, error: "File upload failed on server" };
  }
}

// 2. Submit Waste Report
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

// 3. Get Waste Reports for Active User
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
