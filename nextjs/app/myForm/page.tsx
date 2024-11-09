"use client";

import { useState } from "react";
import { MyHoldings } from "./_components";
import ResizableCodeBlock from "./_components/ResizableCodeBlock";
import TransactionForm from "./_components/TransactionForm";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const MyForm: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [formattedProof, setFormattedProof] = useState<ReturnProof>();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

  type FormData = {
    email: string;
    ethAddress: string;
    number: string;
  };

  type ReturnProof = {
    snarkProof: ProofStructure;
    publicInputs: UserInputs;
  };

  type UserInputs = {
    roots_before: {
      root: readonly [number, number, number, number, number, number, number, number];
    };
    roots_after: {
      root: readonly [number, number, number, number, number, number, number, number];
    };
    userdata: number[];
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

  type Uint32Array8 = readonly [number, number, number, number, number, number, number, number];

  // ########################################################

  type BytesLike = `0x${string}`;

  // Utility functions for data conversion
  const toBytes = (data: string | Uint8Array | Buffer): BytesLike => {
    if (typeof data === "string") {
      // If it's already a hex string starting with 0x
      if (data.startsWith("0x")) {
        return data as BytesLike;
      }
      // Convert string to hex
      return `0x${Buffer.from(data).toString("hex")}` as BytesLike;
    }

    // If it's Uint8Array or Buffer
    return `0x${Buffer.from(data).toString("hex")}` as BytesLike;
  };

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

  // Function Parameter Types
  interface CalculatePublicInputParams {
    _userData: BytesLike;
    _memRootBefore: Uint32Array8;
    _memRootAfter: Uint32Array8;
  }

  const generateReceipt = (snarkProof: ProofStructure): VerifyInput => {
    var input: [bigint, bigint] = [0n, 0n];
    input[0] = BigInt(snarkProof.PublicWitness[0]);
    input[1] = BigInt(snarkProof.PublicWitness[1]);

    let proof: Proof = { a: { X: 0n, Y: 0n }, b: { X: [0n, 0n], Y: [0n, 0n] }, c: { X: 0n, Y: 0n } };
    proof.a.X = BigInt(snarkProof.Proof.Ar.X);
    proof.a.Y = BigInt(snarkProof.Proof.Ar.Y);

    proof.b.X[0] = BigInt(snarkProof.Proof.Bs.X.A0);
    proof.b.X[1] = BigInt(snarkProof.Proof.Bs.X.A1);
    proof.b.Y[0] = BigInt(snarkProof.Proof.Bs.Y.A0);
    proof.b.Y[1] = BigInt(snarkProof.Proof.Bs.Y.A1);

    proof.c.X = BigInt(snarkProof.Proof.Krs.X);
    proof.c.Y = BigInt(snarkProof.Proof.Krs.Y);

    let proof_commitment: [bigint, bigint] = [0n, 0n];
    proof_commitment[0] = BigInt(snarkProof.Proof.Commitments[0].X);
    proof_commitment[1] = BigInt(snarkProof.Proof.Commitments[0].Y);

    return { proof, input, proof_commitment };
  };

  const generatePublicInputs = (publicInputs: UserInputs): CalculatePublicInputParams => {
    return {
      _userData: toBytes(new Uint8Array(publicInputs.userdata)),
      _memRootBefore: publicInputs.roots_before.root,
      _memRootAfter: publicInputs.roots_after.root,
    };
  };

  const postProof = async (formData: FormData) => {
    const response = await fetch("http://localhost:8080/generateFormDataProof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        ethAddress: formData.ethAddress,
        number: formData.number,
      }),
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
    const { snarkProof, publicInputs } = formattedProof;
    // circle back to the zero item if we've reached the end of the array
    // if (tokenIdCounter === undefined) return;

    // const tokenIdCounterNumber = Number(tokenIdCounter);

    // Upload {message, address, signature}
    // const currentTokenMetaData = nftsMetadata[tokenIdCounterNumber % nftsMetadata.length];

    // const notificationId = notification.loading("Uploading to IPFS");
    try {
      // const uploadedItem = await addToIPFS(currentTokenMetaData);

      const { proof, input, proof_commitment } = generateReceipt(snarkProof);

      console.log(proof);
      console.log(input);
      console.log(proof_commitment);

      const { _userData, _memRootBefore, _memRootAfter } = generatePublicInputs(publicInputs);

      console.log(_userData);
      console.log(_memRootBefore);
      console.log(_memRootAfter);

      // First remove previous loading notification and then show success notification
      //notification.remove(notificationId);
      //notification.success("Metadata uploaded to IPFS");

      await writeContractAsync({
        functionName: "mintItem",
        args: [connectedAddress, proof, input, proof_commitment, _userData, _memRootBefore, _memRootAfter],
      });
    } catch (error) {
      // notification.remove(notificationId);
      console.error(error);
    }
  };

  const pullProof = async () => {
    const response = await fetch("http://localhost:8080/proof", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to connect to backend server");
    }
    const retData = await response.text();

    // Parse the escaped JSON string and then prettify it
    const parsedData = JSON.parse(retData);

    setFormattedProof(parsedData);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">My NFTs</span>
          </h1>
        </div>
      </div>
      <div className="flex justify-center w-75">
        {!isConnected || isConnecting ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex justify-center">
              <TransactionForm postProof={postProof} />
            </div>
            {/* <div className="flex flex-col items-center gap-4"> */}
            <button type="button" className="btn btn-secondary" onClick={pullProof}>
              Get Generated Proof
            </button>
            <div className="w-100">
              <ResizableCodeBlock text={JSON.stringify(formattedProof, null, 2)} />
            </div>

            {/* </div> */}
            {(formattedProof || signature) && (
              <button className="btn btn-secondary" onClick={handleMintItem}>
                Mint NFT
              </button>
            )}
          </div>
        )}
      </div>
      <MyHoldings />
    </div>
  );
};

export default MyForm;
