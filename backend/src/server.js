const http = require("http");
const express = require("express");
const generateProof = require("./generate");
const cors = require("cors");
const app = express();
let isProcessing = false;
app.use(express.json());
app.use(
  cors({
    origin: "https://playground.zkm.io",
  })
);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from prover-service!");
});

app.post("/generateGolangProof", async (req, res) => {
  if (isProcessing) {
    res.send("Service is Busy");
    return;
  }
  const { code, input } = req.body;

  isProcessing = true;
  await generateGolangProof(code, input, res);
  isProcessing = false;
});

app.post("/generateRustProof", async (req, res) => {
  if (isProcessing) {
    res.send("Service is Busy");
    return;
  }
  const { code, input } = req.body;

  isProcessing = true;
  await generateRustProof(code, input, res);
  isProcessing = false;
});

app.post("/generateVerifierContract", async (req, res) => {
  if (isProcessing) {
    res.send("Service is Busy");
    return;
  }
  const { proof } = req.body;

  isProcessing = true;
  await generateVerifierContract(proof, res);
  isProcessing = false;
});

const portHttp = 8080;

const server = http.createServer(app);

server.listen(portHttp, () => {
  console.log(`Server is running on http://localhost:${portHttp}`);
});
