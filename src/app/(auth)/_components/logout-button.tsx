"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/auth/firebase";
import { logout } from "@/api";

export function LogOutButtons() {
  const router = useRouter();
  const mounted = useMounted();
  const [isPending, startTransition] = React.useTransition();

  async function signOutUser() {
    const auth = getFirebaseAuth();
    try {
      await signOut(auth);
      await logout();
      toast.success("Signed out Successfully");
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="flex w-full items-center space-x-2">
      {mounted ? (
        <Button
          aria-label="Log out"
          size="sm"
          className="w-full"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await signOutUser();
            });
          }}
        >
          {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          Sign out
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-muted text-muted-foreground w-full",
          )}
        >
          Log out
        </Skeleton>
      )}
      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Go back
      </Button>
    </div>
  );
}
