import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Luminai - AI Career Coach",
  description: "AI Career Coach - Crafted with precision and code by Shumayl",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`} >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header></Header>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            {/* footer */}
            <footer className="w-full flex items-center justify-center bg-muted/50 py-12 text-[12px] md:text-base">
              <div className="mx-auth px-4 py-auto text-center justify-center text-gray-200">
                <p >
                  Lumin-AI, Crafted with precision and code by Shumayl
                </p>
                <span >
                Copyright  &copy; 2025, All rights reserved.
                </span>
              </div>
            </footer>

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}
