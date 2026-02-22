import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FinancialProvider } from "@/context/FinancialContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UYO — Know Your Worth, Down to the Dollar",
  description: "UYO breaks down your total compensation so you can negotiate smarter and plan with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <FinancialProvider>{children}</FinancialProvider>
      </body>
    </html>
  );
}
