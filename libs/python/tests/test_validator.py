"""Test credit card validator."""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from creditcard_identifier import CreditCardValidator, find_brand, is_supported


def test_find_brand():
    """Test brand identification."""
    # Test Visa
    assert find_brand('4012001037141112') == 'visa'
    
    # Test Mastercard
    assert find_brand('5533798818319497') == 'mastercard'
    
    # Test Amex
    assert find_brand('378282246310005') == 'amex'
    
    # Test invalid/unsupported
    assert find_brand('1234567890123456') is None or find_brand('1234567890123456') in ['discover', 'hipercard', 'elo', 'aura', 'diners', 'jcb']


def test_is_supported():
    """Test card support checking."""
    assert is_supported('4012001037141112') is True
    assert is_supported('5533798818319497') is True
    assert is_supported('378282246310005') is True


def test_validator_class():
    """Test validator class methods."""
    validator = CreditCardValidator()
    
    # Test find_brand
    assert validator.find_brand('4012001037141112') == 'visa'
    
    # Test is_supported
    assert validator.is_supported('4012001037141112') is True
    
    # Test list_brands
    brands = validator.list_brands()
    assert isinstance(brands, list)
    assert 'visa' in brands
    assert 'mastercard' in brands
    
    # Test get_brand_info
    visa_info = validator.get_brand_info('visa')
    assert visa_info is not None
    assert visa_info['name'] == 'visa'
    assert 'regexpBin' in visa_info
    assert 'regexpFull' in visa_info
    assert 'regexpCvv' in visa_info
    
    # Test validate_cvv
    assert validator.validate_cvv('123', 'visa') is True
    assert validator.validate_cvv('1234', 'amex') is True
    assert validator.validate_cvv('12', 'visa') is False


if __name__ == '__main__':
    test_find_brand()
    test_is_supported()
    test_validator_class()
    print('All tests passed!')
