"use client";
import { SendTx } from "@/components/sendTx";
import { Output } from "@/components/output";
import WalletConnectButton from "@/components/walletConnection";
import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";

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
          Verifying the Proof
        </h1>
        <p className="my-2">
          For the final step, you post the proof to the previously deployed
          verifier contract
        </p>
        <p className="my-2">
          This step will compare the hash of the inputs to the hash of the
          outputs
        </p>
        <p className="my-2">e.g. sha256("hello") = {sha256("hello")}</p>
        <p className="my-2">Calling the function</p>
        <SyntaxHighlighter
          language="solidity"
          style={twilight}
        >{`function mintWithProof(address to, uint256 value, Verifier.Proof memory proof, uint[65] memory input
        ,uint[2] memory proof_commitment) public {
        require(_verifier.verifyTx(proof, input, proof_commitment), "Proof is invalid");
        _totalSupply += value;
        balances[to] += value;
    }`}</SyntaxHighlighter>
        <p className="my-2">
          Will compare the result of the function to the hash of the outputs, if
          the proof passes and the hash of the value that the user provided is
          the same as the hash of the output of the proof, then that transaction
          is considered valid.
        </p>
        <p className="my-2">
          You can try minting tokens using this pre-generated proof.
        </p>
      </div>
      <div className="flex-1 ">
        <WalletConnectButton />
        <Output text={formattedProof} language="json" />
        <SendTx text="Mint Tokens" />
      </div>
    </div>
  );
}
