import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from 'next/font/google';
import Nav from "@/components/Nav";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "./config";
import { Providers } from "./providers";

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
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
  return (

    <html lang="en" className={`${inter.variable} ${Caleb.variable}`}>
      <body className="dark bg-background text-foreground">
        <Nav></Nav>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
