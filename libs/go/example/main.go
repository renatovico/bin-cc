package main

import (
"fmt"

creditcard "github.com/renatovico/bin-cc/libs/go"
)

func main() {
fmt.Println("=== Credit Card Validator - Go Example ===\n")

// Example 1: List all brands
brands := creditcard.ListBrands()
fmt.Printf("Supported brands: %v\n\n", brands)

// Example 2: Identify card brands
testCards := map[string]string{
"4012001037141112": "visa",
"5533798818319497": "mastercard",
"378282246310005":  "amex",
"6011236044609927": "discover",
"6362970000457013": "elo",
"6062825624254001": "hipercard",
"6220123456789012": "unionpay",
"6759123456789012": "maestro",
}

fmt.Println("Card brand identification:")
for card, expected := range testCards {
brandPtr := creditcard.FindBrand(card)
brand := "unknown"
if brandPtr != nil {
brand = *brandPtr
}
status := "✗"
if brand == expected {
status = "✓"
}
fmt.Printf("%s %s: %s (expected: %s)\n", status, card, brand, expected)
}
fmt.Println()

// Example 3: Check if card is supported
fmt.Println("Check if card is supported:")
fmt.Printf("Visa card supported: %v\n", creditcard.IsSupported("4012001037141112"))
fmt.Printf("Invalid card supported: %v\n", creditcard.IsSupported("1234567890123456"))
fmt.Println()

// Example 4: CVV validation
fmt.Println("CVV validation:")
fmt.Printf("Visa CVV 123: %v\n", creditcard.ValidateCVV("123", "visa"))
fmt.Printf("Amex CVV 1234: %v\n", creditcard.ValidateCVV("1234", "amex"))
fmt.Printf("Visa CVV 12: %v (invalid)\n", creditcard.ValidateCVV("12", "visa"))
fmt.Println()

// Example 5: Get brand details
fmt.Println("Visa brand details:")
visaInfo := creditcard.GetBrandInfo("visa")
if visaInfo != nil {
fmt.Printf("  Name: %s\n", visaInfo.Name)
fmt.Printf("  BIN pattern: %s\n", visaInfo.RegexpBin)
fmt.Printf("  Full pattern: %s\n", visaInfo.RegexpFull)
fmt.Printf("  CVV pattern: %s\n", visaInfo.RegexpCvv)
}
fmt.Println()

// Example 6: Get detailed brand information
fmt.Println("Visa detailed info:")
visaDetailed := creditcard.GetBrandInfoDetailed("visa")
if visaDetailed != nil {
fmt.Printf("  Scheme: %s\n", visaDetailed.Scheme)
fmt.Printf("  Brand: %s\n", visaDetailed.Brand)
fmt.Printf("  Type: %s\n", visaDetailed.Type)
}
fmt.Println()

// Example 7: Luhn validation
fmt.Println("Luhn validation:")
fmt.Printf("Valid card: %v\n", creditcard.Luhn("4012001037141112"))
fmt.Printf("Invalid card: %v\n", creditcard.Luhn("4012001037141113"))
}
