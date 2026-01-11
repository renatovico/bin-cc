using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace CreditCardIdentifier
{
    /// <summary>
    /// Result of finding a brand with detailed information
    /// </summary>
    public class DetailedBrandResult
    {
        public string Scheme { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public BrandDataDetailed.NumberInfo Number { get; set; }
        public BrandDataDetailed.CvvInfo Cvv { get; set; }
        public BrandDataDetailed.Pattern[] Patterns { get; set; }
        public string[] Countries { get; set; }
        public Dictionary<string, object> Metadata { get; set; }
        public BrandDataDetailed.Pattern MatchedPattern { get; set; }
        public BrandDataDetailed.BinInfo MatchedBin { get; set; }
    }

    /// <summary>
    /// Credit Card BIN Validator
    /// 
    /// This class provides credit card validation using bin-cc data.
    /// </summary>
    public class Validator
    {
        private readonly BrandData.Brand[] _brands;
        private readonly BrandDataDetailed.Brand[] _brandsDetailed;

        /// <summary>
        /// Initialize validator with pre-compiled brand data
        /// </summary>
        public Validator()
        {
            _brands = BrandData.Brands;
            _brandsDetailed = BrandDataDetailed.Brands;
        }

        /// <summary>
        /// Identify the credit card brand (returns brand object)
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>Brand object or null if not found</returns>
        public BrandData.Brand FindBrand(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber))
                return null;

            return _brands.FirstOrDefault(b => b.RegexpFull.IsMatch(cardNumber));
        }

        /// <summary>
        /// Identify the credit card brand with detailed information
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>Detailed brand result or null if not found</returns>
        public DetailedBrandResult FindBrandDetailed(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber))
                return null;

            var brand = _brands.FirstOrDefault(b => b.RegexpFull.IsMatch(cardNumber));
            if (brand == null)
                return null;

            var detailedBrand = _brandsDetailed.FirstOrDefault(b => b.Scheme == brand.Name);
            if (detailedBrand == null)
                return null;

            // Find the specific pattern that matched
            BrandDataDetailed.Pattern matchedPattern = null;
            if (detailedBrand.Patterns != null)
            {
                matchedPattern = detailedBrand.Patterns.FirstOrDefault(p =>
                    new Regex(p.Bin).IsMatch(cardNumber));
            }

            // Find the specific bin that matched (if bins exist)
            BrandDataDetailed.BinInfo matchedBin = null;
            if (detailedBrand.Bins != null && cardNumber.Length >= 6)
            {
                var binPrefix = cardNumber.Substring(0, 6);
                matchedBin = detailedBrand.Bins.FirstOrDefault(b =>
                    binPrefix.StartsWith(b.Bin) || b.Bin == binPrefix);
            }

            return new DetailedBrandResult
            {
                Scheme = detailedBrand.Scheme,
                Brand = detailedBrand.BrandName,
                Type = detailedBrand.Type,
                Number = detailedBrand.Number,
                Cvv = detailedBrand.Cvv,
                Patterns = detailedBrand.Patterns,
                Countries = detailedBrand.Countries,
                Metadata = detailedBrand.Metadata,
                MatchedPattern = matchedPattern,
                MatchedBin = matchedBin
            };
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
        /// Validate CVV for a specific brand by name
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="brandName">Brand name (e.g., "visa", "mastercard")</param>
        /// <returns>True if valid, false otherwise</returns>
        public bool ValidateCvv(string cvv, string brandName)
        {
            if (string.IsNullOrEmpty(cvv))
                return false;

            var brand = GetBrandInfo(brandName);
            if (brand == null)
                return false;

            return brand.RegexpCvv.IsMatch(cvv);
        }

        /// <summary>
        /// Validate CVV using a brand object
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="brand">Brand object from FindBrand</param>
        /// <returns>True if valid, false otherwise</returns>
        public bool ValidateCvv(string cvv, BrandData.Brand brand)
        {
            if (string.IsNullOrEmpty(cvv) || brand == null)
                return false;

            return brand.RegexpCvv.IsMatch(cvv);
        }

        /// <summary>
        /// Validate CVV using a detailed brand result
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="detailedBrand">Detailed brand result from FindBrandDetailed</param>
        /// <returns>True if valid, false otherwise</returns>
        public bool ValidateCvv(string cvv, DetailedBrandResult detailedBrand)
        {
            if (string.IsNullOrEmpty(cvv) || detailedBrand?.Cvv == null)
                return false;

            var expectedLength = detailedBrand.Cvv.Length;
            return new Regex($@"^\d{{{expectedLength}}}$").IsMatch(cvv);
        }

        /// <summary>
        /// Get information about a specific brand
        /// </summary>
        /// <param name="brandName">Brand name (e.g., "visa", "mastercard")</param>
        /// <returns>Brand information or null if not found</returns>
        public BrandData.Brand GetBrandInfo(string brandName)
        {
            return _brands.FirstOrDefault(b => b.Name == brandName);
        }

        /// <summary>
        /// Get detailed information about a specific brand
        /// </summary>
        /// <param name="scheme">Scheme name (e.g., "visa", "mastercard")</param>
        /// <returns>Detailed brand information or null if not found</returns>
        public BrandDataDetailed.Brand GetBrandInfoDetailed(string scheme)
        {
            return _brandsDetailed.FirstOrDefault(b => b.Scheme == scheme);
        }

        /// <summary>
        /// List all supported brands
        /// </summary>
        /// <returns>List of brand names</returns>
        public List<string> ListBrands()
        {
            return _brands.Select(b => b.Name).ToList();
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
        /// Get all brand data
        /// </summary>
        public static BrandData.Brand[] Brands => BrandData.Brands;

        /// <summary>
        /// Get all detailed brand data
        /// </summary>
        public static BrandDataDetailed.Brand[] BrandsDetailed => BrandDataDetailed.Brands;

        /// <summary>
        /// Identify the credit card brand
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>Brand object or null if not found</returns>
        public static BrandData.Brand FindBrand(string cardNumber)
        {
            return GetValidator().FindBrand(cardNumber);
        }

        /// <summary>
        /// Identify the credit card brand with detailed information
        /// </summary>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns>Detailed brand result or null if not found</returns>
        public static DetailedBrandResult FindBrandDetailed(string cardNumber)
        {
            return GetValidator().FindBrandDetailed(cardNumber);
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

        /// <summary>
        /// Validate CVV for a specific brand
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="brandName">Brand name</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool ValidateCvv(string cvv, string brandName)
        {
            return GetValidator().ValidateCvv(cvv, brandName);
        }

        /// <summary>
        /// Validate CVV using a brand object
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="brand">Brand object</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool ValidateCvv(string cvv, BrandData.Brand brand)
        {
            return GetValidator().ValidateCvv(cvv, brand);
        }

        /// <summary>
        /// Validate CVV using a detailed brand result
        /// </summary>
        /// <param name="cvv">CVV code</param>
        /// <param name="detailedBrand">Detailed brand result</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool ValidateCvv(string cvv, DetailedBrandResult detailedBrand)
        {
            return GetValidator().ValidateCvv(cvv, detailedBrand);
        }

        /// <summary>
        /// Get information about a specific brand
        /// </summary>
        /// <param name="brandName">Brand name (e.g., "visa", "mastercard")</param>
        /// <returns>Brand information or null if not found</returns>
        public static BrandData.Brand GetBrandInfo(string brandName)
        {
            return GetValidator().GetBrandInfo(brandName);
        }

        /// <summary>
        /// Get detailed information about a specific brand
        /// </summary>
        /// <param name="scheme">Scheme name (e.g., "visa", "mastercard")</param>
        /// <returns>Detailed brand information or null if not found</returns>
        public static BrandDataDetailed.Brand GetBrandInfoDetailed(string scheme)
        {
            return GetValidator().GetBrandInfoDetailed(scheme);
        }

        /// <summary>
        /// List all supported brands
        /// </summary>
        /// <returns>List of brand names</returns>
        public static List<string> ListBrands()
        {
            return GetValidator().ListBrands();
        }
    }
}
