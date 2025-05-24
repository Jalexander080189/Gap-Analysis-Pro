import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GAP ANALYSIS PRO",
  description: "A consultative company audit tool for SMB company owners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center">GAP ANALYSIS PRO</h1>
            <p className="text-center text-gray-600">A consultative company audit tool for SMB company owners</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
