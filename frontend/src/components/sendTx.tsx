import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { utils } from "web3";
import { config } from "@/app/config";
import mytokenAbi from "@/abi/mytoken.abi.json";
import { useEffect, useState } from "react";

export const SendTx = ({ text }: { text: string }) => {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract({ config });
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [proof, setProof] = useState<string | null>(null);

  useEffect(() => {
    setProof(localStorage.getItem("proof"));
  }, []);

  const clickSubmit = async (e: any) => {
    e.preventDefault();

    if (!proof) return;

    if (!isConnected) {
      window.alert("Connect wallet");
      return;
    }

    try {
      if (!proof || proof === "false" || proof == "Service is Busy") {
        return;
      }
      const proofObj = JSON.parse(proof);
      const commitmentX = utils.toBigInt(
        proofObj["Proof"]["Commitments"][0]["X"]
      );
      const commitmentY = utils.toBigInt(
        proofObj["Proof"]["Commitments"][0]["Y"]
      );
      const commitments = [commitmentX, commitmentY];
      const uint256input = proofObj["PublicWitness"].map((numStr: any) =>
        utils.toBigInt(numStr)
      );
      const aPoint = {
        X: utils.toBigInt(proofObj["Proof"]["Ar"]["X"]),
        Y: utils.toBigInt(proofObj["Proof"]["Ar"]["Y"]),
      };

      const bPoint = {
        X: [
          utils.toBigInt(proofObj["Proof"]["Bs"]["X"]["A0"]),
          utils.toBigInt(proofObj["Proof"]["Bs"]["X"]["A1"]),
        ],
        Y: [
          utils.toBigInt(proofObj["Proof"]["Bs"]["Y"]["A0"]),
          utils.toBigInt(proofObj["Proof"]["Bs"]["Y"]["A1"]),
        ],
      };

      const cPoint = {
        X: utils.toBigInt(proofObj["Proof"]["Krs"]["X"]),
        Y: utils.toBigInt(proofObj["Proof"]["Krs"]["Y"]),
      };

      const proofData = {
        a: { ...aPoint },
        b: { ...bPoint },
        c: { ...cPoint },
      };

      writeContract({
        abi: mytokenAbi,
        address: "0xD70128e085dD215F2f7a7678BD96A689b33acd5b",
        functionName: "mintWithProof",
        args: [
          address,
          1000000000000000000,
          uint256input,
          proofData,
          commitments,
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-2">
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-300 disabled:text-slate-800"
        onClick={clickSubmit}
        disabled={!isConnected || !proof}
      >
        {isPending ? "Confirming..." : text}
      </button>

      {hash && (
        <div>
          Transaction Hash:{" "}
          <a
            target="_blank"
            href={"https://sepolia-explorer.metisdevops.link/tx/" + hash}
          >
            {hash}
          </a>
        </div>
      )}
    </div>
  );
};
