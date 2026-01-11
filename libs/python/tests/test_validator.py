"""Test credit card validator."""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from creditcard_identifier import CreditCardValidator, find_brand, is_supported, validate_cvv


def test_find_brand():
    """Test brand identification."""
    # Test Visa - now returns brand object
    brand = find_brand('4012001037141112')
    assert brand is not None
    assert brand['name'] == 'visa'
    
    # Test Mastercard
    brand = find_brand('5533798818319497')
    assert brand['name'] == 'mastercard'
    
    # Test Amex
    brand = find_brand('378282246310005')
    assert brand['name'] == 'amex'
    
    # Test invalid/unsupported
    assert find_brand('') is None


def test_find_brand_detailed():
    """Test detailed brand identification."""
    brand = find_brand('4012001037141112', detailed=True)
    assert brand is not None
    assert brand['scheme'] == 'visa'
    assert 'matched_pattern' in brand
    assert 'bins' not in brand  # Should not include full bins array


def test_is_supported():
    """Test card support checking."""
    assert is_supported('4012001037141112') is True
    assert is_supported('5533798818319497') is True
    assert is_supported('378282246310005') is True


def test_validate_cvv_with_name():
    """Test CVV validation with brand name."""
    assert validate_cvv('123', 'visa') is True
    assert validate_cvv('1234', 'amex') is True
    assert validate_cvv('12', 'visa') is False


def test_validate_cvv_with_brand_object():
    """Test CVV validation with brand object."""
    brand = find_brand('4012001037141112')
    assert validate_cvv('123', brand) is True
    assert validate_cvv('1234', brand) is False


def test_validate_cvv_with_detailed_brand():
    """Test CVV validation with detailed brand object."""
    brand = find_brand('4012001037141112', detailed=True)
    assert validate_cvv('123', brand) is True
    assert validate_cvv('1234', brand) is False


def test_validator_class():
    """Test validator class methods."""
    validator = CreditCardValidator()
    
    # Test find_brand returns object
    brand = validator.find_brand('4012001037141112')
    assert brand is not None
    assert brand['name'] == 'visa'
    
    # Test find_brand detailed
    brand_detailed = validator.find_brand('4012001037141112', detailed=True)
    assert brand_detailed['scheme'] == 'visa'
    assert 'matched_pattern' in brand_detailed
    
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
    assert 'regexp_bin' in visa_info
    assert 'regexp_full' in visa_info
    assert 'regexp_cvv' in visa_info
    
    # Test get_brand_info_detailed
    visa_detailed = validator.get_brand_info_detailed('visa')
    assert visa_detailed is not None
    assert visa_detailed['scheme'] == 'visa'
    
    # Test validate_cvv with name
    assert validator.validate_cvv('123', 'visa') is True
    assert validator.validate_cvv('1234', 'amex') is True
    assert validator.validate_cvv('12', 'visa') is False
    
    # Test validate_cvv with brand object
    assert validator.validate_cvv('123', brand) is True
    assert validator.validate_cvv('123', brand_detailed) is True


if __name__ == '__main__':
    test_find_brand()
    test_find_brand_detailed()
    test_is_supported()
    test_validate_cvv_with_name()
    test_validate_cvv_with_brand_object()
    test_validate_cvv_with_detailed_brand()
    test_validator_class()
    print('All tests passed!')
