<?php

namespace CreditCard\Identifier;

/**
 * Credit Card BIN Validator
 * 
 * This class provides credit card validation using bin-cc data.
 */
class CreditCardValidator
{
    /** @var array Luhn lookup table for doubling digits */
    private const LUHN_LOOKUP = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
    
    /** @var array<array> Simplified brand data */
    private array $brands;
    
    /** @var array<array> Detailed brand data */
    private array $brandsDetailed;
    
    /** @var array<array> Compiled brand patterns */
    private array $compiledBrands;
    
    /**
     * Create a new validator with default brand data.
     */
    public function __construct()
    {
        $this->brands = BrandData::getBrands();
        $this->brandsDetailed = BrandDataDetailed::getBrands();
        $this->compiledBrands = [];
        
        // Pre-compile regex patterns for performance
        foreach ($this->brands as $brand) {
            $this->compiledBrands[] = [
                'name' => $brand['name'],
                'regexpBin' => '/' . $brand['regexpBin'] . '/',
                'regexpFull' => '/' . $brand['regexpFull'] . '/',
                'regexpCvv' => '/' . $brand['regexpCvv'] . '/',
                'brand' => $brand,
            ];
        }
    }
    
    /**
     * Validate a credit card number using the Luhn algorithm.
     * 
     * @param string $number Credit card number (digits only)
     * @return bool true if valid according to Luhn algorithm
     */
    public static function luhn(string $number): bool
    {
        if (empty($number)) {
            return false;
        }
        
        $total = 0;
        $x2 = true;
        
        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $value = ord($number[$i]) - 48;
            if ($value < 0 || $value > 9) {
                return false;
            }
            
            $x2 = !$x2;
            $total += $x2 ? self::LUHN_LOOKUP[$value] : $value;
        }
        
        return $total % 10 === 0;
    }
    
    /**
     * Find card brand by card number.
     * 
     * @param string $cardNumber Credit card number
     * @return string|null Brand name or null if not found
     */
    public function findBrand(string $cardNumber): ?string
    {
        if (empty($cardNumber)) {
            return null;
        }
        
        // Collect all matching brands
        $matchingBrands = [];
        foreach ($this->compiledBrands as $compiled) {
            if (preg_match($compiled['regexpFull'], $cardNumber)) {
                $matchingBrands[] = $compiled;
            }
        }
        
        if (empty($matchingBrands)) {
            return null;
        }
        
        if (count($matchingBrands) === 1) {
            return $matchingBrands[0]['name'];
        }
        
        // Multiple matches - check priorityOver
        $matchingNames = array_flip(array_column($matchingBrands, 'name'));
        
        foreach ($matchingBrands as $candidate) {
            foreach ($candidate['brand']['priorityOver'] as $priority) {
                if (isset($matchingNames[$priority])) {
                    return $candidate['name'];
                }
            }
        }
        
        // No priority winner found, return first match
        return $matchingBrands[0]['name'];
    }
    
    /**
     * Find card brand with detailed information.
     * 
     * @param string $cardNumber Credit card number
     * @return array|null Detailed brand information or null if not found
     */
    public function findBrandDetailed(string $cardNumber): ?array
    {
        $brandName = $this->findBrand($cardNumber);
        if ($brandName === null) {
            return null;
        }
        
        foreach ($this->brandsDetailed as $brand) {
            if ($brand['scheme'] === $brandName) {
                return $brand;
            }
        }
        
        return null;
    }
    
    /**
     * Check if card number is supported.
     * 
     * @param string $cardNumber Credit card number
     * @return bool true if supported
     */
    public function isSupported(string $cardNumber): bool
    {
        return $this->findBrand($cardNumber) !== null;
    }
    
    /**
     * Validate CVV for a brand.
     * 
     * @param string $cvv CVV code
     * @param string $brandName Brand name (e.g., "visa", "mastercard")
     * @return bool true if valid
     */
    public function validateCvv(string $cvv, string $brandName): bool
    {
        if (empty($cvv)) {
            return false;
        }
        
        foreach ($this->compiledBrands as $compiled) {
            if ($compiled['name'] === $brandName) {
                return (bool) preg_match($compiled['regexpCvv'], $cvv);
            }
        }
        
        return false;
    }
    
    /**
     * Get brand info by name.
     * 
     * @param string $brandName Brand name
     * @return array|null Brand info or null
     */
    public function getBrandInfo(string $brandName): ?array
    {
        foreach ($this->brands as $brand) {
            if ($brand['name'] === $brandName) {
                return $brand;
            }
        }
        return null;
    }
    
    /**
     * Get detailed brand info by scheme name.
     * 
     * @param string $scheme Scheme name (e.g., "visa", "mastercard")
     * @return array|null Detailed brand info or null
     */
    public function getBrandInfoDetailed(string $scheme): ?array
    {
        foreach ($this->brandsDetailed as $brand) {
            if ($brand['scheme'] === $scheme) {
                return $brand;
            }
        }
        return null;
    }
    
    /**
     * List all supported brands.
     * 
     * @return array<string> Array of brand names
     */
    public function listBrands(): array
    {
        return array_map(fn($brand) => $brand['name'], $this->brands);
    }
}
