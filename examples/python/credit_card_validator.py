#!/usr/bin/env python3
"""
Credit Card Validator - Python Example

This example shows how to use the creditcard-identifier library.
For the full library implementation, see: libs/python/
"""

import sys
import os

# Add library to path (for development/testing)
# In production, you would install via: pip install creditcard-identifier
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../libs/python'))

from creditcard_identifier import CreditCardValidator, find_brand, is_supported


def main():
    """Example usage of the credit card validator."""
    
    print('=== Credit Card Validator - Python Example ===\n')
    
    # Using module-level functions
    print('Using module-level functions:')
    print(f'Brand of 4012001037141112: {find_brand("4012001037141112")}')
    print(f'Is supported: {is_supported("4012001037141112")}')
    print()
    
    # Using the Validator class
    validator = CreditCardValidator()
    
    # Example 1: List all brands
    print('Supported brands:', ', '.join(validator.list_brands()))
    print()
    
    # Example 2: Identify card brands
    test_cards = {
        '4012001037141112': 'visa',
        '5533798818319497': 'mastercard',
        '378282246310005': 'amex',
        '6011236044609927': 'discover'
    }
    
    print('Card brand identification:')
    for card, expected in test_cards.items():
        brand = validator.find_brand(card)
        status = '✓' if brand == expected else '✗'
        print(f'{status} {card}: {brand} (expected: {expected})')
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
