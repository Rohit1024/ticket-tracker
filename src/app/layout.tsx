import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";

import { Toaster } from "sonner";
import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import { getTokens } from "next-firebase-auth-edge";
import { authConfig } from "@/config/server-config";
import { cookies } from "next/headers";
import { toUser } from "@/shared/user";
import { AuthProvider } from "@/auth/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "react server components",
    "table",
    "react-table",
    "tanstack-table",
    "shadcn-table",
  ],
  authors: [
    {
      name: "rohit1024",
      url: "http://localhost:3000",
    },
  ],
  creator: "rohit1024",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? toUser(tokens) : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
          fontHeading.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <AuthProvider user={user}>{children}</AuthProvider>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
