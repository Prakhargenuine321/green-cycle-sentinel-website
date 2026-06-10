"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { getAdminWasteReportsAction, updateWasteReportStatusAction, getSessionAction } from "@/app/actions";
import { ShieldCheck, ShieldAlert, BarChart3, Database, Calendar, MapPin, ClipboardList, RefreshCw, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface WasteReport {
  id: string;
  reporterId: string;
  reporterName: string;
  type: string;
  description: string;
  location: string;
  quantity: number;
  status: string;
  fileUrl: string | null;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Stats
  const [totalTons, setTotalTons] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    const res = await getAdminWasteReportsAction();
    if (res.success && res.reports) {
      const data = res.reports as WasteReport[];
      setReports(data);
      
      // Calculate Stats
      const tons = data.reduce((acc, curr) => acc + curr.quantity, 0);
      const pending = data.filter(r => r.status === "PENDING").length;
      const processed = data.filter(r => r.status === "PROCESSED").length;

      setTotalTons(tons);
      setPendingCount(pending);
      setProcessedCount(processed);
    } else {
      setError(res.error || "Failed to load reports");
    }
    setLoading(false);
  };

  useEffect(() => {
    const verifyAccess = async () => {
      const session = await getSessionAction();
      if (!session || session.role !== "ADMIN") {
        router.push("/login?redirect=/admin");
      } else {
        setAuthorized(true);
        fetchReports();
      }
    };
    verifyAccess();
  }, [router]);

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    setUpdatingId(reportId);
    const res = await updateWasteReportStatusAction(reportId, newStatus);
    if (res.success) {
      await fetchReports();
    } else {
      alert(res.error || "Failed to update report status");
    }
    setUpdatingId(null);
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <GridBackground showGlow={true} glowPosition="center" animateReveal={true} />
        <div className="text-center z-10 font-mono text-sm text-muted-foreground animate-pulse">
          Authenticating Admin Security Credentials...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16">
      <GridBackground showGlow={true} glowPosition="top" animateReveal={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs text-emerald-400 font-semibold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Operational Administrator Terminal</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Logistics &amp; Intake <span className="text-gradient-green">Control Room</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Manage municipal Solid Refuse reports, allocate collection vessels, and monitor grid intake volume metrics.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Tonnage Managed</span>
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-heading font-black text-foreground tracking-tight">
              {totalTons.toFixed(1)} Metric Tons
            </div>
          </GlassCard>

          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Pending Clean Operations</span>
              <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl font-heading font-black text-amber-500 tracking-tight">
              {pendingCount} Dispatches
            </div>
          </GlassCard>

          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Processed/Diverted Deposits</span>
              <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-heading font-black text-emerald-400 tracking-tight">
              {processedCount} Completed
            </div>
          </GlassCard>
        </div>

        {/* Action Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" /> Registry Operations List
          </h2>
          <GlowButton onClick={fetchReports} disabled={loading} size="sm" className="gap-1.5 py-1.5 px-3">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Reload Logs
          </GlowButton>
        </div>

        {/* Database List */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-500 font-mono text-center mb-6">
            {error}
          </div>
        )}

        {loading && reports.length === 0 ? (
          <div className="text-center py-20 font-mono text-xs text-muted-foreground">
            Synchronizing database rows...
          </div>
        ) : reports.length === 0 ? (
          <GlassCard className="p-12 text-center text-muted-foreground border-border/10">
            <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
            <p className="font-mono text-xs">No municipal waste intakes have been logged in the system registry.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <GlassCard key={report.id} hoverEffect={false} className="border-border/10 p-6 space-y-4">
                {/* Heading */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                        {report.type}
                      </span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                        report.status === "PENDING" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        report.status === "ASSIGNED" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                        report.status === "COLLECTED" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Report ID: {report.id}
                    </div>
                  </div>

                  {/* Status Change Selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-mono text-muted-foreground/80 uppercase">Assign Status</label>
                    <select
                      className="rounded bg-background/50 border border-border px-2 py-1 text-xs text-foreground outline-none cursor-pointer focus:border-primary/50 transition-colors"
                      value={report.status}
                      disabled={updatingId === report.id}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="COLLECTED">COLLECTED</option>
                      <option value="PROCESSED">PROCESSED</option>
                    </select>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-3 border-y border-border/5">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase">Intake Coordinates</div>
                      <div className="text-xs text-foreground font-semibold">{report.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Layers className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase">Quantity Load</div>
                      <div className="text-xs text-foreground font-semibold">{report.quantity} Metric Tons</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase">Telemetry Log Date</div>
                      <div className="text-xs text-foreground font-semibold">
                        {new Date(report.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Database className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase">Reporter Profile</div>
                      <div className="text-xs text-foreground font-semibold">{report.reporterName}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase">Description &amp; Environmental Warning</div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-background/20 p-3 rounded-lg border border-border/5">
                    {report.description || "No specific warning or accessibility notes logged."}
                  </p>
                </div>

                {/* Attachments */}
                {report.fileUrl && (
                  <div className="flex items-center justify-between text-[10px] font-mono bg-primary/5 border border-primary/10 rounded-lg p-2.5">
                    <span className="text-muted-foreground/80 flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-primary" /> Visual telemetry evidence saved
                    </span>
                    <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                      View Image File
                    </a>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
