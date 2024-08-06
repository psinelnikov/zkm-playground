"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/header";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import { Pagination } from "@/components/pagination";
import { LanguageContext } from "./context";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

// export const metadata: Metadata = {
//   title: "Playground",
//   description: "This is a playground to test the ZKM Prover Service",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [language, setLanguage] = useState("golang");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LanguageContext.Provider value={language}>
          <html lang="en">
            <body className={inter.className}>
              <NavBar setLanguage={setLanguage} />
              <main className="flex flex-col items-center mt-10 mx-24">
                <div className="w-full flex flex-col items-center font-mono text-sm ">
                  {children}
                  <Pagination />
                </div>
              </main>
            </body>
          </html>
        </LanguageContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
