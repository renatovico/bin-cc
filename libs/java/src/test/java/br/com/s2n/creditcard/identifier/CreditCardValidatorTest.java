package br.com.s2n.creditcard.identifier;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Tests for CreditCardValidator.
 */
public class CreditCardValidatorTest {
    
    private final CreditCardValidator validator = new CreditCardValidator();
    
    @Test
    public void testLuhnValidNumbers() {
        assertTrue("Valid Visa", CreditCardValidator.luhn("4012001037141112"));
        assertTrue("Valid Mastercard", CreditCardValidator.luhn("5533798818319497"));
        assertTrue("Valid Amex", CreditCardValidator.luhn("378282246310005"));
    }
    
    @Test
    public void testLuhnInvalidNumbers() {
        assertFalse("Invalid number", CreditCardValidator.luhn("1234567890123456"));
        assertFalse("Empty string", CreditCardValidator.luhn(""));
        assertFalse("Modified valid number", CreditCardValidator.luhn("4012001037141113"));
    }
    
    @Test
    public void testFindBrandVisa() {
        assertEquals("visa", validator.findBrand("4012001037141112"));
        assertEquals("visa", validator.findBrand("4551870000000183"));
        assertEquals("visa", validator.findBrand("6367000000001022"));
    }
    
    @Test
    public void testFindBrandMastercard() {
        assertEquals("mastercard", validator.findBrand("5533798818319497"));
        assertEquals("mastercard", validator.findBrand("5437251265160938"));
        assertEquals("mastercard", validator.findBrand("2221000000000000"));
    }
    
    @Test
    public void testFindBrandAmex() {
        assertEquals("amex", validator.findBrand("378282246310005"));
        assertEquals("amex", validator.findBrand("376411112222331"));
        assertEquals("amex", validator.findBrand("371449635398431"));
    }
    
    @Test
    public void testFindBrandDiscover() {
        assertEquals("discover", validator.findBrand("6011236044609927"));
        assertEquals("discover", validator.findBrand("6011091915358231"));
    }
    
    @Test
    public void testFindBrandDiners() {
        assertEquals("diners", validator.findBrand("30066909048113"));
        assertEquals("diners", validator.findBrand("30266056449987"));
        assertEquals("diners", validator.findBrand("36490102462661"));
    }
    
    @Test
    public void testFindBrandElo() {
        assertEquals("elo", validator.findBrand("6362970000457013"));
        assertEquals("elo", validator.findBrand("6363680000000000"));
        assertEquals("elo", validator.findBrand("6277800000000000"));
    }
    
    @Test
    public void testFindBrandHipercard() {
        assertEquals("hipercard", validator.findBrand("6062825624254001"));
        assertEquals("hipercard", validator.findBrand("6062821294950895"));
    }
    
    @Test
    public void testFindBrandUnsupported() {
        assertNull("Unsupported card", validator.findBrand("1234567890123456"));
        assertNull("Empty string", validator.findBrand(""));
    }
    
    @Test
    public void testIsSupported() {
        assertTrue("Visa supported", validator.isSupported("4012001037141112"));
        assertTrue("Mastercard supported", validator.isSupported("5533798818319497"));
        assertFalse("Unsupported card", validator.isSupported("1234567890123456"));
        assertFalse("Empty string", validator.isSupported(""));
    }
    
    @Test
    public void testValidateCvv() {
        assertTrue("Visa CVV 123", validator.validateCvv("123", "visa"));
        assertTrue("Amex CVV 1234", validator.validateCvv("1234", "amex"));
        assertFalse("Visa CVV 12", validator.validateCvv("12", "visa"));
        assertFalse("Visa CVV 1234", validator.validateCvv("1234", "visa"));
        assertFalse("Empty CVV", validator.validateCvv("", "visa"));
        assertFalse("Unknown brand", validator.validateCvv("123", "unknown"));
    }
    
    @Test
    public void testGetBrandInfo() {
        BrandData.Brand visaInfo = validator.getBrandInfo("visa");
        assertNotNull("Visa info exists", visaInfo);
        assertEquals("Visa name", "visa", visaInfo.name);
        assertNotNull("Visa regexp", visaInfo.regexpFull);
        
        assertNull("Unknown brand", validator.getBrandInfo("unknown"));
    }
    
    @Test
    public void testGetBrandInfoDetailed() {
        BrandDataDetailed.BrandDetailed visaDetailed = validator.getBrandInfoDetailed("visa");
        assertNotNull("Visa detailed exists", visaDetailed);
        assertEquals("Visa scheme", "visa", visaDetailed.scheme);
        assertEquals("Visa brand name", "Visa", visaDetailed.brand);
        assertTrue("Visa number lengths", visaDetailed.number.lengths.length > 0);
        
        assertNull("Unknown scheme", validator.getBrandInfoDetailed("unknown"));
    }
    
    @Test
    public void testFindBrandDetailed() {
        BrandDataDetailed.BrandDetailed brand = validator.findBrandDetailed("4012001037141112");
        assertNotNull("Brand detailed exists", brand);
        assertEquals("Visa scheme", "visa", brand.scheme);
        assertEquals("Visa brand name", "Visa", brand.brand);
    }
    
    @Test
    public void testListBrands() {
        String[] brands = validator.listBrands();
        assertNotNull("Brands list exists", brands);
        assertTrue("Brands list not empty", brands.length > 0);
        
        boolean hasVisa = false;
        boolean hasMastercard = false;
        for (String brand : brands) {
            if ("visa".equals(brand)) hasVisa = true;
            if ("mastercard".equals(brand)) hasMastercard = true;
        }
        
        assertTrue("Has Visa", hasVisa);
        assertTrue("Has Mastercard", hasMastercard);
    }
}
