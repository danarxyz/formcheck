"use client";

import { useState } from "react";
import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { copy } from "@/copy";

export function SignInButton() {
  const [pending, setPending] = useState(false);
  const [denied, setDenied] = useState(false);

  async function signIn() {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/sign-in?denied=1",
    });
    if (error) {
      setDenied(true);
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button size="lg" onClick={signIn} disabled={pending}>
        {copy.auth.google}
      </Button>
      {denied && <p className="text-destructive text-sm">{copy.auth.denied}</p>}
    </div>
  );
}
