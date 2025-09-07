"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  nftCount?: number;
  myNftCount?: number;
  className?: string;
}

export function CategoryTabs({
  activeTab,
  onTabChange,
  nftCount = 0,
  myNftCount = 0,
  className,
}: CategoryTabsProps) {
  const tabs: Tab[] = [
    { id: "nfts", label: "NFTs", count: nftCount },
    { id: "my-nfts", label: "My NFTs", count: myNftCount }
  ];
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 items-center justify-start w-full",
        className
      )}
    >
      <div className="h-px w-full bg-text-caption" />
      <div className="flex items-start justify-center md:justify-start w-full max-w-[1050px]">
        <div className="flex items-start justify-start overflow-x-auto md:overflow-x-visible">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex gap-2 md:gap-4 h-[60px] items-center justify-center px-4 md:px-[30px] py-0 relative whitespace-nowrap transition-colors",
                activeTab === tab.id && "border-b-2 border-text-caption"
              )}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span
                className={cn(
                  "capitalize font-work-sans font-semibold text-lg md:text-h5 text-center transition-colors",
                  activeTab === tab.id ? "text-white" : "text-text-caption"
                )}
              >
                {tab.label}
              </span>
              <motion.div
                className={cn(
                  "rounded-[20px] flex gap-2.5 items-center justify-start px-2.5 py-[5px] transition-colors",
                  activeTab === tab.id
                    ? "bg-text-caption"
                    : "bg-background-secondary"
                )}
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-space-mono text-sm md:text-base text-white">
                  {tab.count}
                </span>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
