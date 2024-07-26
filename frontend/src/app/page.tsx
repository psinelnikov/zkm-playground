"use client";
import { WagmiProvider } from "wagmi";
import { Panel } from "@/components/panel";
import { config } from "./config";
import WalletConnectButton from "@/components/wallet_connection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 w-full flex flex-col max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            {/* <WalletConnectButton /> */}
            <Panel />
          </div>
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
