"""
Credit Card BIN Validator

This module provides credit card validation using bin-cc data.
"""

import re
from .brands import BRANDS
from .brands_detailed import BRANDS as BRANDS_DETAILED


# Luhn lookup table for doubling digits
_LUHN_LOOKUP = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]


def luhn(number):
    """
    Validate a credit card number using the Luhn algorithm.
    
    Args:
        number: Credit card number as string (digits only)
        
    Returns:
        True if valid according to Luhn algorithm, False otherwise
        
    Raises:
        TypeError: If number is not a string
    """
    if not isinstance(number, str):
        raise TypeError('Expected string input')
    if not number:
        return False
    
    total = 0
    x2 = True
    
    for i in range(len(number) - 1, -1, -1):
        value = ord(number[i]) - 48
        if value < 0 or value > 9:
            return False
        
        x2 = not x2
        total += _LUHN_LOOKUP[value] if x2 else value
    
    return total % 10 == 0


# Pre-compile regex patterns for performance
_compiled_brands = [
    {
        **brand,
        '_regexp_bin': re.compile(brand['regexp_bin']),
        '_regexp_full': re.compile(brand['regexp_full']),
        '_regexp_cvv': re.compile(brand['regexp_cvv']),
    }
    for brand in BRANDS
]


class CreditCardValidator:
    """Credit card validator using bin-cc data."""
    
    def __init__(self):
        """
        Initialize validator with brand data.
        """
        self.brands = _compiled_brands
        self.brands_detailed = BRANDS_DETAILED
    
    def find_brand(self, card_number, detailed=False):
        """
        Identify the credit card brand.
        
        Args:
            card_number: Credit card number as string
            detailed: If True, returns detailed brand info with matched bin
            
        Returns:
            Brand dict or None if not found. If detailed=True, includes
            matched_pattern and matched_bin fields.
        """
        if not card_number:
            return None
        
        # Collect all matching brands
        matching_brands = [b for b in self.brands if b['_regexp_full'].match(card_number)]
        
        if not matching_brands:
            return None
        
        # Resolve priority: a brand with priority_over takes precedence
        brand = matching_brands[0]
        if len(matching_brands) > 1:
            matching_names = {b['name'] for b in matching_brands}
            for candidate in matching_brands:
                # Check if this candidate has priority over any other matching brand
                if any(p in matching_names for p in candidate.get('priority_over', [])):
                    brand = candidate
                    break
        
        if detailed:
            detailed_brand = next(
                (b for b in self.brands_detailed if b['scheme'] == brand['name']),
                None
            )
            if detailed_brand:
                # Find the specific pattern that matched
                matched_pattern = None
                for p in detailed_brand.get('patterns', []):
                    if re.match(p['bin'], card_number):
                        matched_pattern = p
                        break
                
                # Find the specific bin that matched (if bins exist)
                bin_prefix = card_number[:6]
                matched_bin = None
                for b in detailed_brand.get('bins', []):
                    if bin_prefix.startswith(b['bin']) or b['bin'] == bin_prefix:
                        matched_bin = b
                        break
                
                # Return without the full bins array
                result = {k: v for k, v in detailed_brand.items() if k != 'bins'}
                result['matched_pattern'] = matched_pattern
                result['matched_bin'] = matched_bin
                return result
        
        # Return brand info without internal compiled regex fields
        return {k: v for k, v in brand.items() if not k.startswith('_')}
    
    def is_supported(self, card_number):
        """
        Check if card number is supported.
        
        Args:
            card_number: Credit card number as string
            
        Returns:
            True if supported, False otherwise
        """
        return self.find_brand(card_number) is not None
    
    def validate_cvv(self, cvv, brand_or_name):
        """
        Validate CVV for a specific brand.
        
        Args:
            cvv: CVV code as string
            brand_or_name: Brand name (str) or brand object from find_brand
            
        Returns:
            True if valid, False otherwise
        """
        if not cvv:
            return False
        
        # Handle brand object (dict)
        if isinstance(brand_or_name, dict):
            # Handle detailed brand object
            if 'cvv' in brand_or_name and 'length' in brand_or_name['cvv']:
                expected_length = brand_or_name['cvv']['length']
                return re.match(f'^\\d{{{expected_length}}}$', cvv) is not None
            # Handle simplified brand object
            if 'regexp_cvv' in brand_or_name:
                return re.match(brand_or_name['regexp_cvv'], cvv) is not None
            # Handle brand name from object
            brand_name = brand_or_name.get('name') or brand_or_name.get('scheme')
            if brand_name:
                brand = next((b for b in self.brands if b['name'] == brand_name), None)
                if brand:
                    return brand['_regexp_cvv'].match(cvv) is not None
            return False
        
        # Handle brand name (string)
        brand = next((b for b in self.brands if b['name'] == brand_or_name), None)
        if not brand:
            return False
        
        return brand['_regexp_cvv'].match(cvv) is not None
    
    def get_brand_info(self, brand_name):
        """
        Get information about a specific brand.
        
        Args:
            brand_name: Brand name (e.g., 'visa', 'mastercard')
            
        Returns:
            Brand dictionary or None if not found
        """
        brand = next((b for b in self.brands if b['name'] == brand_name), None)
        if brand:
            # Return without internal compiled regex fields
            return {k: v for k, v in brand.items() if not k.startswith('_')}
        return None
    
    def get_brand_info_detailed(self, scheme):
        """
        Get detailed information about a specific brand.
        
        Args:
            scheme: Scheme name (e.g., 'visa', 'mastercard')
            
        Returns:
            Detailed brand dictionary or None if not found
        """
        return next((b for b in self.brands_detailed if b['scheme'] == scheme), None)
    
    def list_brands(self):
        """
        List all supported brands.
        
        Returns:
            List of brand names
        """
        return [brand['name'] for brand in self.brands]
    
    def luhn(self, number):
        """
        Validate a credit card number using the Luhn algorithm.
        
        Args:
            number: Credit card number as string (digits only)
            
        Returns:
            True if valid according to Luhn algorithm, False otherwise
        """
        return luhn(number)


# Module-level convenience functions using a singleton validator
_validator = None


def _get_validator():
    """Get or create the singleton validator instance."""
    global _validator
    if _validator is None:
        _validator = CreditCardValidator()
    return _validator


def find_brand(card_number, detailed=False):
    """
    Identify the credit card brand.
    
    Args:
        card_number: Credit card number as string
        detailed: If True, returns detailed brand info with matched bin
        
    Returns:
        Brand dict or None if not found
    """
    return _get_validator().find_brand(card_number, detailed)


def is_supported(card_number):
    """
    Check if card number is supported.
    
    Args:
        card_number: Credit card number as string
        
    Returns:
        True if supported, False otherwise
    """
    return _get_validator().is_supported(card_number)


def validate_cvv(cvv, brand_or_name):
    """
    Validate CVV for a specific brand.
    
    Args:
        cvv: CVV code as string
        brand_or_name: Brand name (str) or brand object from find_brand
        
    Returns:
        True if valid, False otherwise
    """
    return _get_validator().validate_cvv(cvv, brand_or_name)
