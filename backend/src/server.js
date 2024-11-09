const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const fsPromises = require("fs/promises");

async function runBashWithExecPromise(scriptPath, ...args) {
  const formattedArgs = args.join(" ");
  try {
    const { stdout, stderr } = await execPromise(
      `${scriptPath} ${formattedArgs}`
    );
    console.log("Script Output:", stdout);
    if (stderr) {
      console.error("Script Errors:", stderr);
    }
  } catch (error) {
    console.error("Execution error:", error);
  }
}

const snarkProofPath = path.join(
  __dirname,
  "../../zkm-project-template/contracts/verifier/snark_proof_with_public_inputs.json"
);
const publicInputsPath = path.join(
  __dirname,
  "../../zkm-project-template/contracts/verifier/public_inputs.json"
);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from prover-service!");
});

app.get("/proof", async (req, res) => {
  try {
    const unformattedSnarkProof = await fsPromises.readFile(
      snarkProofPath,
      "utf8"
    );
    const snarkProof = JSON.parse(unformattedSnarkProof);

    const unformattedPublicInputs = await fsPromises.readFile(
      publicInputsPath,
      "utf8"
    );
    const publicInputs = JSON.parse(unformattedPublicInputs);

    res.json({ snarkProof, publicInputs });
  } catch (error) {
    res.status(500).json({ error: "Failed to load data" });
  }
});

app.post("/generateSigVerificationProof", async (req, res) => {
  const { message, signature, address } = req.body;
  console.log(message, signature, address);

  const scriptPath = path.join(
    __dirname,
    "../../zkm-project-template/host-program/run-local-proving-sigverify.sh"
  );

  try {
    await runBashWithExecPromise(scriptPath, message, signature, address);

    const unformattedSnarkProof = await fsPromises.readFile(
      snarkProofPath,
      "utf8"
    );
    const snarkProof = JSON.parse(unformattedSnarkProof);

    const unformattedPublicInputs = await fsPromises.readFile(
      publicInputsPath,
      "utf8"
    );
    const publicInputs = JSON.parse(unformattedPublicInputs);

    res.json({ snarkProof, publicInputs });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date(),
    });
  }
});

app.post("/generateFormDataProof", async (req, res) => {
  const { email, ethAddress, number } = req.body;
  console.log(email, ethAddress, number);

  const scriptPath = path.join(
    __dirname,
    "../../zkm-project-template/host-program/run-local-proving-emailverify.sh"
  );

  try {
    await runBashWithExecPromise(scriptPath, email, ethAddress, number);

    const unformattedSnarkProof = await fsPromises.readFile(
      snarkProofPath,
      "utf8"
    );
    const snarkProof = JSON.parse(unformattedSnarkProof);

    const unformattedPublicInputs = await fsPromises.readFile(
      publicInputsPath,
      "utf8"
    );
    const publicInputs = JSON.parse(unformattedPublicInputs);

    res.json({ snarkProof, publicInputs });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date(),
    });
  }
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
