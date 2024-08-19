"use client";
import { Editor } from "@/components/editor";
import { Output } from "@/components/output";
import { useContext, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";
import Sha256Input from "@/components/sha256Input";
import { LanguageContext } from "@/app/context";
import { Language } from "@/app/config";

const rust = `#![no_std]
#![no_main]

use sha2::{Digest, Sha256};
extern crate alloc;
use alloc::vec::Vec;

zkm_runtime::entrypoint!(main);

pub fn main() {
    let public_input: Vec<u8> = zkm_runtime::io::read();
    let input: Vec<u8> = zkm_runtime::io::read();

    let mut hasher = Sha256::new();
    hasher.update(input);
    let result = hasher.finalize();

    let output: [u8; 32] = result.into();
    assert_eq!(output.to_vec(), public_input);

    zkm_runtime::io::commit::<[u8; 32]>(&output);
}`;

const go = `package main

import "github.com/zkMIPS/zkm/go-runtime/zkm_runtime"

type DataId uint32

// use iota to create enum
const (
	TYPE1 DataId = iota
	TYPE2
	TYPE3
)

type Data struct {
	Input1  [10]byte
	Input2  uint8
	Input3  int8
	Input4  uint16
	Input5  int16
	Input6  uint32
	Input7  int32
	Input8  uint64
	Input9  int64
	Input10 []byte
	Input11 DataId
	Input12 string
}

func main() {
	a := zkm_runtime.Read[Data]()
	a.Input1[0] = a.Input1[0] + a.Input1[1]
	a.Input2 = a.Input2 + a.Input2
	a.Input3 = a.Input3 + a.Input3
	a.Input4 = a.Input4 + a.Input4
	a.Input5 = a.Input5 + a.Input5
	a.Input6 = a.Input6 + a.Input6
	a.Input7 = a.Input7 + a.Input7
	a.Input8 = a.Input8 + a.Input8
	a.Input9 = a.Input9 + a.Input9
	if a.Input11 != TYPE3 {
		println("enum type error")
	}
	if a.Input12 != "hello" {
		println("string type error")
	}
	a.Input10[0] = a.Input10[0] + a.Input10[1]
	zkm_runtime.Commit[Data](a)
}`;

export default function Section1() {
  const [formattedProof, setFormattedProof] = useState("");

  const language = useContext(LanguageContext);

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
          Introduction
        </h1>
        <p className="my-2">
          In this section, we will walk through a simple program showcasing the
          lifecycle of a proof generation process using ZKM.
        </p>

        <h2 className="text-2xl">Proof Generation Overview</h2>
        <p className="my-2">
          There are 6 main steps in generating a program that utilizes a zkVM:
        </p>
        <ol className="list-decimal list-inside my-2">
          <li>Writing a program</li>
          <li>Compiling the program using MIPS</li>
          <li>Running the program through a prover with inputs</li>
          <li>Receiving the proof as output</li>
          <li>
            Generating a verifier contract from the ImageID of the program
          </li>
          <li>Posting the proof to the verifier contract</li>
        </ol>

        <p className="my-2">
          The code on the right shows a program accepting a sha256 hash and the
          value that was generated from that hash. This program proves that the
          user knows what the value of the corresponding hash is.
        </p>
        <h2 className="text-2xl">How the Program is Run</h2>
        <p className="my-2">
          The program is run as a &quot;guest&quot; program by the zkm
          &quot;host&quot;. After successful execution of a guest program, the
          host will produce a proof with the included information from the
          guest. There are 3 main structures to write a guest program:
        </p>
        <ol className="list-decimal list-inside my-2">
          <li>Getting Inputs</li>
          <li>Evaluating a Result</li>
          <li>Committing a Result to the Proof</li>
        </ol>
        <p className="my-2">
          When you run the program by clicking on &quot;Generate Proof&quot; -
          the input values get sent to the Prover Service and the proof
          generation process occurs. This process takes roughly a minute to
          complete. This proof will be run through this code as the guest
          program:
        </p>
        <SyntaxHighlighter language={language} style={twilight}>
          {language === Language.RUST ? rust : go}
        </SyntaxHighlighter>
        <p className="my-2">
          You can change the values of the stdin and generate a proof using the
          new values.
        </p>

        <p className="my-2">
          A pre-generated proof is already included, so you do not have to wait
          for the proof generation process to occur.
        </p>
      </div>

      <div className="flex-1">
        <Editor />
        <div className="my-2">
          <Sha256Input />
        </div>
      </div>
    </div>
  );
}
