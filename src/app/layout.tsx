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
      <head>
        <link rel="icon" href="/Favicon.png" sizes="any" />
        <meta name="description" content={`${metadata.description}`} />
        <meta name="keywords" content={`${metadata.keywords}`} />
      </head>
      <body className={`${satoshiFont.className}`}>
        <div className="md:flex h-screen">
          <Sidebar />
          <div className="md:flex-1 h-screen bg-gray-50">{children}</div>
        </div>
        {/* {children} */}
      </body>
    </html>
  );
}
