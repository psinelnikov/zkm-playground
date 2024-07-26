"use client";
import { Proof } from "@/components/proof";

export default function Section2() {
  return (
    <div className="flex w-full gap-4 flex-wrap">
      <div className="flex-1 ">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Using Inputs and Outputs
        </h1>
        <p>Using Inputs and Outputs</p>
      </div>
      <div className="flex-1">
        <Proof />
      </div>
    </div>
  );
}
