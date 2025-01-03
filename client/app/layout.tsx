import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Innofund",
  description: "Innofund is a web3 based DeFi application for research papers.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className={inter.variable}>
      <body className="dark bg-backgroundtext-foreground font-sans">
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
