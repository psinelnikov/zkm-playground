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
          Using Inputs and Outputs
        </h1>
        <p className="my-2">
          The program has 2 primary logic points: guest and host program.
        </p>
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
