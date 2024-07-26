import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask, injected } from "wagmi/connectors";
const MetaMaskOptions = {
  dappMetadata: {
    name: "Mint Prove",
  },
  infuraAPIKey: "YOUR-API-KEY",
  // Other options.
};

export const config = createConfig({
  chains: [sepolia],
  ssr: false,
  connectors: [metaMask(MetaMaskOptions), injected()],
  transports: {
    [sepolia.id]: http(),
  },
});
