"use client";
import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { utils } from "web3";
import verifierAbi from "@/abi/verifier.abi.json";
import mytokenAbi from "@/abi/mytoken.abi.json";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { getTransaction } from "@wagmi/core";
import { config } from "@/app/config";

export const Proof = () => {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract({ config });
  const [proof, setProof] = useState<string | null>(null);
  const [valueOfBurn, setValueOfBurn] = useState("0");
  const [receiveAddr, setReceiveAddr] = useState("");
  const [isShowSubmit, setIsShowSubmit] = useState(false);
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [formattedProof, setFormattedProof] = useState("");

  useEffect(() => {
    const textProof = localStorage.getItem("proof");
    setProof(textProof);

    if (textProof) {
      const proofObject = JSON.parse(textProof);

      setFormattedProof(JSON.stringify(proofObject, undefined, 4));
    }
  }, []);

  // useEffect(() => {
  //   const fetchTransactionValue = async () => {
  //     const burnValue = await getTransaction(config, {
  //       chainId: 1,
  //       hash: burnTransaction as `0x${string}`,
  //     });
  //     const bigintConvert = burnValue.value;

  //     if (burnValue.to === "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead") {
  //       setValueOfBurn(bigintConvert.toString());
  //     }
  //   };

  //   fetchTransactionValue();
  // }, [burnTransaction]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center mx-auto w-full">
        <textarea
          className="block p-2.5 w-full h-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formattedProof || ""}
          onChange={() => {}}
          rows={10}
        />
      </div>
    </div>
  );
};
