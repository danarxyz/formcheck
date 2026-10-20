import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { copy } from "@/copy";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: copy.appName,
  description: copy.tagline,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
          <nav className="mx-auto flex h-12 max-w-2xl items-center justify-between px-4">
            <Link href="/" className="font-semibold tracking-tight">
              {copy.appName}
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                {copy.nav.today}
              </Link>
              <Link href="/library" className="text-muted-foreground hover:text-foreground">
                {copy.nav.library}
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
