"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  className?: string;
}

export function WalletButton({ className }: WalletButtonProps) {
  const router = useRouter();
  const {
    isConnected,
    isConnecting,
    formattedAddress,
    formattedBalance,
    disconnectWallet,
  } = useWallet();

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button className={cn("gap-2", className)} disabled>
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          className="gap-2"
          disabled={isConnecting}
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{formattedAddress}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {showDropdown && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-64 bg-background-secondary rounded-[15px] border border-background shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-4">
              <div className="text-sm text-text-caption mb-1">Address</div>
              <div className="text-white font-mono text-sm mb-3">
                {formattedAddress}
              </div>

              <div className="text-sm text-text-caption mb-1">Balance</div>
              <div className="text-white font-mono text-sm mb-4">
                {formattedBalance}
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  disconnectWallet();
                  setShowDropdown(false);
                }}
                className="w-full"
              >
                Disconnect
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <Button
      className={cn("gap-2", className)}
      disabled={isConnecting}
      onClick={() => {
        if (!isConnecting) {
          router.push("/connect-wallet");
        }
      }}
    >
      {isConnecting ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </Button>
  );
}
