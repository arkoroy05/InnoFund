import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import { Providers } from "./providers";
import Nav from "@/components/Nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
export { metadata } from './metadata';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  preload: true,
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
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${Caleb.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <ToastContainer position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
