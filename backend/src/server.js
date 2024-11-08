const http = require("http");
const express = require("express");
const generateSigVerificationProof = require("./generate");
const cors = require("cors");
const app = express();
const path = require("path");
let isProcessing = false;
// app.use(
//   cors({
//     origin: "https://api.zendit.live",
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from prover-service!");
});

app.get("/proof", (req, res) => {
  const snarkProofPath = path.join(
    __dirname,
    "../../zkm-project-template/contracts/verifier/snark_proof_with_public_inputs.json"
  );
  const publicInputsPath = path.join(
    __dirname,
    "../../zkm-project-template/contracts/verifier/snark_proof_with_public_inputs.json"
  );

  try {
    const snarkProof = require(snarkProofPath);
    const publicInputs = require(publicInputsPath);

    res.json({ snarkProof, publicInputs });
  } catch (error) {
    res.status(500).json({ error: "Failed to load data" });
  }
});

app.post("/proof", async (req, res) => {
  const { message, address, signature } = req.body;

  await generateSigVerificationProof(message, address, signature, res);
});

// app.post("/insert", async (req, res) => {
//   const { message, address, signature } = req.body;

//   await postDataToIPFS(message, address, signature, res);
// });

// app.post("/generateGolangProof", async (req, res) => {
//   if (isProcessing) {
//     res.send("Service is Busy");
//     return;
//   }
//   const { code, input } = req.body;

//   isProcessing = true;
//   await generateGolangProof(code, input, res);
//   isProcessing = false;
// });

// app.post("/generateRustProof", async (req, res) => {
//   if (isProcessing) {
//     res.send("Service is Busy");
//     return;
//   }
//   const { code, input } = req.body;

//   isProcessing = true;
//   await generateRustProof(code, input, res);
//   isProcessing = false;
// });

// app.post("/generateVerifierContract", async (req, res) => {
//   if (isProcessing) {
//     res.send("Service is Busy");
//     return;
//   }
//   const { proof } = req.body;

//   isProcessing = true;
//   await generateVerifierContract(proof, res);
//   isProcessing = false;
// });

const portHttp = 8080;

const server = http.createServer(app);

server.listen(portHttp, () => {
  console.log(`Server is running on http://localhost:${portHttp}`);
});
