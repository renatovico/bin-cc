"""
Credit Card Identifier - Python Library

A Python library for credit card BIN validation using bin-cc data.
"""

from .validator import (
    CreditCardValidator,
    find_brand,
    is_supported,
    validate_cvv,
)
from .brands import BRANDS as brands
from .brands_detailed import BRANDS as brands_detailed

__version__ = "2.0.0"
__all__ = [
    "CreditCardValidator",
    "find_brand",
    "is_supported",
    "validate_cvv",
    "brands",
    "brands_detailed",
]
