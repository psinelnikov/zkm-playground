"use client";

import { useRef, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { ethers } from "ethers";

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum) throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address,
    };
  } catch (err) {
    setError(err.message);
  }
};

export function SignMessage({ message, setMessage, setSignature, postProof }) {
  const resultBox = useRef();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();

  const handleSign = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    const sig = await signMessage({
      setError,
      message: data.get("message"),
    });
    if (sig) {
      setSignatures([...signatures, sig]);
      setMessage(sig.message);
      setSignature(sig.signature);
      postProof(sig.message, sig.address, sig.signature);
    }
  };

  return (
    <form className="m-4" onSubmit={handleSign}>
      <div className="w-full shadow-lg rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">Sign Message</h1>
          <div className="">
            <div className="my-3">
              <textarea
                required
                type="text"
                name="message"
                className="textarea w-full textarea-bordered focus:ring focus:outline-none"
                defaultValue={message}
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
            Sign message
          </button>
          <ErrorMessage message={error} />
        </footer>
        {signatures.map((sig, idx) => {
          return (
            <div className="p-2" key={idx}>
              <div className="my-3 text-black">
                <p>Message</p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full textarea-bordered focus:ring focus:outline-none text-white"
                  placeholder="Generated signature"
                  value={sig.message}
                />
                <p>Signer</p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full textarea-bordered focus:ring focus:outline-none text-white"
                  placeholder="Generated signature"
                  value={sig.address}
                />
                <p>Signature</p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full textarea-bordered focus:ring focus:outline-none text-white"
                  placeholder="Generated signature"
                  value={sig.signature}
                />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
