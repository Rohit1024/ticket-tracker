import { type NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
import { authConfig } from "./config/server-config";

const PUBLIC_PATHS = ["/", "/signin"];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async ({}, headers) => {
      // Authenticated user should not be able to access /login, /register and /reset-password routes
      // Exclude "/" from restricted paths for authenticated users
      const restrictedPaths = PUBLIC_PATHS.filter((path) => path !== "/");

      if (restrictedPaths.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      // The errors expected here are : https://next-firebase-auth-edge-docs.vercel.app/docs/errors#invalidtokenreason
      console.info("Missing or malformed credentials", { reason });
      return redirectToLogin(request, {
        path: "/signin",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });
      return redirectToLogin(request, {
        path: "/signin",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
  ],
};
