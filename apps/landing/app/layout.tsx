import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme/theme-provider";

export const metadata: Metadata = {
  title: "CoBrain",
  description: "CoBrain is a platform for sharing a slice of your mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background text-foreground" suppressHydrationWarning>
      <body
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
