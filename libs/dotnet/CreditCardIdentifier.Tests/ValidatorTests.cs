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
            Assert.Equal("visa", brand);
        }

        [Fact]
        public void FindBrand_IdentifiesMastercard()
        {
            var brand = _validator.FindBrand("5533798818319497");
            Assert.Equal("mastercard", brand);
        }

        [Fact]
        public void FindBrand_IdentifiesAmex()
        {
            var brand = _validator.FindBrand("378282246310005");
            Assert.Equal("amex", brand);
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
        public void ValidateCvv_ValidatesVisaCvv()
        {
            Assert.True(_validator.ValidateCvv("123", "visa"));
            Assert.False(_validator.ValidateCvv("12", "visa"));
        }

        [Fact]
        public void ValidateCvv_ValidatesAmexCvv()
        {
            Assert.True(_validator.ValidateCvv("1234", "amex"));
        }

        [Fact]
        public void StaticMethods_Work()
        {
            Assert.Equal("visa", CreditCard.FindBrand("4012001037141112"));
            Assert.True(CreditCard.IsSupported("4012001037141112"));
        }
    }
}
