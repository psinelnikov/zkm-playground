package main

import (
	"bytes"
	"flag"
	"fmt"
	"log"
	"math/big"
	"os"
	"path/filepath"

	"erc20/token"
	"text/template"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend/groth16"
	groth16_bn254 "github.com/consensys/gnark/backend/groth16/bn254"
)

type ProofPublicData struct {
	Proof struct {
		Ar struct {
			X string
			Y string
		}
		Krs struct {
			X string
			Y string
		}
		Bs struct {
			X struct {
				A0 string
				A1 string
			}
			Y struct {
				A0 string
				A1 string
			}
		}
		Commitments []struct {
			X string
			Y string
		}
	}
	PublicWitness []string
}

type Receipt struct {
	proof token.Proof
	input [65]*big.Int
	proofCommitment [2]*big.Int 
}

var ChainId *int64
var Network *string
var HexPrivateKey *string // ("df4bc5647fdb9600ceb4943d4adff3749956a8512e5707716357b13d5ee687d9") // 0x21f59Cfb0d41FA2c0eeF0Fe1593F46f704C1Db50

// 0xA234F9049720EDaDF3Ae697eE8bF762f2A03949A

func main() {
	ChainId = flag.Int64("chainId", 11155111, "chainId")
	Network = flag.String("network", "https://eth-sepolia.g.alchemy.com/v2/RH793ZL_pQkZb7KttcWcTlOjPrN0BjOW", "network")
	HexPrivateKey = flag.String("privateKey", "df4bc5647fdb9600ceb4943d4adff3749956a8512e5707716357b13d5ee687d9", "privateKey")
	outputDir := flag.String("outputDir", "hardhat/contracts", "outputDir")
	if len(os.Args) < 2 {
		log.Printf("expected subcommands")
		os.Exit(1)
	}
	flag.CommandLine.Parse(os.Args[2:])
	switch os.Args[1] {
	case "generate":
		generateVerifierContract(*outputDir)
	}
}

func generateVerifierContract(outputDir string) {
	tmpl, err := template.ParseFiles("verifier/verifier.sol.tmpl")
	if err != nil {
		log.Fatal(err)
	}

	type VerifyingKeyConfig struct {
		Alpha     string
		Beta      string
		Gamma     string
		Delta     string
		Gamma_abc string
	}

	var config VerifyingKeyConfig
	var vkBN254 = groth16.NewVerifyingKey(ecc.BN254)

	fVk, _ := os.Open("verifier/verifying.key")
	vkBN254.ReadFrom(fVk)
	defer fVk.Close()

	vk := vkBN254.(*groth16_bn254.VerifyingKey)

	config.Alpha = fmt.Sprint("Pairing.G1Point(uint256(", vk.G1.Alpha.X.String(), "), uint256(", vk.G1.Alpha.Y.String(), "))")
	config.Beta = fmt.Sprint("Pairing.G2Point([uint256(", vk.G2.Beta.X.A0.String(), "), uint256(", vk.G2.Beta.X.A1.String(), ")], [uint256(", vk.G2.Beta.Y.A0.String(), "), uint256(", vk.G2.Beta.Y.A1.String(), ")])")
	config.Gamma = fmt.Sprint("Pairing.G2Point([uint256(", vk.G2.Gamma.X.A0.String(), "), uint256(", vk.G2.Gamma.X.A1.String(), ")], [uint256(", vk.G2.Gamma.Y.A0.String(), "), uint256(", vk.G2.Gamma.Y.A1.String(), ")])")
	config.Delta = fmt.Sprint("Pairing.G2Point([uint256(", vk.G2.Delta.X.A0.String(), "), uint256(", vk.G2.Delta.X.A1.String(), ")], [uint256(", vk.G2.Delta.Y.A0.String(), "), uint256(", vk.G2.Delta.Y.A1.String(), ")])")
	config.Gamma_abc = fmt.Sprint("vk.gamma_abc = new Pairing.G1Point[](", len(vk.G1.K), ");\n")
	for k, v := range vk.G1.K {
		config.Gamma_abc += fmt.Sprint("        vk.gamma_abc[", k, "] = Pairing.G1Point(uint256(", v.X.String(), "), uint256(", v.Y.String(), "));\n")
	}
	var buf bytes.Buffer
	err = tmpl.Execute(&buf, config)
	if err != nil {
		log.Fatal(err)
	}
	fSol, _ := os.Create(filepath.Join(outputDir, "verifier.sol"))
	_, err = fSol.Write(buf.Bytes())
	if err != nil {
		log.Fatal(err)
	}
	fSol.Close()
	log.Println("success")
}