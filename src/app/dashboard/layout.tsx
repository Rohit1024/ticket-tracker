import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/shared/user";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { globalConfig } from "@/config/site";

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const tokens = await getTokens(cookies(), authConfig);
  if (!tokens) {
    redirect("/signin");
  }
  const user = toUser(tokens);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-40 border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={globalConfig.mainNav} />
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserAccountNav user={user} />
          </div>
        </div>
      </header>
      <main className="flex w-full flex-col overflow-hidden p-4">
        {children}
      </main>
      {/* <SiteFooter className="border-t" /> */}
    </div>
  );
}
