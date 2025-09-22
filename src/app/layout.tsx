import "./globals.css";
import localFont from "next/font/local";
import QueryProvider from "@/provider/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/Favicon.png" type="image/x-icon" />
      <ClerkProvider>
        <body className={satoshiFont.className}>
          <QueryProvider>
            <div>{children}</div>
          </QueryProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
