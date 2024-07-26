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
import ProgressBar from "@/components/progressbar";
import { Go } from "./languages/go";

export const Editor = () => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShowSubmit, setIsShowSubmit] = useState(false);
  const [code, setCode] = useState("");

  const clickGenerateProof = async (e: any) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const response = await fetch(
        "https://playgroundapi.zkm.io/generateProof",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, input }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to connect backend server");
      }
      const retData = await response.text();
      if (retData !== "false") {
        setIsShowSubmit(true);
      }
      localStorage.setItem("proof", retData);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    window.onmessage = function (e) {
      if (e.data?.action === "runComplete" && e.data?.result?.success) {
        const newCode = e.data.files[0].content.replace(/\\n/gm, "\\\\n");
        setCode(newCode);
        setInput(e.data.stdin);
        // handle the e.data which contains the code object
      } else if (e.data?.action === "runComplete" && !e.data?.result?.success) {
        setCode("");
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <Go />
      </div>

      <div className="flex flex-row items-center mx-auto mt-4">
        {isGenerating && <Loading />}
        {!isGenerating && (
          <button
            type="button"
            className="text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-50 disabled:text-slate-500"
            disabled={code.length == 0}
            onClick={(e) => clickGenerateProof(e)}
          >
            Generate Proof
          </button>
        )}
      </div>

      <div className="flex flex-row items-center w-full">
        <ProgressBar duration={100} isStart={isGenerating} />
      </div>
    </div>
  );
};
