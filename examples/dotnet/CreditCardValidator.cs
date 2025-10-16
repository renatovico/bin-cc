using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace CreditCardValidation
{
    /// <summary>
    /// Credit Card BIN Validator - .NET Example
    /// 
    /// This class shows how to use the bin-cc data file project in .NET/C#.
    /// It loads the brands.json file and performs credit card validation.
    /// </summary>
    public class CreditCardValidator
    {
        private readonly List<Brand> _brands;

        /// <summary>
        /// Brand information from data file
        /// </summary>
        public class Brand
        {
            public string name { get; set; }
            public string regexpBin { get; set; }
            public string regexpFull { get; set; }
            public string regexpCvv { get; set; }
        }

        /// <summary>
        /// Initialize validator with brand data
        /// </summary>
        /// <param name="dataPath">Path to brands.json. If null, uses default location.</param>
        public CreditCardValidator(string dataPath = null)
        {
            if (string.IsNullOrEmpty(dataPath))
            {
                // Default path relative to executable
                var baseDir = AppDomain.CurrentDomain.BaseDirectory;
                dataPath = Path.Combine(baseDir, "../../data/brands.json");
            }

            var jsonString = File.ReadAllText(dataPath);
            _brands = JsonSerializer.Deserialize<List<Brand>>(jsonString);
        }

        /// <summary>
        /// Identify the credit card brand
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>Brand name or null if not found</returns>
        public string FindBrand(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber))
                return null;

            var brand = _brands.FirstOrDefault(b =>
            {
                var regex = new Regex(b.regexpFull);
                return regex.IsMatch(cardNumber);
            });

            return brand?.name;
        }

        /// <summary>
        /// Check if card number is supported
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>True if supported, false otherwise</returns>
        public bool IsSupported(string cardNumber)
        {
            return FindBrand(cardNumber) != null;
        }

        /// <summary>
        /// Validate CVV for a specific brand
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="brandName">Brand name (e.g., "visa", "mastercard")</param>
        /// <returns>True if valid, false otherwise</returns>
        public bool ValidateCvv(string cvv, string brandName)
        {
            var brand = GetBrandInfo(brandName);
            if (brand == null)
                return false;

            var regex = new Regex(brand.regexpCvv);
            return regex.IsMatch(cvv);
        }

        /// <summary>
        /// Get information about a specific brand
        /// </summary>
        /// <param name="brandName">Brand name (e.g., "visa", "mastercard")</param>
        /// <returns>Brand information or null if not found</returns>
        public Brand GetBrandInfo(string brandName)
        {
            return _brands.FirstOrDefault(b => b.name == brandName);
        }

        /// <summary>
        /// List all supported brands
        /// </summary>
        /// <returns>List of brand names</returns>
        public List<string> ListBrands()
        {
            return _brands.Select(b => b.name).ToList();
        }
    }

    /// <summary>
    /// Example usage of the credit card validator
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Credit Card Validator - .NET Example ===\n");

            var validator = new CreditCardValidator();

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
                { "6011236044609927", "discover" }
            };

            Console.WriteLine("Card brand identification:");
            foreach (var kvp in testCards)
            {
                var brand = validator.FindBrand(kvp.Key);
                var status = brand != null ? "✓" : "✗";
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
