"use client";
import { useRouter } from "next/navigation";
import { Proof } from "@/components/proof";
import { Editor } from "@/components/editor";

export default function Main() {
  const router = useRouter();

  return (
    <div className="flex w-full gap-4 flex-wrap">
      <div className="flex-1">
        <div className="flex justify-between">
          <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Playground
          </h1>
          <div>
            <button
              className="text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-50 disabled:text-slate-500"
              onClick={() => {
                router.push("/section/1");
              }}
            >
              User Guide
            </button>
          </div>
        </div>
        <Editor />
        <Proof />
      </div>
    </div>
  );
}
