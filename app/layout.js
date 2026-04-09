import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata = {
  title: "Spendora",
  description:
    "Your AI financial assistant that tracks expenses, predicts spending, and helps you save smarter.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${geistSans.className}`}>
        {/* header */}
        <main className="min-h-screen">
          <Header />

        </main>

        {children}
        <Toaster richColors/>

        {/* footer */}
        <footer className="bg-purple-700 py-12">
          <div className="container mx-auto px-4 text-center text-stone-200">
            <p>© 2024 Spendora. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}