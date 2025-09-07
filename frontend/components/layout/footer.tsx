import React from "react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`bg-background-secondary px-4 md:px-[50px] lg:px-[195px] py-10 ${className}`}
    >
      <div className="max-w-[1050px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-[30px]">
          <div className="w-full lg:w-[327px] lg:pr-[84px]">
            <div className="flex items-center gap-2.5 mb-[30px] justify-center lg:justify-start">
              <div className="w-8 h-8">
                <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M12.5 25V15.625H19.5V25"
                    stroke="#A259FF"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 12.5V4H28V12.5"
                    stroke="#A259FF"
                    strokeWidth="2"
                  />
                  <path d="M7 7V12.5H12.5V7" stroke="#A259FF" strokeWidth="2" />
                  <path
                    d="M19.5 7V12.5H25V7"
                    stroke="#A259FF"
                    strokeWidth="2"
                  />
                  <path d="M4 7V12.5H7V7" stroke="#A259FF" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-white font-work-sans text-xl font-bold">
                NFT Marketplace
              </span>
            </div>
            <div className="flex flex-col gap-5 text-center lg:text-left">
              <p className="text-text-secondary text-body max-w-[238px] mx-auto lg:mx-0">
                NFT marketplace UI created with Anima for Figma.
              </p>
              <div>
                <p className="text-text-secondary text-body mb-[15px]">
                  Join our community
                </p>
                <div className="flex gap-2.5 justify-center lg:justify-start">
                  <a
                    href="#"
                    className="w-8 h-8 text-2xl hover:opacity-80 transition-opacity"
                  >
                    📱
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 text-2xl hover:opacity-80 transition-opacity"
                  >
                    📺
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 text-2xl hover:opacity-80 transition-opacity"
                  >
                    🐦
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 text-2xl hover:opacity-80 transition-opacity"
                  >
                    📷
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-60 flex flex-col gap-[25px] text-center lg:text-left">
            <h3 className="text-lg md:text-h5 font-space-mono font-bold text-white capitalize">
              Explore
            </h3>
            <div className="flex flex-col gap-5 text-text-secondary">
              <a href="/" className="hover:text-white transition-colors">
                Marketplace
              </a>

              <a
                href="/connect-wallet"
                className="hover:text-white transition-colors"
              >
                Connect a wallet
              </a>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-[25px] text-center lg:text-left">
            <h3 className="text-lg md:text-h5 font-space-mono font-bold text-white capitalize">
              Join our weekly digest
            </h3>
            <div className="flex flex-col gap-5">
              <p className="text-text-secondary text-body max-w-[330px] mx-auto lg:mx-0">
                Get exclusive promotions & updates straight to your inbox.
              </p>
              <div className="bg-white rounded-[20px] p-4 pl-5 pr-0 flex gap-3 items-center h-[60px] w-full max-w-[420px] mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="flex-1 bg-transparent text-background outline-none"
                />
                <button className="bg-primary text-white hover:bg-primary/90 inline-flex items-center justify-center gap-3 font-semibold rounded-[20px] transition-colors px-[30px] py-0 text-base h-[60px]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full">
          <div className="h-px bg-text-caption"></div>
          <p className="text-text-secondary text-caption text-center lg:text-left">
            Ⓒ NFT Market. Use this template freely.
          </p>
        </div>
      </div>
    </footer>
  );
}
