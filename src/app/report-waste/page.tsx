"use client";

import React, { useState, useEffect, useRef } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowInput, GlowTextarea } from "@/components/ui/glow-input";
import { GlowButton } from "@/components/ui/glow-button";
import {
  UploadCloud, CheckCircle, Scale, ShieldAlert, ArrowRight,
  ShieldCheck, MapPin, Loader2, AlertTriangle, LockKeyhole,
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";
import { submitWasteReportAction, getActiveUserReportsAction, uploadFileAction } from "@/app/actions";
import { WasteReport } from "@/generated/prisma/client";

// Location state type
type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export default function ReportWastePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    category: "organic",
    description: "",
    quantity: 5,
  });
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationBlockedMsg, setLocationBlockedMsg] = useState(false);

  const loadReports = async () => {
    const res = await getActiveUserReportsAction();
    if (res.success && res.reports) {
      setReports(res.reports as WasteReport[]);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coords = `${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E (±${Math.round(accuracy)}m)`;
        setFormData((prev) => ({ ...prev, location: coords }));
        setLocationStatus("granted");
        setLocationBlockedMsg(false);
      },
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Request geolocation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      loadReports();
      requestLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((f) => f.name);
      setFiles(fileNames);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Block submission if location was denied
    if (locationStatus === "denied" || locationStatus === "unavailable") {
      setLocationBlockedMsg(true);
      return;
    }

    setLoading(true);
    setLocationBlockedMsg(false);

    if (!fileInputRef.current?.files?.[0]) {
      setError("Please attach at least one deposit image. Visual evidence is mandatory.");
      setLoading(false);
      return;
    }

    let fileUrl: string | null = null;
    try {
      const uploadData = new FormData();
      uploadData.append("file", fileInputRef.current.files[0]);
      const uploadRes = await uploadFileAction(uploadData);
      if (uploadRes.success && uploadRes.fileUrl) {
        fileUrl = uploadRes.fileUrl;
      } else {
        setError(uploadRes.error || "Image upload failed");
        setLoading(false);
        return;
      }

      const res = await submitWasteReportAction({
        reporterName: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        category: formData.category,
        quantity: formData.quantity,
        description: formData.description,
        fileUrl,
      });

      setLoading(false);
      if (res.success) {
        setSubmitted(true);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        loadReports();
      } else {
        setError(res.error || "Failed to submit waste report");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during submission.");
      setLoading(false);
    }
  };

  // Location status badge UI
  const renderLocationBadge = () => {
    if (locationStatus === "requesting") {
      return (
        <div className="flex items-center gap-2 text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <Loader2 className="h-3 w-3 animate-spin shrink-0" />
          Requesting GPS coordinates…
        </div>
      );
    }
    if (locationStatus === "granted") {
      return (
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <MapPin className="h-3 w-3 shrink-0" />
          GPS location acquired — coordinates locked
        </div>
      );
    }
    if (locationStatus === "denied" || locationStatus === "unavailable") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {locationStatus === "unavailable"
              ? "Geolocation is not supported by your browser."
              : "Location access denied. Please allow location in your browser settings."}
          </div>
          <button
            type="button"
            onClick={requestLocation}
            className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1"
          >
            <MapPin className="h-3 w-3" /> Retry location request
          </button>
        </div>
      );
    }
    return null;
  };

  const isLocationBlocked = locationStatus === "denied" || locationStatus === "unavailable";

  return (
    <div className="relative min-h-screen py-16">
      <GridBackground showGlow={true} glowPosition="top" animateReveal={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            variants={staggerChildFadeInUp}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Secure Waste Intake Reporting Portal</span>
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Report Municipal <span className="text-gradient-green">Waste Deposits</span>
          </h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Submit telemetry details for localized waste piles. Our circular collection logistics team will verify coordinates and dispatch pickup containers.
          </motion.p>
        </motion.div>

        {/* Form Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start max-w-6xl mx-auto">
          {/* Right Column (Intake Form) */}
          <GlassCard animateReveal={false} hoverEffect={false} className="lg:col-span-8 border-border/15 p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-16 space-y-5">
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Waste Intake Registered
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you. The report has been uploaded to our logistics dispatch registry. System operators will coordinate verification and schedule pickups within 24 hours.
                </p>
                <div className="pt-4">
                  <GlowButton onClick={() => setSubmitted(false)} className="mx-auto text-xs py-2 px-4">
                    Submit Another Report
                  </GlowButton>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500 font-mono text-center mb-4">
                    {error}
                  </div>
                )}

                {/* Location blocked warning above form */}
                {locationBlockedMsg && (
                  <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-amber-400 font-mono">Location Required</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To avoid misinformation, accurate GPS coordinates are required for all waste reports. Please allow location access in your browser settings and retry.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                        Name
                      </label>
                      <GlowInput
                        required
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                        Email Address
                      </label>
                      <GlowInput
                        type="email"
                        required
                        placeholder="your_email@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <GlowInput
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={formData.phone}
                        maxLength={10}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          setFormData({ ...formData, phone: digitsOnly.slice(0, 10) });
                        }}
                      />
                    </div>

                    {/* GPS Location Field — auto-filled, disabled */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          GPS Coordinates
                        </label>
                        <span className="text-[9px] font-mono text-muted-foreground/50 flex items-center gap-1">
                          <LockKeyhole className="h-2.5 w-2.5" /> Auto-detected
                        </span>
                      </div>
                      <div className="relative">
                        <GlowInput
                          required
                          readOnly
                          disabled
                          placeholder={
                            locationStatus === "requesting"
                              ? "Acquiring GPS…"
                              : locationStatus === "denied"
                              ? "Location denied — allow access above"
                              : "Awaiting location…"
                          }
                          value={formData.location}
                          className="cursor-not-allowed opacity-70 pr-8"
                        />
                        {locationStatus === "requesting" && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400 animate-spin" />
                        )}
                        {locationStatus === "granted" && (
                          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-500" />
                        )}
                        {(locationStatus === "denied" || locationStatus === "unavailable") && (
                          <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                      {renderLocationBadge()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                        Waste Category
                      </label>
                      <select
                        className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:ring-3 focus:ring-primary/25 text-foreground appearance-none cursor-pointer"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="organic">Organic Refuse (Food/Biomass)</option>
                        <option value="paper">Paper &amp; Cardboard</option>
                        <option value="plastics">High-Density Plastics</option>
                        <option value="metal">Metal Scrap &amp; Wiring</option>
                        <option value="chemical">Chemical &amp; Particulate Toxins</option>
                        <option value="other">Other Solid Refuse</option>
                      </select>
                    </div>

                    {/* Quantity Slider */}
                    <div className="space-y-2 flex flex-col justify-end">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                        <span>Estimated Quantity</span>
                        <span className="text-primary font-bold">{formData.quantity} Metric Tons</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        className="w-full h-1.5 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none py-2"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                      Deposit Description
                    </label>
                    <GlowTextarea
                      required
                      placeholder="Provide details on accessibility, material density, or surrounding environmental warnings..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* File Dropzone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                      Attach Deposit Images
                    </label>
                    <div className="border-2 border-dashed border-border/15 hover:border-primary/30 rounded-xl p-6 text-center transition-all duration-300 relative cursor-pointer group bg-background/20">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="space-y-2">
                        <UploadCloud className="h-8 w-8 text-muted-foreground/60 group-hover:text-primary mx-auto transition-colors duration-300" />
                        <div className="text-xs text-muted-foreground">
                          <span className="text-primary font-semibold">Click to upload</span> or drag and drop images
                        </div>
                        <p className="text-[10px] text-muted-foreground/40 font-mono">
                          PNG, JPG or WEBP (MAX 1MB per file)
                        </p>
                      </div>
                    </div>
                    {files.length > 0 && (
                      <div className="text-xs text-emerald-500 font-mono mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                        Files ready: {files.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Submit button — visually dimmed when location is blocked */}
                  <div className="space-y-2">
                    <GlowButton
                      type="submit"
                      disabled={loading || locationStatus === "requesting"}
                      onClick={isLocationBlocked ? () => setLocationBlockedMsg(true) : undefined}
                      className={`w-full gap-2 mt-2 py-2.5 ${isLocationBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {loading ? "Registering Intake…" : "Submit Intake Report"} <ArrowRight className="h-4 w-4" />
                    </GlowButton>
                    {isLocationBlocked && (
                      <p className="text-[10px] text-center font-mono text-red-400/80 flex items-center justify-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        GPS location required to submit
                      </p>
                    )}
                  </div>
                </form>
              </>
            )}
          </GlassCard>

          {/* Left Column (Safety Guidelines) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Safety Guidelines</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Do not attempt to touch, examine, or pack chemical toxins or high-risk industrial scraps. Report the coordinate locations immediately and let municipal clean units handle intake.
              </p>
            </GlassCard>

            <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <span>Audit &amp; Verification</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our logistics scheduling algorithms process reports dynamically, cross-checking locations against active municipal collection boundaries to optimize truck fuel usage.
              </p>
            </GlassCard>

            <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Location Privacy</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your GPS coordinates are used exclusively for waste dispatch routing and are never shared with third parties. Accurate location ensures faster municipal response times.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* User's Submitted Reports History */}
        {reports.length > 0 && (
          <div className="mt-16 max-w-6xl mx-auto space-y-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Your Submitted Waste Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <GlassCard key={report.id} animateReveal={false} hoverEffect={true} className="border-border/10 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold uppercase font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary">
                      {report.type}
                    </span>
                    <span className="text-[9px] font-mono bg-primary/5 border border-primary/10 px-2 py-0.5 rounded text-primary/80">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-semibold leading-relaxed">
                    {report.location}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {report.description}
                  </p>
                  {report.fileUrl && (
                    <div className="text-[10px] font-mono bg-primary/5 border border-primary/10 rounded-lg p-2 flex items-center justify-between">
                      <span className="text-muted-foreground/80">Photo Evidence</span>
                      <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                        View Image
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60 pt-2 border-t border-border/5">
                    <span>Quantity: {report.quantity} Tons</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
