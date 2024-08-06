"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Output = ({
  text,
  language,
}: {
  text: string;
  language: string;
}) => {
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

  return (
    <div className="h-96 overflow-scroll w-full">
      <SyntaxHighlighter language={language} style={twilight} wrapLongLines>
        {text}
      </SyntaxHighlighter>
    </div>
  );
};
