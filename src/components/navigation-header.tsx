"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowButton } from "@/components/ui/glow-button";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions";

interface NavItem {
  label: string;
  href: string;
}

const baseNavItems: NavItem[] = [
  { label: "Technology", href: "/technology" },
  { label: "Products", href: "/products" },
  { label: "Research", href: "/research" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function NavigationHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Session States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  const checkAuth = () => {
    const cookiesArr = document.cookie.split("; ");
    const authCookie = cookiesArr.find((c) => c.startsWith("user_authenticated="));
    const roleCookie = cookiesArr.find((c) => c.startsWith("user_role="));

    setIsAuthenticated(authCookie ? authCookie.split("=")[1] === "true" : false);
    setUserRole(roleCookie ? roleCookie.split("=")[1] : "");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      checkAuth();
    }, 0);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    // 1. Optimistically clear UI state immediately — no waiting
    setIsAuthenticated(false);
    setUserRole("");
    setIsOpen(false);
    // 2. Call server action to delete session cookies
    await logoutAction();
    // 3. Force server components to re-render with cleared session
    router.refresh();
    // 4. Navigate to home (works even if already on "/")
    router.push("/");
  };

  // Compile Dynamic Navigation Links
  const navItems = [...baseNavItems];
  const hasBypass = typeof document !== "undefined" && document.cookie.includes("investor_bypass=true");
  if (userRole === "INVESTOR" || userRole === "ADMIN" || hasBypass) {
    navItems.push({ label: "Investor Room", href: "/investor-room" });
  }
  if (userRole === "ADMIN") {
    navItems.push({ label: "Admin Console", href: "/admin" });
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b",
        isScrolled
          ? "glass-card bg-background/80 py-3 shadow-md border-border/10"
          : "bg-transparent py-5 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Startup Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group focus:outline-none">
          <div className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-5 w-5 text-primary-foreground animate-pulse" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight bg-clip-text text-foreground group-hover:text-primary transition-colors duration-300">
            GCS <span className="font-sans font-light text-muted-foreground/80 text-sm">Sentinel</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-300 hover:text-primary focus:outline-none py-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Interactions (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Switcher Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Dynamic Sign In / Logout Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors duration-300 py-1.5 px-3 rounded-lg hover:bg-red-500/5 focus:outline-none flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-1.5 px-3 rounded-lg hover:bg-muted/50 focus:outline-none"
            >
              Sign In
            </Link>
          )}

          {/* Glowing CTA Action — disabled, initiating soon */}
          <div className="relative group/reportbtn">
            <GlowButton
              size="sm"
              disabled
              className="opacity-50 cursor-not-allowed pointer-events-none"
            >
              Report Waste
            </GlowButton>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-foreground text-background rounded-lg text-[11px] font-mono font-medium whitespace-nowrap opacity-0 group-hover/reportbtn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-50">
              ⏳ Initiating soon
            </div>
          </div>
        </div>

        {/* Mobile Interaction Row */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Hamburger Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glass-card bg-background/95 border-b border-border/10 w-full overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-border/10 pt-4 flex flex-col space-y-3 px-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="text-base font-medium text-red-400 hover:text-red-500 transition-colors duration-200 py-1 text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-1"
                  >
                    Sign In
                  </Link>
                )}
              {/* Report Waste — disabled, initiating soon */}
              <div className="relative group/reportbtnmobile w-full">
                <GlowButton
                  disabled
                  className="w-full opacity-50 cursor-not-allowed pointer-events-none"
                >
                  Report Waste
                </GlowButton>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-foreground text-background rounded-lg text-[11px] font-mono font-medium whitespace-nowrap opacity-0 group-hover/reportbtnmobile:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-50">
                  ⏳ Initiating soon
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
