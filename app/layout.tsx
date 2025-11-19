import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CPSD Practice App",
  description: "Study app for the CPSD Supply Management Core exam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the whole app in SessionProvider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
