import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import ChatWidget from "@/components/chat/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MaiBeauti - AI-Powered Skincare",
  description: "Personalized skincare solutions powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CartDrawer />
        <ChatWidget />
        <Toast />
      </body>
    </html>
  );
}