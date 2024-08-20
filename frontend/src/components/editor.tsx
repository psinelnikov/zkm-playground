"use client";
import { useContext, useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import ProgressBar from "@/components/progressbar";
import { Go } from "./languages/go";
import { LanguageContext } from "@/app/context";
import { Rust } from "./languages/rust";
import { Language } from "@/app/config";

export const Editor = () => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState("");

  const language = useContext(LanguageContext);

  const clickGenerateProof = async (e: any) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      if (language === Language.RUST) {
        const response = await fetch(
          "https://playgroundapi.zkm.io/generateRustProof",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, input }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to connect to backend server");
        }
        const retData = await response.text();
        localStorage.setItem("proof", retData);
      } else if (language === Language.GO) {
        const response = await fetch(
          "https://playgroundapi.zkm.io/generateGolangProof",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, input }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to connect to backend server");
        }
        const retData = await response.text();
        localStorage.setItem("proof", retData);
      }

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
      <div className="flex items-center">
        {language === Language.GO ? <Go /> : <Rust />}
      </div>

      <div className="flex items-center my-4">
        <button
          type="button"
          className="w-52 text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-l-lg text-sm py-2.5 dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-300 disabled:text-slate-800"
          disabled={code.length == 0 || isGenerating}
          onClick={(e) => clickGenerateProof(e)}
        >
          Generate Proof
        </button>

        <div className="flex items-center w-full gap-4">
          <ProgressBar duration={100} isStart={isGenerating} />
          {isGenerating && <Loading />}
        </div>
      </div>
    </div>
  );
};
