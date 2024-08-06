"use client";
import { Editor } from "@/components/editor";
import { Output } from "@/components/output";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";

const InputHandling = `// Parse command-line flags and retrieve input
flag.Parse()
input := GetInput(flag.Args(), os.Stdin)
`;

const IteratingOverInput = `// Iterate over each input value
for input.Scan() {
    arg := input.Text()
    fmt.Printf(arg)
    // ...do something with arg (e.g., process zkMIPS instructions)
}
`;

const ErrorHandling = `// Error handling after input scanning
if err := input.Err(); err != nil {
    log.Fatalln(err)
}
`;

export default function Section1() {
  const [formattedProof, setFormattedProof] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("proof")) {
      localStorage.setItem(
        "proof",
        '{"Proof":{"Ar":{"X":"4987601633014446518120636463017269576777050926318836149708036398838901180654","Y":"12930959421580006259336199801636659533474166588856593640001070592344799590996"},"Krs":{"X":"13525263656250396892843645579119173066232979371816809440212327601615230976022","Y":"8437519508041309961033905777466553562107967222117931507464803703827165153251"},"Bs":{"X":{"A0":"4041390670772472775568908684820796480705377716563265240843950001964376080387","A1":"12098529875569689618378448977985522913868638170609093314375492057735907279586"},"Y":{"A0":"12039511472980744971176918481244658706288049754872959398800451227922473309478","A1":"1392243825610997325102927222525506301576568619168262886423326942758893111668"}},"Commitments":[{"X":"12312788526599325282312317415283406154555022377428188761906365379000314383694","Y":"20096298078773224717935181674882886293626529457130458911988880649385865046323"}],"CommitmentPok":{"X":"15982422450191014963397189402394402938704112509120714189281705670216956672550","Y":"10720103497909249847800073053348678525795412162781691189798884617673220968807"}},"PublicWitness":["3","176","196","66","152","252","28","20","154","251","244","200","153","111","185","36","39","174","65","228","100","155","147","76","164","149","153","27","120","82","184","85","3","176","196","66","152","252","28","20","154","251","244","200","153","111","185","36","39","174","65","228","100","155","147","76","164","149","153","27","120","82","184","85","14179422375622783384929025707978250194089578534603856672235850501830416376808"]}'
      );
    }
  }, []);

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
          Hello World
        </h1>
        <p>
          In this section, we will walk through a simple Hello World program
          using ZKM.
        </p>

        <div className="flex flex-col py-2">
          <h1 className="text-2xl ">Development Prerequisites</h1>
          <p>
            Before proceeding with the Hello World program, ensure that you have
            the following:
          </p>
          <ul>
            <li> - Basic knowledge of Go syntax and concepts.</li>
            <li> - Have our documents at the ready.</li>
          </ul>
        </div>

        <div className="flex flex-col py-2">
          <h1 className="text-2xl">zkMIPS Prerequisites</h1>
          <p>
            This program outlines the process of creating proofs through ZKM,
            specifically focusing on the zkMIPS architecture and its relevance
            to the code implementation.
          </p>

          <p className="py-2">Instruction Set:</p>
          <ul>
            <li> - The first 6 bits of an instruction represent the opcode.</li>
            <li>
              {" "}
              - If the opcode is 000000, the last 6 bits are designated as the
              funct field.
            </li>
            <li>
              {" "}
              - The opcode and funct values define the syntax and semantics of
              each instruction.{" "}
            </li>
          </ul>

          <p className="py-2">Instruction Formats:</p>
          <ul>
            <li>
              {" "}
              - R format: opcode, 2 input registers, 1 output register, optional
              extra input.{" "}
            </li>
            <li>
              {" "}
              - I format: opcode, 2 registers (1 input, 1 output or 2 inputs),
              16-bit immediate.{" "}
            </li>
            <li> - J format: opcode, 26-bit address input. </li>
            <li> - Special format: opcode, 20-bit input, 6-bit funct field </li>
          </ul>
        </div>

        <div className="flex flex-col py-2">
          <h1 className="text-2xl">Code Implementation</h1>
          <p>
            The Hello World snippet demonstrates how input is processed through
            ZKM, which is important when generating proofs based on zkMIPS
            instruction sets.
          </p>
        </div>

        <div className="flex flex-col py-2">
          <h1 className="text-2xl">Input Handling</h1>
          <SyntaxHighlighter language="go" style={twilight}>
            {InputHandling}
          </SyntaxHighlighter>
          <p>
            The main function begins by parsing command-line flags and
            retrieving input via the GetInput function. This input can consist
            of zkMIPS instructions that will be processed to generate proofs.
          </p>
        </div>

        <div className="flex flex-col py-2">
          <h1 className="text-2xl">Iterating Over Input</h1>
          <SyntaxHighlighter language="go" style={twilight}>
            {IteratingOverInput}
          </SyntaxHighlighter>
          <p>
            Each line of input is scanned and processed. This is where the
            instructions would be interpreted according to the zkMIPS
            architecture, allowing for the generation of corresponding proofs.
          </p>
        </div>

        <div className="flex flex-col py-2">
          <h1 className="text-2xl">Error Handling</h1>
          <SyntaxHighlighter language="go" style={twilight}>
            {ErrorHandling}
          </SyntaxHighlighter>
          <p>
            After the input has been processed, this code checks for any errors
            that may have occurred during scanning. If an error is found, it is
            logged using log.Fatalln, which outputs the error message and
            terminates the program.
          </p>
        </div>

        <div>
          <p>
            So, there you have it! These snippets show how we handle input,
            process it, and keep an eye out for errors in an efficient way. This
            structure is key for interpreting zkMIPS instructions and generating
            proofs in the ZKM. You are well on your way to mastering this!
          </p>
        </div>
      </div>

      <div className="flex-1">
        <Editor />
        <Output text={formattedProof} language="json" />
      </div>
    </div>
  );
}
