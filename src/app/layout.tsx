import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudioSpace — Find Your Space. Create Something Extraordinary.",
  description:
    "Book photo, film, music, content, and podcast studios by the hour — with live pricing, instant booking, and real availability.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply stored/system theme before first paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('studiotheme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
