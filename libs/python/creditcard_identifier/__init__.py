"""
Credit Card Identifier - Python Library

A Python library for credit card BIN validation using bin-cc data.
"""

from .validator import CreditCardValidator, find_brand, is_supported

__version__ = "1.0.0"
__all__ = ["CreditCardValidator", "find_brand", "is_supported"]
