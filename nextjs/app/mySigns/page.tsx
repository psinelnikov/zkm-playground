"use client";

import { useState } from "react";
import { SignMessage, VerifyMessage } from "./_components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const MyNFTs: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [formattedProof, setFormattedProof] = useState<ReturnProof>();
  const [message, setMessage] = useState("Hello");
  const [signature, setSignature] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "tokenIdCounter",
    watch: true,
  });

  type UserData = {
    message: string;
    address: string;
    signature: string;
  };

  type ReturnProof = {
    jsonSnarkProof: ProofStructure;
    jsonPublicInputs: UserInputs;
  };

  type UserInputs = {
    roots_before: {
      root: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
    };
    roots_after: {
      root: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
    };
    userdata: string[];
  };

  // Point coordinates type
  interface Point {
    X: string;
    Y: string;
  }

  // Extended point with A0/A1 coordinates
  interface ExtendedPoint {
    X: {
      A0: string;
      A1: string;
    };
    Y: {
      A0: string;
      A1: string;
    };
  }

  // Main proof structure
  interface InputProof {
    Ar: Point;
    Krs: Point;
    Bs: ExtendedPoint;
    Commitments: Point[];
    CommitmentPok: Point;
  }

  // Complete structure including proof and public witness
  interface ProofStructure {
    Proof: InputProof;
    PublicWitness: string[];
  }

  // ########################################################

  // Base point types that match Solidity structures
  interface G1Point {
    X: bigint; // uint256 in Solidity
    Y: bigint; // uint256 in Solidity
  }

  interface G2Point {
    X: [bigint, bigint]; // uint256[2] in Solidity
    Y: [bigint, bigint]; // uint256[2] in Solidity
  }

  // Proof structure matching the Solidity contract
  interface Proof {
    a: G1Point; // Pairing.G1Point in Solidity
    b: G2Point; // Pairing.G2Point in Solidity
    c: G1Point; // Pairing.G1Point in Solidity
  }

  // Input types for the verify function
  interface VerifyInput {
    proof: Proof;
    input: [bigint, bigint]; // uint[2] in Solidity
    proof_commitment: [bigint, bigint]; // uint[2] in Solidity
  }

  const generateReceipt = (): VerifyInput | undefined => {
    if (!formattedProof) return;
    const { jsonSnarkProof } = formattedProof;
    var input: [bigint, bigint] = [0n, 0n];
    input[0] = BigInt(jsonSnarkProof.PublicWitness[0]);
    input[1] = BigInt(jsonSnarkProof.PublicWitness[1]);

    let proof: Proof = { a: { X: 0n, Y: 0n }, b: { X: [0n, 0n], Y: [0n, 0n] }, c: { X: 0n, Y: 0n } };
    proof.a.X = BigInt(jsonSnarkProof.Proof.Ar.X);
    proof.a.Y = BigInt(jsonSnarkProof.Proof.Ar.Y);

    proof.b.X[0] = BigInt(jsonSnarkProof.Proof.Bs.X.A0);
    proof.b.X[1] = BigInt(jsonSnarkProof.Proof.Bs.X.A1);
    proof.b.Y[0] = BigInt(jsonSnarkProof.Proof.Bs.Y.A0);
    proof.b.Y[1] = BigInt(jsonSnarkProof.Proof.Bs.Y.A1);

    proof.c.X = BigInt(jsonSnarkProof.Proof.Krs.X);
    proof.c.Y = BigInt(jsonSnarkProof.Proof.Krs.Y);

    let proof_commitment: [bigint, bigint] = [0n, 0n];
    proof_commitment[0] = BigInt(jsonSnarkProof.Proof.Commitments[0].X);
    proof_commitment[1] = BigInt(jsonSnarkProof.Proof.Commitments[0].Y);

    return { proof, input, proof_commitment };
  };

  const postProof = async (message: string, address: string, signature: string) => {
    console.log(message, address, signature);
    const response = await fetch("http://localhost:8080/generateSigVerificationProof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature, address: connectedAddress?.toLowerCase() }),
    });
    if (!response.ok) {
      throw new Error("Failed to connect to backend server");
    }

    const retData = await response.text();

    // Parse the escaped JSON string and then prettify it
    const parsedData = JSON.parse(retData);

    setFormattedProof(parsedData);
  };

  const handleMintItem = async () => {
    if (!formattedProof) return;
    // circle back to the zero item if we've reached the end of the array
    // if (tokenIdCounter === undefined) return;

    // const tokenIdCounterNumber = Number(tokenIdCounter);

    // Upload {message, address, signature}
    // const currentTokenMetaData = nftsMetadata[tokenIdCounterNumber % nftsMetadata.length];

    // const notificationId = notification.loading("Uploading to IPFS");
    try {
      // const uploadedItem = await addToIPFS(currentTokenMetaData);

      const { proof, input, proof_commitment } = generateReceipt()!;

      console.log(proof);
      console.log(input);
      console.log(proof_commitment);

      const { jsonPublicInputs } = formattedProof!;

      console.log(jsonPublicInputs.roots_before);
      console.log(jsonPublicInputs.roots_after);
      console.log(jsonPublicInputs.userdata);

      // First remove previous loading notification and then show success notification
      //notification.remove(notificationId);
      //notification.success("Metadata uploaded to IPFS");

      // await writeContractAsync({
      //   functionName: "mintItem",
      //   args: [connectedAddress, uploadedItem.path, proof, input, proof_commitment],
      // });
    } catch (error) {
      // notification.remove(notificationId);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">My Signs</span>
          </h1>
        </div>
      </div>
      <div className="flex justify-center w-75">
        {!isConnected || isConnecting ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex justify-center">
              <SignMessage
                message={message}
                setMessage={setMessage}
                setSignature={setSignature}
                postProof={postProof}
              />
            </div>
            <div>
              <VerifyMessage message={message} signature={signature} />
            </div>
            {/* <div className="flex flex-col items-center gap-4"> */}
            {/* <button type="button" className="btn btn-secondary" onClick={pullProof}>
              Get Generated Proof
            </button> */}
            {/* <div className="w-100">
              <ResizableCodeBlock text={JSON.stringify(formattedProof, null, 2)} />
            </div> */}

            {/* </div> */}
            {/* {(formattedProof || signature) && (
              <button className="btn btn-secondary" onClick={handleMintItem}>
                Mint NFT
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTs;
