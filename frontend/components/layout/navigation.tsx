import React from "react";
import Link from "next/link";
import { WalletButton } from "@/components/wallet/wallet-button";

interface NavigationProps {
  className?: string;
  currentPage?: string;
}

export function Navigation({ className = "", currentPage }: NavigationProps) {
  return (
    <nav
      className={`bg-background px-4 md:px-[50px] py-5 flex items-center justify-between ${className}`}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 relative">
          {/* Storefront Icon */}
          <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
            <path
              d="M12.5 25V15.625H19.5V25"
              stroke="#A259FF"
              strokeWidth="2"
            />
            <path d="M4 12.5V4H28V12.5" stroke="#A259FF" strokeWidth="2" />
            <path d="M7 7V12.5H12.5V7" stroke="#A259FF" strokeWidth="2" />
            <path d="M19.5 7V12.5H25V7" stroke="#A259FF" strokeWidth="2" />
            <path d="M4 7V12.5H7V7" stroke="#A259FF" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-white font-work-sans text-lg md:text-xl font-bold">
          NFT Marketplace
        </span>
      </Link>

      <div className="flex items-center gap-2.5">
        <WalletButton />
      </div>
    </nav>
  );
}
