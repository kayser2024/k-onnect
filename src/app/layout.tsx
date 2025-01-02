import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import { QueryProvider } from "@/components/provider/QueryProvider";
import NProgress from "@/components/NProgress";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATC Kayser",
  description: "Web-App Atencion al cliente Kayser",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              {children}
              <NProgress />
              <Toaster richColors />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
