import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const metisSepolia = defineChain({
  id: 59902,
  name: "Metis Sepolia",
  nativeCurrency: { name: "Metis", symbol: "METIS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.metisdevops.link/"] },
  },
  blockExplorers: {
    default: {
      name: "Metis Sepolia Explorer",
      url: "https://sepolia-explorer.metisdevops.link/",
    },
  },
});

export const config = createConfig({
  chains: [metisSepolia],
  connectors: [injected()],
  transports: {
    [metisSepolia.id]: http(),
  },
});
