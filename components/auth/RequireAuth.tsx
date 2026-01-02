"use client";

import { authClient } from "@/lib/auth-client";
import { GoogleLoginModal } from "@/components/vibe/GoogleLoginModal";
import { useState, useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { data: session, isPending } = authClient.useSession();
  const [showModal, setShowModal] = useState(false);

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  useEffect(() => {
    // Show modal if not authenticated and not loading
    if (!isPending && !session?.user) {
      setShowModal(true);
    }
  }, [isPending, session]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Show blurred background with modal if not authenticated
  if (!session?.user) {
    return (
      <>
        <div className="blur-sm pointer-events-none select-none">
          {fallback || children}
        </div>
        <GoogleLoginModal open={showModal} onLogin={handleGoogleLogin} />
      </>
    );
  }

  return <>{children}</>;
}
