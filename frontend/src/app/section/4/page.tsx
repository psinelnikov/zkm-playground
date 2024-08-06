"use client";
import { SendTx } from "@/components/sendTx";
import { Output } from "@/components/output";
import WalletConnectButton from "@/components/walletConnection";
import { useEffect, useState } from "react";

export default function Section4() {
  const [formattedProof, setFormattedProof] = useState("");

  useEffect(() => {
    const textProof = localStorage.getItem("proof");
    if (textProof) {
      const proofObject = JSON.parse(textProof);
      setFormattedProof(JSON.stringify(proofObject, undefined, 4));
    }
  }, []);

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
        <Output text={formattedProof} language="json" />
        <SendTx text="Mint Tokens" />
      </div>
    </div>
  );
}
