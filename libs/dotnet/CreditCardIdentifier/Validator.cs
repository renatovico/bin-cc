using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace CreditCardIdentifier
{
    /// <summary>
    /// Credit Card BIN Validator
    /// 
    /// This class provides credit card validation using bin-cc data.
    /// </summary>
    public class Validator
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
        /// <param name="dataPath">Path to brands.json. If null, uses bundled data.</param>
        public Validator(string dataPath = null)
        {
            if (string.IsNullOrEmpty(dataPath))
            {
                dataPath = FindDataPath();
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

        /// <summary>
        /// Find the data file path
        /// </summary>
        private static string FindDataPath()
        {
            // Look for bundled data in package
            var assemblyDir = Path.GetDirectoryName(typeof(Validator).Assembly.Location);
            var dataPath = Path.Combine(assemblyDir, "data", "brands.json");

            // Fallback to development path
            if (!File.Exists(dataPath))
            {
                // For development - look relative to source
                var projectDir = Path.GetFullPath(Path.Combine(assemblyDir, "..", "..", ".."));
                dataPath = Path.Combine(projectDir, "..", "..", "data", "brands.json");
            }

            return dataPath;
        }
    }

    /// <summary>
    /// Static utility class for card validation
    /// </summary>
    public static class CreditCard
    {
        private static Validator _validator;

        private static Validator GetValidator()
        {
            if (_validator == null)
            {
                _validator = new Validator();
            }
            return _validator;
        }

        /// <summary>
        /// Identify the credit card brand
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>Brand name or null if not found</returns>
        public static string FindBrand(string cardNumber)
        {
            return GetValidator().FindBrand(cardNumber);
        }

        /// <summary>
        /// Check if card number is supported
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>True if supported, false otherwise</returns>
        public static bool IsSupported(string cardNumber)
        {
            return GetValidator().IsSupported(cardNumber);
        }
    }
}
