using System;
using Xunit;
using CreditCardIdentifier;

namespace CreditCardIdentifier.Tests
{
    public class ValidatorTests
    {
        private readonly Validator _validator;

        public ValidatorTests()
        {
            _validator = new Validator();
        }

        [Fact]
        public void FindBrand_IdentifiesVisa()
        {
            var brand = _validator.FindBrand("4012001037141112");
            Assert.NotNull(brand);
            Assert.Equal("visa", brand.Name);
        }

        [Fact]
        public void FindBrand_IdentifiesMastercard()
        {
            var brand = _validator.FindBrand("5533798818319497");
            Assert.NotNull(brand);
            Assert.Equal("mastercard", brand.Name);
        }

        [Fact]
        public void FindBrand_IdentifiesAmex()
        {
            var brand = _validator.FindBrand("378282246310005");
            Assert.NotNull(brand);
            Assert.Equal("amex", brand.Name);
        }

        [Fact]
        public void FindBrand_ReturnsNullForEmpty()
        {
            var brand = _validator.FindBrand("");
            Assert.Null(brand);
        }

        [Fact]
        public void FindBrand_ReturnsNullForNull()
        {
            var brand = _validator.FindBrand(null);
            Assert.Null(brand);
        }

        [Fact]
        public void FindBrandDetailed_ReturnsDetailedInfo()
        {
            var brand = _validator.FindBrandDetailed("4012001037141112");
            Assert.NotNull(brand);
            Assert.Equal("visa", brand.Scheme);
            Assert.NotNull(brand.MatchedPattern);
        }

        [Fact]
        public void IsSupported_ReturnsTrueForValidCards()
        {
            Assert.True(_validator.IsSupported("4012001037141112"));
            Assert.True(_validator.IsSupported("5533798818319497"));
            Assert.True(_validator.IsSupported("378282246310005"));
        }

        [Fact]
        public void ListBrands_ReturnsListOfBrands()
        {
            var brands = _validator.ListBrands();
            Assert.NotEmpty(brands);
            Assert.Contains("visa", brands);
            Assert.Contains("mastercard", brands);
        }

        [Fact]
        public void GetBrandInfo_ReturnsVisaInfo()
        {
            var visaInfo = _validator.GetBrandInfo("visa");
            Assert.NotNull(visaInfo);
            Assert.Equal("visa", visaInfo.Name);
            Assert.NotNull(visaInfo.RegexpBin);
            Assert.NotNull(visaInfo.RegexpFull);
            Assert.NotNull(visaInfo.RegexpCvv);
        }

        [Fact]
        public void GetBrandInfoDetailed_ReturnsDetailedInfo()
        {
            var visaInfo = _validator.GetBrandInfoDetailed("visa");
            Assert.NotNull(visaInfo);
            Assert.Equal("visa", visaInfo.Scheme);
        }

        [Fact]
        public void ValidateCvv_WithBrandName_ValidatesVisaCvv()
        {
            Assert.True(_validator.ValidateCvv("123", "visa"));
            Assert.False(_validator.ValidateCvv("12", "visa"));
        }

        [Fact]
        public void ValidateCvv_WithBrandName_ValidatesAmexCvv()
        {
            Assert.True(_validator.ValidateCvv("1234", "amex"));
        }

        [Fact]
        public void ValidateCvv_WithBrandObject_ValidatesCvv()
        {
            var brand = _validator.FindBrand("4012001037141112");
            Assert.True(_validator.ValidateCvv("123", brand));
            Assert.False(_validator.ValidateCvv("1234", brand));
        }

        [Fact]
        public void ValidateCvv_WithDetailedBrand_ValidatesCvv()
        {
            var brand = _validator.FindBrandDetailed("4012001037141112");
            Assert.True(_validator.ValidateCvv("123", brand));
            Assert.False(_validator.ValidateCvv("1234", brand));
        }

        [Fact]
        public void StaticMethods_Work()
        {
            var brand = CreditCard.FindBrand("4012001037141112");
            Assert.NotNull(brand);
            Assert.Equal("visa", brand.Name);
            Assert.True(CreditCard.IsSupported("4012001037141112"));
        }

        [Fact]
        public void StaticMethods_FindBrandDetailed_Works()
        {
            var brand = CreditCard.FindBrandDetailed("4012001037141112");
            Assert.NotNull(brand);
            Assert.Equal("visa", brand.Scheme);
        }

        [Fact]
        public void StaticMethods_ValidateCvv_Works()
        {
            Assert.True(CreditCard.ValidateCvv("123", "visa"));
            
            var brand = CreditCard.FindBrand("4012001037141112");
            Assert.True(CreditCard.ValidateCvv("123", brand));
            
            var detailedBrand = CreditCard.FindBrandDetailed("4012001037141112");
            Assert.True(CreditCard.ValidateCvv("123", detailedBrand));
        }
    }
}
