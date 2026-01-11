using System.Collections.Generic;
using System.Linq;

namespace CreditCardIdentifier
{
    /// <summary>
    /// Credit Card BIN Validator
    /// 
    /// This class provides credit card validation using bin-cc data.
    /// </summary>
    public class Validator
    {
        private readonly BrandData.Brand[] _brands;

        /// <summary>
        /// Initialize validator with pre-compiled brand data
        /// </summary>
        public Validator()
        {
            _brands = BrandData.Brands;
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

            var brand = _brands.FirstOrDefault(b => b.RegexpFull.IsMatch(cardNumber));
            return brand?.Name;
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

            return brand.RegexpCvv.IsMatch(cvv);
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
