import http from "http";
import express from "express";
import { generateProof } from "./generateProof";
import axios from "axios";
var cors = require("cors");
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

app.post("/generateProof", async (req, res) => {
  if (isProcessing) {
    res.send("Service is Busy");
    return;
  }
  const { code, input } = req.body;

  isProcessing = true;
  await generateProof(code, input, res);
  isProcessing = false;
});

const portHttp = 8080;

const server = http.createServer(app);

server.listen(portHttp, () => {
  console.log(`Server is running on http://localhost:${portHttp}`);
});
