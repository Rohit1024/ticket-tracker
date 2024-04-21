import { type Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { OAuthSignIn } from "@/app/(auth)/_components/oauth-signin";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Sign In With Google Auth Provider</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OAuthSignIn />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2"></CardFooter>
      </Card>
    </Shell>
  );
}
