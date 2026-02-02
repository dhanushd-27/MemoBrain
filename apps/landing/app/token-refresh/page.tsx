"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { refresh } from "../../services/auth.service";

function TokenRefreshContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  useEffect(() => {
    const performRefresh = async () => {
      try {
        await refresh();
        // Refresh successful, retry the original navigation
        router.replace(from);
      } catch {
        // Refresh failed, user must sign in again
        router.replace("/signin");
      }
    };

    performRefresh();
  }, [router, from]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Refreshing session...</p>
      </div>
    </div>
  );
}

export default function TokenRefreshPage() {
  return (
    <Suspense>
      <TokenRefreshContent />
    </Suspense>
  );
}
