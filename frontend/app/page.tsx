"use client";

import React, { Suspense, useEffect } from "react";
import { Marketplace } from "@/components/marketplace/marketplace";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function HomePage() {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading during SSR/hydration
  if (!isMounted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show marketplace only if connected
  return (
    <div className="bg-background min-h-screen">
      <Navigation currentPage="marketplace" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <Marketplace />
      </Suspense>
      <Footer />
    </div>
  );
}
