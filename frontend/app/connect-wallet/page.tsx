"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectWalletDemo } from "@/components/wallet";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWallet } from "@/hooks/use-wallet";

export default function ConnectWalletPage() {
  const router = useRouter();
  const { isConnected, isConnecting } = useWallet();
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to home if already connected
  useEffect(() => {
    if (isMounted && isConnected && !isConnecting) {
      router.push("/");
    }
  }, [isMounted, isConnected, isConnecting, router]);

  // Show loading during SSR/hydration
  if (!isMounted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect if already connected
  if (isConnected) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-white">Redirecting to marketplace...</p>
        </div>
      </div>
    );
  }

  // Show connect wallet page if not connected
  return (
    <div className="bg-background min-h-screen">
      <Navigation
        className="absolute top-0 left-0 right-0 z-10"
        currentPage="connect-wallet"
      />
      <div className="pt-[80px]">
        <ConnectWalletDemo />
      </div>
      <Footer />
    </div>
  );
}
