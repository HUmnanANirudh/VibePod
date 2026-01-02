"use client";

import { authClient } from "@/lib/auth-client";
import { GoogleLoginModal } from "@/components/vibe/GoogleLoginModal";
import { UserAvatar } from "./UserAvatar";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";

export function AuthWrapper() {
  const { data: session, isPending } = authClient.useSession();
  const [showModal, setShowModal] = useState(false);

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  if (isPending) {
    return (
      <div className="h-9 w-9 rounded-full bg-zinc-800 animate-pulse" />
    );
  }

  if (session?.user) {
    return <UserAvatar user={session.user} />;
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        size="sm"
        className="gap-2 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-cyan-500/50 text-zinc-300"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>
      <GoogleLoginModal open={showModal} onLogin={handleGoogleLogin} />
    </>
  );
}
