package com.creditcard.identifier;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Credit Card BIN Validator
 * 
 * This class provides credit card validation using bin-cc data.
 */
public class CreditCardValidator {
    
    private static final int[] LUHN_LOOKUP = {0, 2, 4, 6, 8, 1, 3, 5, 7, 9};
    
    private final List<BrandData.Brand> brands;
    private final List<BrandDataDetailed.BrandDetailed> brandsDetailed;
    private final Map<BrandData.Brand, CompiledBrand> compiledBrands;
    
    private static class CompiledBrand {
        final Pattern regexpBin;
        final Pattern regexpFull;
        final Pattern regexpCvv;
        final BrandData.Brand brand;
        
        CompiledBrand(BrandData.Brand brand) {
            this.brand = brand;
            this.regexpBin = Pattern.compile(brand.regexpBin);
            this.regexpFull = Pattern.compile(brand.regexpFull);
            this.regexpCvv = Pattern.compile(brand.regexpCvv);
        }
    }
    
    /**
     * Create a new validator with default brand data.
     */
    public CreditCardValidator() {
        this.brands = BrandData.BRANDS;
        this.brandsDetailed = BrandDataDetailed.BRANDS;
        this.compiledBrands = new HashMap<>();
        
        // Pre-compile regex patterns for performance
        for (BrandData.Brand brand : brands) {
            compiledBrands.put(brand, new CompiledBrand(brand));
        }
    }
    
    /**
     * Validate a credit card number using the Luhn algorithm.
     * 
     * @param number Credit card number (digits only)
     * @return true if valid according to Luhn algorithm
     */
    public static boolean luhn(String number) {
        if (number == null || number.isEmpty()) {
            return false;
        }
        
        int total = 0;
        boolean x2 = true;
        
        for (int i = number.length() - 1; i >= 0; i--) {
            int value = number.charAt(i) - '0';
            if (value < 0 || value > 9) {
                return false;
            }
            
            x2 = !x2;
            total += x2 ? LUHN_LOOKUP[value] : value;
        }
        
        return total % 10 == 0;
    }
    
    /**
     * Find card brand by card number.
     * 
     * @param cardNumber Credit card number
     * @return Brand name or null if not found
     */
    public String findBrand(String cardNumber) {
        if (cardNumber == null || cardNumber.isEmpty()) {
            return null;
        }
        
        for (CompiledBrand compiled : compiledBrands.values()) {
            if (compiled.regexpFull.matcher(cardNumber).matches()) {
                return compiled.brand.name;
            }
        }
        
        return null;
    }
    
    /**
     * Find card brand with detailed information.
     * 
     * @param cardNumber Credit card number
     * @return Detailed brand information or null if not found
     */
    public BrandDataDetailed.BrandDetailed findBrandDetailed(String cardNumber) {
        String brandName = findBrand(cardNumber);
        if (brandName == null) {
            return null;
        }
        
        for (BrandDataDetailed.BrandDetailed brand : brandsDetailed) {
            if (brand.scheme.equals(brandName)) {
                return brand;
            }
        }
        
        return null;
    }
    
    /**
     * Check if card number is supported.
     * 
     * @param cardNumber Credit card number
     * @return true if supported
     */
    public boolean isSupported(String cardNumber) {
        return findBrand(cardNumber) != null;
    }
    
    /**
     * Validate CVV for a brand.
     * 
     * @param cvv CVV code
     * @param brandName Brand name (e.g., "visa", "mastercard")
     * @return true if valid
     */
    public boolean validateCvv(String cvv, String brandName) {
        if (cvv == null || brandName == null) {
            return false;
        }
        
        for (CompiledBrand compiled : compiledBrands.values()) {
            if (compiled.brand.name.equals(brandName)) {
                return compiled.regexpCvv.matcher(cvv).matches();
            }
        }
        
        return false;
    }
    
    /**
     * Get brand info by name.
     * 
     * @param brandName Brand name
     * @return Brand info or null
     */
    public BrandData.Brand getBrandInfo(String brandName) {
        for (BrandData.Brand brand : brands) {
            if (brand.name.equals(brandName)) {
                return brand;
            }
        }
        return null;
    }
    
    /**
     * Get detailed brand info by scheme name.
     * 
     * @param scheme Scheme name (e.g., "visa", "mastercard")
     * @return Detailed brand info or null
     */
    public BrandDataDetailed.BrandDetailed getBrandInfoDetailed(String scheme) {
        for (BrandDataDetailed.BrandDetailed brand : brandsDetailed) {
            if (brand.scheme.equals(scheme)) {
                return brand;
            }
        }
        return null;
    }
    
    /**
     * List all supported brands.
     * 
     * @return Array of brand names
     */
    public String[] listBrands() {
        String[] names = new String[brands.size()];
        for (int i = 0; i < brands.size(); i++) {
            names[i] = brands.get(i).name;
        }
        return names;
    }
}
