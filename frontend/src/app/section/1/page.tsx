"use client";
import { Editor } from "@/components/editor";
import { Proof } from "@/components/proof";

export default function Section1() {
  return (
    <div className="flex w-full gap-4 flex-wrap">
      <div className="flex-1 ">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Hello World
        </h1>
        <p>Hello World</p>
      </div>
      <div className="flex-1 ">
        <Editor />
        <Proof />
      </div>
    </div>
  );
}
