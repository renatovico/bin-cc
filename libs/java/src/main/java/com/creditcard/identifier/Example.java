package com.creditcard.identifier;

import java.util.HashMap;
import java.util.Map;

/**
 * Credit Card Validator - Java Example
 * 
 * This example shows how to use the creditcard-identifier library.
 */
public class Example {
    
    public static void main(String[] args) {
        System.out.println("=== Credit Card Validator - Java Example ===\n");
        
        CreditCardValidator validator = new CreditCardValidator();
        
        // Example 1: List all brands
        System.out.println("Supported brands: " + String.join(", ", validator.listBrands()));
        System.out.println();
        
        // Example 2: Identify card brands
        Map<String, String> testCards = new HashMap<>();
        testCards.put("4012001037141112", "visa");
        testCards.put("5533798818319497", "mastercard");
        testCards.put("378282246310005", "amex");
        testCards.put("6011236044609927", "discover");
        testCards.put("6362970000457013", "elo");
        testCards.put("6062825624254001", "hipercard");
        testCards.put("6220123456789012", "unionpay");
        testCards.put("6759123456789012", "maestro");
        
        System.out.println("Card brand identification:");
        for (Map.Entry<String, String> entry : testCards.entrySet()) {
            String card = entry.getKey();
            String expected = entry.getValue();
            String brandName = validator.findBrand(card);
            String status = expected.equals(brandName) ? "✓" : "✗";
            System.out.println(status + " " + card + ": " + brandName + " (expected: " + expected + ")");
        }
        System.out.println();
        
        // Example 3: Check if card is supported
        System.out.println("Check if card is supported:");
        System.out.println("Visa card supported: " + validator.isSupported("4012001037141112"));
        System.out.println("Invalid card supported: " + validator.isSupported("1234567890123456"));
        System.out.println();
        
        // Example 4: CVV validation
        System.out.println("CVV validation:");
        System.out.println("Visa CVV 123: " + validator.validateCvv("123", "visa"));
        System.out.println("Amex CVV 1234: " + validator.validateCvv("1234", "amex"));
        System.out.println("Visa CVV 12: " + validator.validateCvv("12", "visa") + " (invalid)");
        System.out.println();
        
        // Example 5: Get brand details
        System.out.println("Visa brand details:");
        BrandData.Brand visaInfo = validator.getBrandInfo("visa");
        if (visaInfo != null) {
            System.out.println("  Name: " + visaInfo.name);
            System.out.println("  BIN pattern: " + visaInfo.regexpBin);
            System.out.println("  Full pattern: " + visaInfo.regexpFull);
            System.out.println("  CVV pattern: " + visaInfo.regexpCvv);
        }
        System.out.println();
        
        // Example 6: Get detailed brand information
        System.out.println("Visa detailed info:");
        BrandDataDetailed.BrandDetailed visaDetailed = validator.getBrandInfoDetailed("visa");
        if (visaDetailed != null) {
            System.out.println("  Scheme: " + visaDetailed.scheme);
            System.out.println("  Brand: " + visaDetailed.brand);
            System.out.println("  Type: " + visaDetailed.type);
        }
        System.out.println();
        
        // Example 7: Find brand with detailed info
        System.out.println("Find brand with detailed info:");
        BrandDataDetailed.BrandDetailed brandDetailed = validator.findBrandDetailed("4012001037141112");
        if (brandDetailed != null) {
            System.out.println("  Scheme: " + brandDetailed.scheme);
            System.out.println("  Brand: " + brandDetailed.brand);
            System.out.println("  Type: " + brandDetailed.type);
        }
        System.out.println();
        
        // Example 8: Luhn validation
        System.out.println("Luhn validation:");
        System.out.println("Valid card: " + CreditCardValidator.luhn("4012001037141112"));
        System.out.println("Invalid card: " + CreditCardValidator.luhn("4012001037141113"));
    }
}
