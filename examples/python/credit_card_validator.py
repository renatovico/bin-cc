#!/usr/bin/env python3
"""
Credit Card BIN Validator - Python Example

This example shows how to use the bin-cc data file project in Python.
It loads the brands.json file and performs credit card validation.
"""

import json
import re
import os


class CreditCardValidator:
    """Credit card validator using bin-cc data."""
    
    def __init__(self, data_path=None):
        """
        Initialize validator with brand data.
        
        Args:
            data_path: Path to brands.json. If None, uses default location.
        """
        if data_path is None:
            # Default path relative to this file
            current_dir = os.path.dirname(__file__)
            data_path = os.path.join(current_dir, '../../data/brands.json')
        
        with open(data_path, 'r') as f:
            self.brands = json.load(f)
    
    def find_brand(self, card_number):
        """
        Identify the credit card brand.
        
        Args:
            card_number: Credit card number as string
            
        Returns:
            Brand name (str) or None if not found
        """
        if not card_number:
            return None
        
        for brand in self.brands:
            pattern = brand['regexpFull']
            if re.match(pattern, card_number):
                return brand['name']
        
        return None
    
    def is_supported(self, card_number):
        """
        Check if card number is supported.
        
        Args:
            card_number: Credit card number as string
            
        Returns:
            True if supported, False otherwise
        """
        return self.find_brand(card_number) is not None
    
    def validate_cvv(self, cvv, brand_name):
        """
        Validate CVV for a specific brand.
        
        Args:
            cvv: CVV code as string
            brand_name: Brand name (e.g., 'visa', 'mastercard')
            
        Returns:
            True if valid, False otherwise
        """
        brand = next((b for b in self.brands if b['name'] == brand_name), None)
        if not brand:
            return False
        
        pattern = brand['regexpCvv']
        return re.match(pattern, cvv) is not None
    
    def get_brand_info(self, brand_name):
        """
        Get information about a specific brand.
        
        Args:
            brand_name: Brand name (e.g., 'visa', 'mastercard')
            
        Returns:
            Brand dictionary or None if not found
        """
        return next((b for b in self.brands if b['name'] == brand_name), None)
    
    def list_brands(self):
        """
        List all supported brands.
        
        Returns:
            List of brand names
        """
        return [brand['name'] for brand in self.brands]


def main():
    """Example usage of the credit card validator."""
    
    print('=== Credit Card Validator - Python Example ===\n')
    
    validator = CreditCardValidator()
    
    # Example 1: List all brands
    print('Supported brands:', ', '.join(validator.list_brands()))
    print()
    
    # Example 2: Identify card brands
    test_cards = {
        '4012001037141112': 'Visa',
        '5533798818319497': 'Mastercard',
        '378282246310005': 'Amex',
        '6011236044609927': 'Discover'
    }
    
    print('Card brand identification:')
    for card, expected in test_cards.items():
        brand = validator.find_brand(card)
        status = '✓' if brand else '✗'
        print(f'{status} {card}: {brand} (expected: {expected.lower()})')
    print()
    
    # Example 3: CVV validation
    print('CVV validation:')
    print(f'Visa CVV 123: {validator.validate_cvv("123", "visa")}')
    print(f'Amex CVV 1234: {validator.validate_cvv("1234", "amex")}')
    print(f'Visa CVV 12: {validator.validate_cvv("12", "visa")} (invalid)')
    print()
    
    # Example 4: Get brand details
    print('Visa brand details:')
    visa_info = validator.get_brand_info('visa')
    if visa_info:
        print(f'  BIN pattern: {visa_info["regexpBin"]}')
        print(f'  Full pattern: {visa_info["regexpFull"]}')
        print(f'  CVV pattern: {visa_info["regexpCvv"]}')


if __name__ == '__main__':
    main()
