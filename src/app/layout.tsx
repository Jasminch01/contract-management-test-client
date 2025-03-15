import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Sidebar from "@/components/Sidebar";

const satoshiFont = localFont({
  src: [
    {
      path: "../asset/font/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../asset/font/Satoshi-Bold.otf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../asset/font/Satoshi-Medium.otf",
      weight: "600",
      style: "medium",
    },
    {
      path: "../asset/font/Satoshi-Light.otf",
      weight: "300",
      style: "light",
    },
  ],
});

export const metadata: Metadata = {
  title: "Contract management",
  description: "Contract management app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshiFont.className}`}>
        
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-[13%] px-5 h-screen shadow-xl border-r border-gray-200">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
