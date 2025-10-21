export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/request/:path*",
    "/admin/:path*",
    "/api/visa-application/:path*",
    "/api/admin/:path*",
  ],
};


