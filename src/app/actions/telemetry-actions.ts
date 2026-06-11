"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Submit Contact Inquiry
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

// 2. Sustainability ESG Telemetry database actions
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
