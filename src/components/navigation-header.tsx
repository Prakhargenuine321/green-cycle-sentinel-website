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
  { label: "Simulator", href: "/simulator" },
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

  // 1. Scroll listener — mount/unmount only, no pathname dependency
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Auth check + mounted flag — re-run whenever route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Inline auth logic avoids stale-closure exhaustive-deps warning
      const cookiesArr = document.cookie.split("; ");
      const authCookie = cookiesArr.find((c) => c.startsWith("user_authenticated="));
      const roleCookie = cookiesArr.find((c) => c.startsWith("user_role="));
      setIsAuthenticated(authCookie ? authCookie.split("=")[1] === "true" : false);
      setUserRole(roleCookie ? roleCookie.split("=")[1] : "");
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // 3. Close mobile drawer on route change (skip initial mount)
  const isMountedRef = React.useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      setIsOpen(false);
    } else {
      isMountedRef.current = true;
    }
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserRole("");
    setIsOpen(false);
    await logoutAction();
    router.refresh();
    router.push("/");
  };

  // Compile Dynamic Navigation Links
  const navItems = [...baseNavItems];
  const hasBypass =
    typeof document !== "undefined" &&
    document.cookie.includes("investor_bypass=true");
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
          ? "glass-card bg-background/80 py-2.5 shadow-md border-border/10"
          : "bg-transparent py-4 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* ── Brand Logo ──────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 group focus:outline-none shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            GCS{" "}
            <span className="font-sans font-light text-muted-foreground/80 text-sm">
              Sentinel
            </span>
          </span>
        </Link>

        {/* ── Desktop Navigation (lg+) ─────────────────────────────────── */}
        {/* Breakpoint moved to lg so 7 links fit without crowding */}
        <nav
          className="hidden lg:flex items-center gap-1 flex-1 justify-center"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[13px] font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:text-primary focus:outline-none whitespace-nowrap",
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:bg-muted/40"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Actions (lg+) ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Sign In / Sign Out */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-[13px] font-medium text-red-400 hover:text-red-500 transition-colors duration-200 py-1.5 px-3 rounded-lg hover:bg-red-500/5 focus:outline-none flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-1.5 px-3 rounded-lg hover:bg-muted/50 focus:outline-none"
            >
              Sign In
            </Link>
          )}

          {/* Report Waste CTA */}
          <div className="relative group/reportbtn">
            <GlowButton
              size="sm"
              disabled
              className="opacity-50 cursor-not-allowed pointer-events-none text-[13px] h-8"
            >
              Report Waste
            </GlowButton>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-foreground text-background rounded-lg text-[11px] font-mono font-medium whitespace-nowrap opacity-0 group-hover/reportbtn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-50">
              ⏳ Initiating soon
            </div>
          </div>
        </div>

        {/* ── Mobile / Tablet Action Row (< lg) ───────────────────────── */}
        <div className="flex items-center gap-1 lg:hidden">
          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile / Tablet Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden glass-card bg-background/95 border-b border-border/10 w-full overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1 max-w-7xl mx-auto">
              {/* Nav links — 2-column grid on sm, single col on xs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="mt-3 pt-4 border-t border-border/10 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                {/* Sign In / Sign Out */}
                {isAuthenticated ? (
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    Sign In
                  </Link>
                )}

                {/* Report Waste CTA */}
                <div className="relative group/reportbtnmobile">
                  <GlowButton
                    disabled
                    className="w-full sm:w-auto opacity-50 cursor-not-allowed pointer-events-none text-sm"
                  >
                    Report Waste
                  </GlowButton>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-foreground text-background rounded-lg text-[11px] font-mono font-medium whitespace-nowrap opacity-0 group-hover/reportbtnmobile:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
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
