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


def test_find_brand_elo():
    """Test ELO brand identification."""
    # Static ELO BINs
    elo_bins = [
        '4011780000000000', '4011790000000000', '4312740000000000',
        '4389350000000000', '4514160000000000', '4573930000000000',
        '4576310000000000', '4576320000000000', '5041750000000000',
        '6277800000000000', '6362970000000000', '6363680000000000',
        # ELO ranges
        '5066990000000000', '5067770000000000', '5090000000000000',
        '5099980000000000', '6500310000000000', '6500320000000000',
        '6500330000000000', '6500350000000000', '6500500000000000',
        '6504050000000000', '6504380000000000', '6504850000000000',
        '6505370000000000', '6505410000000000', '6505970000000000',
        '6507000000000000', '6507180000000000', '6507210000000000',
        '6507270000000000', '6509010000000000', '6509990000000000',
        '6516520000000000', '6516790000000000', '6550000000000000',
        '6550190000000000', '6550210000000000', '6550570000000000',
    ]
    for card in elo_bins:
        brand = find_brand(card)
        assert brand is not None, f'Expected ELO for {card}'
        assert brand['name'] == 'elo', f'Expected ELO for {card}, got {brand["name"]}'


def test_find_brand_elo_invalid():
    """Test cards that should NOT be ELO."""
    invalid_elo = [
        '4011770000000000', '4011800000000000',
        '5066980000000000', '6500340000000000',
    ]
    for card in invalid_elo:
        brand = find_brand(card)
        assert brand is None or brand['name'] != 'elo', f'{card} should NOT be ELO'


def test_find_brand_aura():
    """Test Aura brand identification."""
    aura_cards = [
        '5000000000000000', '5010000000000000', '5020000000000000',
        '5030000000000000', '5040000000000000', '5050000000000000',
        '5060000000000000', '5070000000000000', '5080000000000000',
        '5078601912345600019', '5078601800003247449', '5078601870000127985',
    ]
    for card in aura_cards:
        brand = find_brand(card)
        assert brand is not None, f'Expected Aura for {card}'
        assert brand['name'] == 'aura', f'Expected Aura for {card}, got {brand["name"]}'


def test_find_brand_aura_invalid():
    """Test cards that should NOT be Aura (wrong length)."""
    invalid_aura = [
        '510000000000000', '500000000000000', '5100000000000000',
    ]
    for card in invalid_aura:
        brand = find_brand(card)
        assert brand is None or brand['name'] != 'aura', f'{card} should NOT be Aura'


def test_find_brand_hipercard():
    """Test Hipercard brand identification."""
    hipercard_bins = [
        '6062821294950895', '6062827452101536', '6062827557052048',
        '3841001111222233334', '3841401111222233334', '3841601111222233334',
    ]
    for card in hipercard_bins:
        brand = find_brand(card)
        assert brand is not None, f'Expected Hipercard for {card}'
        assert brand['name'] == 'hipercard', f'Expected Hipercard for {card}, got {brand["name"]}'


def test_find_brand_diners():
    """Test Diners brand identification."""
    diners_cards = [
        '30066909048113', '30266056449987', '38605306210123',
        '30111122223331', '30569309025904', '38520000023237', '36490102462661',
    ]
    for card in diners_cards:
        brand = find_brand(card)
        assert brand is not None, f'Expected Diners for {card}'
        assert brand['name'] == 'diners', f'Expected Diners for {card}, got {brand["name"]}'


def test_find_brand_diners_invalid():
    """Test cards that should NOT be Diners."""
    invalid_diners = [
        '310000000000000', '300000000000000', '3060000000000000',
        '370000000000000', '390000000000000',
    ]
    for card in invalid_diners:
        brand = find_brand(card)
        assert brand is None or brand['name'] != 'diners', f'{card} should NOT be Diners'


def test_find_brand_discover():
    """Test Discover brand identification."""
    discover_cards = [
        '6011236044609927', '6011091915358231', '6011726125958524', '6511020000245045',
    ]
    for card in discover_cards:
        brand = find_brand(card)
        assert brand is not None, f'Expected Discover for {card}'
        assert brand['name'] == 'discover', f'Expected Discover for {card}, got {brand["name"]}'


def test_find_brand_mastercard():
    """Test Mastercard brand identification."""
    mastercard_cards = [
        '5533798818319497', '5437251265160938', '5101514275875158',
        '5313557320486111', '5216730016991151', '2221000000000000', '2720990000000000',
    ]
    for card in mastercard_cards:
        brand = find_brand(card)
        assert brand is not None, f'Expected Mastercard for {card}'
        assert brand['name'] == 'mastercard', f'Expected Mastercard for {card}, got {brand["name"]}'


def test_find_brand_visa():
    """Test Visa brand identification."""
    visa_cards = [
        '4012001037141112', '4551870000000183', '4073020000000002',
        '4012001038443335', '4024007190131', '4556523434899',
        '4477509054445560', '4146805709584576', '6367000000001022',
    ]
    for card in visa_cards:
        brand = find_brand(card)
        assert brand is not None, f'Expected Visa for {card}'
        assert brand['name'] == 'visa', f'Expected Visa for {card}, got {brand["name"]}'


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


def test_luhn():
    """Test Luhn algorithm validation."""
    from creditcard_identifier.validator import luhn
    
    # Valid card numbers
    assert luhn('4012001037141112') is True
    assert luhn('5533798818319497') is True
    assert luhn('378282246310005') is True
    
    # Invalid card numbers
    assert luhn('1234567890123456') is False
    
    # Empty string
    assert luhn('') is False
    
    # String with non-digits
    assert luhn('4012-0010-3714-1112') is False
    
    # Validator class method
    validator = CreditCardValidator()
    assert validator.luhn('4012001037141112') is True
    assert validator.luhn('1234567890123456') is False
    
    # Non-string input should raise TypeError
    try:
        luhn(4012001037141112)
        assert False, 'Should have raised TypeError'
    except TypeError:
        pass


if __name__ == '__main__':
    test_find_brand()
    test_find_brand_detailed()
    test_is_supported()
    test_validate_cvv_with_name()
    test_validate_cvv_with_brand_object()
    test_validate_cvv_with_detailed_brand()
    test_validator_class()
    test_luhn()
    print('All tests passed!')
