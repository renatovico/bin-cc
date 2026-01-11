#!/usr/bin/env python3
"""
Credit Card Validator - Python Example

This example shows how to use the creditcard-identifier library.

In production, install via: pip install creditcard-identifier
"""

from creditcard_identifier import CreditCardValidator


def main():
    """Example usage of the credit card validator."""
    
    print('=== Credit Card Validator - Python Example ===\n')
    
    # Create validator instance
    validator = CreditCardValidator()
    
    # Example 1: List all brands
    print('Supported brands:', ', '.join(validator.list_brands()))
    print()
    
    # Example 2: Identify card brands
    test_cards = {
        '4012001037141112': 'visa',
        '5533798818319497': 'mastercard',
        '378282246310005': 'amex',
        '6011236044609927': 'discover',
        '6362970000457013': 'elo',
        '6062825624254001': 'hipercard',
        '6220123456789012': 'unionpay',
        '6759123456789012': 'maestro'
    }
    
    print('Card brand identification:')
    for card, expected in test_cards.items():
        brand = validator.find_brand(card)
        status = '✓' if brand == expected else '✗'
        print(f'{status} {card}: {brand} (expected: {expected})')
    print()
    
    # Example 3: Check if card is supported
    print('Check if card is supported:')
    print(f'Visa card supported: {validator.is_supported("4012001037141112")}')
    print(f'Invalid card supported: {validator.is_supported("1234567890123456")}')
    print()
    
    # Example 4: CVV validation
    print('CVV validation:')
    print(f'Visa CVV 123: {validator.validate_cvv("123", "visa")}')
    print(f'Amex CVV 1234: {validator.validate_cvv("1234", "amex")}')
    print(f'Visa CVV 12: {validator.validate_cvv("12", "visa")} (invalid)')
    print()
    
    # Example 5: Get brand details
    print('Visa brand details:')
    visa_info = validator.get_brand_info('visa')
    if visa_info:
        print(f'  Name: {visa_info["name"]}')
        print(f'  BIN pattern: {visa_info["regexpBin"]}')
        print(f'  Full pattern: {visa_info["regexpFull"]}')
        print(f'  CVV pattern: {visa_info["regexpCvv"]}')
    print()
    
    # Example 6: Get detailed brand information
    print('Visa detailed info:')
    visa_detailed = validator.get_brand_info_detailed('visa')
    if visa_detailed:
        print(f'  Scheme: {visa_detailed["scheme"]}')
        print(f'  Issuer: {visa_detailed["issuerName"]}')
        print(f'  Type: {visa_detailed["type"]}')
        print(f'  Country: {visa_detailed["country"]}')
    print()
    
    # Example 7: Find brand with detailed info
    print('Find brand with detailed info:')
    brand_detailed = validator.find_brand('4012001037141112', detailed=True)
    if brand_detailed:
        print(f'  Scheme: {brand_detailed["scheme"]}')
        print(f'  Issuer: {brand_detailed["issuerName"]}')
        print(f'  Type: {brand_detailed["type"]}')
        if brand_detailed.get('matchedPattern'):
            print(f'  Matched pattern: {brand_detailed["matchedPattern"]["bin"]}')


if __name__ == '__main__':
    main()
