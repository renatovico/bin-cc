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

            // Using static methods
            Console.WriteLine("Using static methods:");
            Console.WriteLine($"Brand of 4012001037141112: {CreditCard.FindBrand("4012001037141112")}");
            Console.WriteLine($"Is supported: {CreditCard.IsSupported("4012001037141112")}\n");

            // Using the Validator class
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
                { "6062825624254001", "hipercard" }
            };

            Console.WriteLine("Card brand identification:");
            foreach (var kvp in testCards)
            {
                var brand = validator.FindBrand(kvp.Key);
                var status = brand == kvp.Value ? "✓" : "✗";
                Console.WriteLine($"{status} {kvp.Key}: {brand} (expected: {kvp.Value})");
            }
            Console.WriteLine();

            // Example 3: CVV validation
            Console.WriteLine("CVV validation:");
            Console.WriteLine($"Visa CVV 123: {validator.ValidateCvv("123", "visa")}");
            Console.WriteLine($"Amex CVV 1234: {validator.ValidateCvv("1234", "amex")}");
            Console.WriteLine($"Visa CVV 12: {validator.ValidateCvv("12", "visa")} (invalid)");
            Console.WriteLine();

            // Example 4: Get brand details
            Console.WriteLine("Visa brand details:");
            var visaInfo = validator.GetBrandInfo("visa");
            if (visaInfo != null)
            {
                Console.WriteLine($"  BIN pattern: {visaInfo.regexpBin}");
                Console.WriteLine($"  Full pattern: {visaInfo.regexpFull}");
                Console.WriteLine($"  CVV pattern: {visaInfo.regexpCvv}");
            }
            else
            {
                Console.WriteLine("  Not found");
            }
        }
    }
}
