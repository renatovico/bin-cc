using System;
using System.Collections.Generic;
using CreditCardIdentifier;

// Credit Card Validator - .NET Example
//
// This example shows how to use the CreditCardIdentifier library.
//
// In production, install via:
// dotnet add package CreditCardIdentifier

namespace CreditCardValidation.Example
{
    /// <summary>
    /// Example usage of the credit card validator
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Credit Card Validator - .NET Example ===\n");

            // Create validator instance
            var validator = new Validator();

            // Example 1: List all brands
            var brands = validator.ListBrands();
            Console.WriteLine($"Supported brands: {string.Join(", ", brands)}");
            Console.WriteLine();

            // Example 2: Identify card brands
            var testCards = new Dictionary<string, string>
            {
                { "4012001037141112", "visa" },
                { "5533798818319497", "mastercard" },
                { "378282246310005", "amex" },
                { "6011236044609927", "discover" },
                { "6362970000457013", "elo" },
                { "6062825624254001", "hipercard" },
                { "6220123456789012", "unionpay" },
                { "6759123456789012", "maestro" }
            };

            Console.WriteLine("Card brand identification:");
            foreach (var kvp in testCards)
            {
                var brand = validator.FindBrand(kvp.Key);
                var brandName = brand?.Name;
                var status = brandName == kvp.Value ? "✓" : "✗";
                Console.WriteLine($"{status} {kvp.Key}: {brandName} (expected: {kvp.Value})");
            }
            Console.WriteLine();

            // Example 3: Check if card is supported
            Console.WriteLine("Check if card is supported:");
            Console.WriteLine($"Visa card supported: {validator.IsSupported("4012001037141112")}");
            Console.WriteLine($"Invalid card supported: {validator.IsSupported("1234567890123456")}");
            Console.WriteLine();

            // Example 4: CVV validation
            Console.WriteLine("CVV validation:");
            Console.WriteLine($"Visa CVV 123: {validator.ValidateCvv("123", "visa")}");
            Console.WriteLine($"Amex CVV 1234: {validator.ValidateCvv("1234", "amex")}");
            Console.WriteLine($"Visa CVV 12: {validator.ValidateCvv("12", "visa")} (invalid)");
            Console.WriteLine();

            // Example 5: Get brand details
            Console.WriteLine("Visa brand details:");
            var visaInfo = validator.GetBrandInfo("visa");
            if (visaInfo != null)
            {
                Console.WriteLine($"  Name: {visaInfo.Name}");
                Console.WriteLine($"  BIN pattern: {visaInfo.RegexpBin}");
                Console.WriteLine($"  Full pattern: {visaInfo.RegexpFull}");
                Console.WriteLine($"  CVV pattern: {visaInfo.RegexpCvv}");
            }
            else
            {
                Console.WriteLine("  Not found");
            }
            Console.WriteLine();

            // Example 6: Get detailed brand information
            Console.WriteLine("Visa detailed info:");
            var visaDetailed = validator.GetBrandInfoDetailed("visa");
            if (visaDetailed != null)
            {
                Console.WriteLine($"  Scheme: {visaDetailed.Scheme}");
                Console.WriteLine($"  Brand: {visaDetailed.BrandName}");
                Console.WriteLine($"  Type: {visaDetailed.Type}");
            }
            else
            {
                Console.WriteLine("  Not found");
            }
            Console.WriteLine();

            // Example 7: Find brand with detailed info
            Console.WriteLine("Find brand with detailed info:");
            var brandDetailed = validator.FindBrandDetailed("4012001037141112");
            if (brandDetailed != null)
            {
                Console.WriteLine($"  Scheme: {brandDetailed.Scheme}");
                Console.WriteLine($"  Brand: {brandDetailed.Brand}");
                Console.WriteLine($"  Type: {brandDetailed.Type}");
                if (brandDetailed.MatchedPattern != null)
                {
                    Console.WriteLine($"  Matched pattern: {brandDetailed.MatchedPattern.Bin}");
                }
            }
            else
            {
                Console.WriteLine("  Not found");
            }
        }
    }
}
