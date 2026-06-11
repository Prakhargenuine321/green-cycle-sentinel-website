"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// 1. Admin Dashboard Actions
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
