"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { switchChain } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";
import { config } from "@/app/config";
import { useEffect } from "react";

const WalletConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const metaMaskConnector = connectors.find(
    (connector) => connector.id === "io.metamask"
  );
  const rabbyConnector = connectors.find(
    (connector) => connector.id === "io.rabby"
  );

  useEffect(() => {
    const switchToSepolia = async () => {
      await switchChain(config, { chainId: sepolia.id });
    };

    if (isConnected) {
      switchToSepolia();
    }
  }, [isConnected]);

  if (isConnected) {
    return (
      <div className="flex flex-row items-center justify-end gap-4">
        <div className="font-sm">Connected to {address}</div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }
  return (
    <div>
      {metaMaskConnector && (
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => connect({ connector: metaMaskConnector })}
        >
          {metaMaskConnector.name}
        </button>
      )}
      {rabbyConnector && (
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => connect({ connector: rabbyConnector })}
        >
          {rabbyConnector.name}
        </button>
      )}
    </div>
  );
};
export default WalletConnectButton;