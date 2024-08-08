"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { switchChain } from "@wagmi/core";
import { config, metisSepolia } from "@/app/config";
import { useEffect } from "react";
import { getConnections } from "wagmi/actions";
import { injected } from "wagmi/connectors";

const WalletConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const switchToMetisSepolia = async () => {
      const connections = getConnections(config);
      await switchChain(config, {
        chainId: metisSepolia.id,
        connector: connections[0]?.connector,
      });
    };

    if (isConnected) {
      switchToMetisSepolia();
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
    <>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={() => connect({ connector: injected() })}
      >
        Connect
      </button>
    </>
  );
};
export default WalletConnectButton;
