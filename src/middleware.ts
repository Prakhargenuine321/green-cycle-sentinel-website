import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthenticated = request.cookies.get("user_authenticated")?.value === "true";
  const userRole = request.cookies.get("user_role")?.value;
  const hasInvestorBypass = request.cookies.get("investor_bypass")?.value === "true";

  // 1. Guard /report-waste: requires citizen/user registration
  if (pathname.startsWith("/report-waste")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard /investor-room: requires INVESTOR/ADMIN or bypass passcode cookie
  if (pathname.startsWith("/investor-room")) {
    const isInvestorOrAdmin = userRole === "INVESTOR" || userRole === "ADMIN";
    if (!isInvestorOrAdmin && !hasInvestorBypass) {
      // Redirect to the login page with a query param indicating they want to access the investor boardroom
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/report-waste/:path*", "/investor-room/:path*"],
};
