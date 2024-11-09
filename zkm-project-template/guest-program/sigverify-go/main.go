package main

import (
	"encoding/hex"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"

	"github.com/zkMIPS/zkm/go-runtime/zkm_runtime"
)

type DataId uint32

// use iota to create enum
const (
	TYPE1 DataId = iota
	TYPE2
	TYPE3
)

type SignedMessage struct {
	Message   string
	Signature string
	Address   string
}

// VerifySignature verifies if the signature is valid for the given message and address
func VerifySignature(message []byte, signature string, address string) (bool, error) {
	// Remove "0x" prefix if present
	if len(signature) > 2 && signature[:2] == "0x" {
		signature = signature[2:]
	}

	// Decode the signature from hex
	sigBytes, err := hex.DecodeString(signature)
	if err != nil {
		return false, fmt.Errorf("failed to decode signature: %v", err)
	}

	// Check signature length
	if len(sigBytes) != 65 {
		return false, fmt.Errorf("invalid signature length: %d", len(sigBytes))
	}

	// Add Ethereum message prefix
	prefixedMessage := fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(message), message)
	hashedMessage := crypto.Keccak256Hash([]byte(prefixedMessage))

	// Convert signature to R, S, V format
	r := sigBytes[:32]
	s := sigBytes[32:64]
	v := sigBytes[64]

	// Convert v to 0/1
	if v >= 27 {
		v -= 27
	}

	// Recover public key
	pubKey, err := crypto.Ecrecover(hashedMessage.Bytes(), append(append(r, s...), v))
	if err != nil {
		return false, fmt.Errorf("failed to recover public key: %v", err)
	}

	// Convert public key to address
	recoveredPubKey, err := crypto.UnmarshalPubkey(pubKey)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal public key: %v", err)
	}

	recoveredAddress := crypto.PubkeyToAddress(*recoveredPubKey)
	inputAddress := common.HexToAddress(address)

	// Compare addresses
	return recoveredAddress == inputAddress, nil
}

func main() {
	signedMessage := zkm_runtime.Read[SignedMessage]()
	
	// Verify signature
	isValid, err := VerifySignature([]byte(signedMessage.Message), signedMessage.Signature, signedMessage.Address)
	if err != nil {
		fmt.Printf("Error verifying signature: %v\n", err)
		return
	}

	// message := []byte("qwerty")
	// // Example signature (replace with actual signature)
	// signature := "0x1962b12a1c84739d32e34ef4c94c42cbae6f8ce94bf82f2c5b11f4d961ecab48211211aa6bfbc669b1e79ccd19c630f5538796e2b94552417e4ba49fc23bdaaa1c"
	// // Example address (replace with actual address)
	// address := "0x7DA62A19305496d2A8C27D92770930c0d8125896"

	// isValid, err := VerifySignature(message, signature, address)
	// if err != nil {
	// 	fmt.Printf("Error verifying signature: %v\n", err)
	// 	return
	// }

	if isValid {
		fmt.Printf("Signature is valid!")
		zkm_runtime.Commit[SignedMessage](signedMessage)
	} else {
		fmt.Println("Signature is invalid!")
	}
}