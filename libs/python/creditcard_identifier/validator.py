"""
Credit Card BIN Validator

This module provides credit card validation using bin-cc data.
"""

import json
import re
import os
from pathlib import Path


class CreditCardValidator:
    """Credit card validator using bin-cc data."""
    
    def __init__(self, data_path=None):
        """
        Initialize validator with brand data.
        
        Args:
            data_path: Path to brands.json. If None, uses bundled data.
        """
        if data_path is None:
            # Look for bundled data in package
            package_dir = Path(__file__).parent
            data_path = package_dir / 'data' / 'cards.json'
            
            # Fallback to repository data for development
            if not data_path.exists():
                repo_root = package_dir.parent.parent.parent
                data_path = repo_root / 'data' / 'compiled' / 'cards.json'
        
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


# Module-level convenience functions using a singleton validator
_validator = None


def _get_validator():
    """Get or create the singleton validator instance."""
    global _validator
    if _validator is None:
        _validator = CreditCardValidator()
    return _validator


def find_brand(card_number):
    """
    Identify the credit card brand.
    
    Args:
        card_number: Credit card number as string
        
    Returns:
        Brand name (str) or None if not found
    """
    return _get_validator().find_brand(card_number)


def is_supported(card_number):
    """
    Check if card number is supported.
    
    Args:
        card_number: Credit card number as string
        
    Returns:
        True if supported, False otherwise
    """
    return _get_validator().is_supported(card_number)
