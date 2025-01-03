import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from 'next/font/google';
import Nav from "@/components/Nav";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const Caleb = localFont({
  src: [
    {
      path: 'fonts/CSCalebMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-caleb',
})

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
    <html lang="en" className={`${inter.variable} ${Caleb.variable}`}>
      <body className="dark bg-background text-foreground font-sans">
        <Nav />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
