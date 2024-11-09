// import { defineChain } from "viem";
// import { createConfig, http } from "wagmi";
// import { injected } from "wagmi/connectors";

// declare module "wagmi" {
//   interface Register {
//     config: typeof config;
//   }
// }

// // TODO: Change to GOAT
// export const metisSepolia = defineChain({
//   id: 59902,
//   name: "Metis Sepolia",
//   nativeCurrency: { name: "Metis", symbol: "METIS", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://sepolia.metisdevops.link/"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Metis Sepolia Explorer",
//       url: "https://sepolia-explorer.metisdevops.link/",
//     },
//   },
// });

// export const config = createConfig({
//   chains: [metisSepolia],
//   connectors: [injected()],
//   transports: {
//     [metisSepolia.id]: http(),
//   },
// });

// export enum Language {
//   RUST = "rust",
//   GO = "go",
// }
