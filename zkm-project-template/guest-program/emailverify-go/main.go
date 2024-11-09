package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/zkMIPS/zkm/go-runtime/zkm_runtime"
)

type UserData struct {
	Email string
	EthAddress string
	Number string
}

// ValidationResult holds the validation status and any error message
type ValidationResult struct {
	IsValid bool
	Message string
}

// ValidateEmail checks if the provided string is a valid email address
func ValidateEmail(email string) ValidationResult {
	// Regular expression for basic email validation
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	
	if email == "" {
		return ValidationResult{false, "Email cannot be empty"}
	}
	
	if !emailRegex.MatchString(email) {
		return ValidationResult{false, "Invalid email format"}
	}
	
	return ValidationResult{true, "Valid email address"}
}

// ValidateEthAddress checks if the provided string is a valid Ethereum address
func ValidateEthAddress(address string) ValidationResult {
	// Regular expression for Ethereum address validation
	ethRegex := regexp.MustCompile(`^0x[0-9a-fA-F]{40}$`)
	
	if address == "" {
		return ValidationResult{false, "ETH address cannot be empty"}
	}
	
	if !ethRegex.MatchString(address) {
		return ValidationResult{false, "Invalid ETH address format"}
	}
	
	return ValidationResult{true, "Valid ETH address"}
}

// ValidateNumber checks if the provided string can be parsed as a number
func ValidateNumber(num string) ValidationResult {
	if num == "" {
		return ValidationResult{false, "Number cannot be empty"}
	}
	
	// Remove any whitespace
	num = strings.TrimSpace(num)
	
	// Try to convert string to float64
	_, err := strconv.ParseFloat(num, 64)
	if err != nil {
		return ValidationResult{false, "Invalid number format"}
	}
	
	return ValidationResult{true, "Valid number"}
}

func main() {
	userData := zkm_runtime.Read[UserData]()

	emailResult := ValidateEmail(userData.Email)
	ethAddressResult := ValidateEthAddress(userData.EthAddress)
	numberResult := ValidateNumber(userData.Number)

	if emailResult.IsValid && ethAddressResult.IsValid && numberResult.IsValid {
		fmt.Println("All results are valid!")

		zkm_runtime.Commit[UserData](userData)
	} else if !emailResult.IsValid {
		fmt.Println("Email is invalid because: ", emailResult.Message)
	} else if !ethAddressResult.IsValid {
		fmt.Println("ETH address is invalid because: ", ethAddressResult.Message)
	} else if !numberResult.IsValid {
		fmt.Println("Number is invalid because: ", numberResult.Message)
	}
}