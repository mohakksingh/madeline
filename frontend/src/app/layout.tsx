import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // The instruction provided a className using geistSans and geistMono,
        // but did not include their imports. To maintain syntactical correctness
        // as per instructions, the original 'inter.className' is kept.
        // If geistSans and geistMono are intended, their imports must be added.
        className={`${inter.className} bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
