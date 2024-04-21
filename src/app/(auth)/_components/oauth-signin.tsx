"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";
import { loginWithCredential } from "@/api";
import { type UserCredential } from "firebase/auth";
import { getGoogleProvider, loginWithProvider } from "@/lib/firebase-methods";
import { getFirebaseAuth } from "@/auth/firebase";
import { FirebaseError } from "firebase/app";

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const redirectAfterLogin = useRedirectAfterLogin();

  async function handleLogin(credential: UserCredential) {
    await loginWithCredential(credential);
    toast.success("Signed in successfully");
    redirectAfterLogin();
  }

  async function oauthSignIn() {
    const auth = getFirebaseAuth();
    try {
      setIsLoading(true);
      await handleLogin(await loginWithProvider(auth, getGoogleProvider(auth)));
    } catch (error: unknown) {
      setIsLoading(false);
      console.log(error);
      if (error instanceof FirebaseError) {
        toast.error(error.code);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      aria-label={`Sign in with Google`}
      variant="outline"
      className="bg-background w-full sm:w-auto"
      onClick={() => oauthSignIn()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner
          className="mr-2 size-4 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Icons.google className="mr-2 size-4" aria-hidden="true" />
      )}
      Sign in with Google
    </Button>
  );
}
