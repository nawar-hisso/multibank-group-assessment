"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#3B3B3B",
          color: "#FFFFFF",
          border: "1px solid #A259FF",
          borderRadius: "15px",
        },
        success: {
          iconTheme: {
            primary: "#A259FF",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}
