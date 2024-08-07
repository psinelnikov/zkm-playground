"use client";
import { Output } from "@/components/output";
import { useEffect, useState } from "react";

export default function Section2() {
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
      <div className="flex-1">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Anatomy of a Proof
        </h1>
        <h2 className="text-2xl">Proof Generation Process</h2>
        <p className="my-2">
          The proof generation process has multiple steps. The process involves:
        </p>
        <ol className="list-decimal list-inside my-2">
          <li>The program and trace are divided into segments</li>
          <li>The segments are divided into modules</li>
          <li>
            STARK – The modules are proven independently and in parallel with
            FRI.
          </li>
          <li>
            LogUp (STARK) – The modular proofs from the previous step are
            combined into one single proof for each segment using the LogUp
            lookup protocol
          </li>
          <li>
            PLONK – All segment proofs from the previous layer are recursively
            combined using the continuation protocol into one single
            continuation proof
          </li>
          <li>
            Groth16 – The Groth16 proving system is used to enable on-chain
            computation by converting the proof to an EVM-friendly format. The
            continuation proof is converted into an on-chain Groth16
            (SNARK-based) proof.{" "}
          </li>
        </ol>
        <h2 className="text-2xl">STARK Proof parameters</h2>
        <p className="my-2">The Stark’s public input consists of 116 bytes:</p>
        <ul className="list-disc list-inside">
          <li>memory image before and after: 8 + 8 u32</li>
          <li>user data: 32 bytes</li>
          <li>Stark CommonCircuitData: 68 u64/Goldilocks elements</li>
        </ul>
        <p className="my-2">The final Snark’s public input is 64bytes:</p>
        <ul className="list-disc list-inside">
          <li>sha256(memory image before and after || user data) - input</li>{" "}
          <li>sha256(CommonCircuitData) - output</li>
        </ul>
      </div>
      <div className="flex-1">
        <Output text={formattedProof} language="json" />
      </div>
    </div>
  );
}
