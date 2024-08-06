"use client";
import { useRouter } from "next/navigation";
import { Output } from "@/components/output";
import { Editor } from "@/components/editor";
import { useEffect, useState } from "react";

export default function Main() {
  const router = useRouter();
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
        <Output text={formattedProof} language="json" />
      </div>
    </div>
  );
}
