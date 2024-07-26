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

export const Code = () => {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract({ config });
  const [inputNum, setInputNum] = useState(10);
  const [proof, setProof] = useState<string>("");
  const [burnTransaction, setBurnTransaction] = useState("");
  const [valueOfBurn, setValueOfBurn] = useState("0");
  const [receiveAddr, setReceiveAddr] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShowSubmit, setIsShowSubmit] = useState(false);
  const [code, setCode] = useState("");
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
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
          body: JSON.stringify({ num: valueOfBurn }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to connect backend server");
      }
      const retData = await response.text();
      if (retData !== "false") {
        setIsShowSubmit(true);
      }
      setProof(retData);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };
  const clickSubmit = async (e: any) => {
    e.preventDefault();
    if (!isConnected) {
      window.alert("Connect wallet");
      return;
    }
    try {
      if (proof === "false" || proof == "Service is Busy") {
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
        address: "0x676a5ad5960d08bcd3ec83f8c086b76f33aa921b",
        functionName: "mintWithProof",
        args: [receiveAddr, valueOfBurn, uint256input, proofData, commitments],
      });
      // const verifierContract = new Contract(verifierAbi, "0x2fdDe9155f43eD6784557AF35b7710d8bFE91B15");
      // const token = new Contract(mytokenAbi, "0x676a5ad5960d08bcd3ec83f8c086b76f33aa921b");
      // token.methods.mintWithProof(receiveAddr, mintAmount, uint256input, proofData, commitments);
      // verifierContract.setProvider("https://eth-sepolia.g.alchemy.com/v2/RH793ZL_pQkZb7KttcWcTlOjPrN0BjOW");
      // const result = await verifierContract.methods.verify(uint256input, proofData, commitments).call();
      // console.log(result);
      // if (utils.toBigInt(result) === utils.toBigInt(0)){
      //     window.alert(`Verified successfully`);
      // }else{
      //     window.alert(`Failed to verify`);
      // }
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    window.onmessage = function (e) {
      if (e.data.result?.success) {
        console.log(e.data);

        setCode(e.data.files[0].content);
        // handle the e.data which contains the code object
      } else {
        setCode("");
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center">
        <iframe
          height="450px"
          src="https://onecompiler.com/embed/go/42khdvys4?hideLanguageSelection=true&hideNew=true&theme=dark&codeChangeEvent=true"
          width="100%"
        ></iframe>
      </div>
      <div className="flex flex-row items-center mx-auto">
        {isGenerating && <Loading />}
        {!isGenerating && (
          <button
            type="button"
            className="text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-50 disabled:text-slate-500"
            disabled={code.length === 0}
            onClick={(e) => clickGenerateProof(e)}
          >
            Generate Proof
          </button>
        )}
      </div>

      <div className="flex flex-row items-center w-full">
        <ProgressBar duration={100} isStart={isGenerating} />
      </div>

      <div className="flex flex-row items-center mx-auto w-full">
        <textarea
          className="block p-2.5 w-full h-48 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={proof}
          onChange={() => {}}
        />
      </div>

      <div className="flex flex-col items-center mt-2">
        {isShowSubmit && (
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={(e) => clickSubmit(e)}
          >
            {isPending ? "Confirming..." : "Mint"}
          </button>
        )}
        {hash && (
          <div>
            Transaction Hash:{" "}
            <a target="_blank" href={"https://sepolia.etherscan.io/tx/" + hash}>
              {hash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};