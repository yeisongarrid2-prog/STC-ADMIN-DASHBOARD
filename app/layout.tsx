import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import DashboardLayout from "./components/DashboardLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "STC Helpdesk",
  description: "Internal Helpdesk Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-[#F9FAFB]" suppressHydrationWarning>
        <DashboardLayout>
          {children}
        </DashboardLayout>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
