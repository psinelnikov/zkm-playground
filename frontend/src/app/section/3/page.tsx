"use client";
import { SendTx } from "@/components/sendTx";
import { Proof } from "@/components/proof";
import WalletConnectButton from "@/components/walletConnection";

export default function Section2() {
  return (
    <div className="flex w-full gap-4 flex-wrap">
      <div className="flex-1 ">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Verifying the Proof On Chain
        </h1>
        <p>Verifying the Proof</p>
      </div>
      <div className="flex-1 ">
        <WalletConnectButton />
        <Proof />
        <SendTx />
      </div>
    </div>
  );
}
