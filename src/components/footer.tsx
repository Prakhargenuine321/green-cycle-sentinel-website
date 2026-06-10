"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Check } from "lucide-react";
import { GlowInput } from "@/components/ui/glow-input";
import { GlowButton } from "@/components/ui/glow-button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const footerLinks = [
    {
      title: "Technology",
      links: [
        { label: "Waste-to-Energy", href: "/technology#waste-to-energy" },
        { label: "Smart Collection", href: "/technology#smart-collection" },
        { label: "Air Purification", href: "/technology#air-purification" },
        { label: "AQI Monitoring", href: "/technology#aqi-monitoring" },
      ],
    },
    {
      title: "Innovation",
      links: [
        { label: "Research & Innovation", href: "/research" },
        { label: "Circular Economy", href: "/technology#circular-economy" },
        { label: "Sustainability Metrics", href: "/sustainability" },
        { label: "Certifications", href: "/achievements" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Products", href: "/products" },
        { label: "Partners", href: "/contact#partners" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Investor Portal", href: "/investors" },
        { label: "Security", href: "/security" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border/10 transition-colors duration-500 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        {/* Brand Details & Column */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <Link href="/" className="flex items-center space-x-2 group focus:outline-none">
            <div className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-primary-foreground animate-pulse" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight bg-clip-text text-foreground">
              GCS <span className="font-sans font-light text-muted-foreground/80 text-sm">Sentinel</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Pioneering smart waste-to-energy ecosystems, intelligent air purification, and sustainable circular infrastructure for our collective future.
          </p>

          {/* Premium Newsletter Sign-up */}
          <div className="max-w-sm pt-2">
            <h4 className="text-sm font-semibold text-foreground mb-3 font-heading">
              Subscribe to Sentinel Insights
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-grow">
                <GlowInput
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 bg-background/30"
                />
              </div>
              <GlowButton type="submit" size="icon" className="shrink-0">
                {subscribed ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </GlowButton>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-500 mt-2 font-medium">
                Thank you! You have subscribed successfully.
              </p>
            )}
          </div>
        </div>

        {/* Directory Links Columns */}
        {footerLinks.map((group) => (
          <div key={group.title} className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-foreground font-heading tracking-wider uppercase">
              {group.title}
            </h3>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-250"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 border-t border-border/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>
          © {new Date().getFullYear()} Green Cycle Sentinel Inc. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <span className="hover:text-primary transition-colors duration-200 cursor-pointer">
            ESG Impact Certified
          </span>
          <span className="hover:text-primary transition-colors duration-200 cursor-pointer">
            ISO 14001 Compliant
          </span>
          <span className="hover:text-primary transition-colors duration-200 cursor-pointer">
            Circular Economy Foundation
          </span>
        </div>
      </div>
    </footer>
  );
}
