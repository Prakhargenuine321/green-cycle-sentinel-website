"use client";

import React, { useState } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowInput, GlowTextarea } from "@/components/ui/glow-input";
import { GlowButton } from "@/components/ui/glow-button";
import { Send, MapPin, Mail, Check } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";
import { submitContactInquiryAction } from "@/app/actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await submitContactInquiryAction({
      name: formData.name,
      email: formData.email,
      org: formData.org,
      subject: formData.subject,
      message: formData.message,
    });

    setLoading(false);
    if (res.success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", org: "", subject: "general", message: "" });
    } else {
      setError(res.error || "Failed to dispatch message");
    }
  };

  const offices = [
    { city: "San Francisco, CA", address: "142 Mission St, Suite 400", email: "sf@gcsentinel.com" },
    { city: "Berlin, Germany", address: "Schönhauser Allee 12B", email: "eu@gcsentinel.com" },
  ];

  return (
    <div className="relative min-h-screen py-16">
      {/* Background grids */}
      <GridBackground showGlow={true} glowPosition="top-right" animateReveal={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            variants={staggerChildFadeInUp}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Connect with Sentinel Engineers</span>
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Initiate Circular <span className="text-gradient-green">Partnerships</span>
          </h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Get in touch to explore Municipal trials, access our VC Dataroom, or request specs sheet packages.
          </motion.p>
        </motion.div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Office details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Inquiry Channels
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose the correct division to expedite processing loops. Our typical response latency is under 12 hours.
              </p>
            </div>

            <div className="space-y-6">
              {offices.map((office) => (
                <GlassCard key={office.city} animateReveal={false} hoverEffect={true} className="border-border/10 p-5 space-y-3">
                  <h3 className="font-heading text-base font-bold text-foreground flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{office.city}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed pl-6">
                    {office.address}
                  </p>
                  <p className="text-xs text-primary font-mono pl-6">
                    {office.email}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right Column: Submission Form */}
          <GlassCard animateReveal={false} hoverEffect={false} className="lg:col-span-7 border-border/15 p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Inquiry Dispatched
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you. Your request has been queued in our routing system. A representative from the respective desk will follow up shortly.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500 font-mono text-center mb-4">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                      Your Name
                    </label>
                    <GlowInput
                      required
                      placeholder="Elena Rostova"
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
                      placeholder="elena@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                      Organization
                    </label>
                    <GlowInput
                      placeholder="Municipal Council Inc"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                      Inquiry Target
                    </label>
                    <select
                      className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:ring-3 focus:ring-primary/25 text-foreground appearance-none cursor-pointer"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="general">General Inquiries</option>
                      <option value="partner">Municipal Partnerships</option>
                      <option value="investor">Venture Investments</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                    Message Details
                  </label>
                  <GlowTextarea
                    required
                    placeholder="Describe your inquiry target or Municipal specs requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <GlowButton type="submit" disabled={loading} className="w-full gap-2 mt-2 py-2.5">
                  {loading ? "Dispatching..." : "Dispatch Message"} <Send className="h-4 w-4" />
                </GlowButton>
              </form>
            </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
