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
        <p className="my-2">
          In this section, we will walk through a simple Hello World program
          using ZKM.
        </p>

        <p className="my-2">
          There are 6 main steps in generating a program that utilizes a zkVM:
        </p>
        <ol className="list-decimal list-inside">
          <li>Writing a program</li>
          <li>Compiling the program using MIPS</li>
          <li>Running the program through a prover with inputs</li>
          <li>Receiving the proof as output</li>
          <li>
            Generating a verifier contract from the ImageID of the program
          </li>
          <li>Posting the proof to the verifier contract</li>
        </ol>
        {/* <p className="my-2">
          The purpose of this code is to make handling inputs from stdin as well
          as through arguments. This is to be able to have the values that are
          put into the program used within the proof generation process. On your
          custom developments, you won't need to include this conversion
        </p> */}
      </div>

      <div className="flex-1">
        <Editor />
        <Output text={formattedProof} language="json" />
      </div>
    </div>
  );
}
