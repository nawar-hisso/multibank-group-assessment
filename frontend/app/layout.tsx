import type { Metadata } from "next";
import "./globals.css";
import { WagmiProviderWrapper } from "@/providers/wagmi-provider";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
  title: "NFT Marketplace - Discover Digital Art & Collect NFTs",
  description:
    "NFT marketplace UI created with Anima for Figma. Collect, buy and sell art from more than 20k NFT artists.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary font-work-sans antialiased">
        <WagmiProviderWrapper>
          {children}
          <ToastProvider />
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}
