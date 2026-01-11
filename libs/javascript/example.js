'use strict';

/**
 * Credit Card Validator - JavaScript Example
 * 
 * This example shows how to use the creditcard-identifier library.
 * 
 * In production, install via: npm install creditcard-identifier
 */

const creditcard = require('./index.js');

console.log('=== Credit Card Validator - JavaScript Example ===\n');

// Using module-level functions
console.log('Using module-level functions:');
const visaBrand = creditcard.findBrand('4012001037141112');
console.log('Brand of 4012001037141112:', visaBrand.name);
console.log('Is supported:', creditcard.isSupported('4012001037141112'));
console.log();

// Example 1: List all brands
console.log('Supported brands:', creditcard.listBrands().join(', '));
console.log();

// Example 2: Identify card brands
const testCards = {
  '4012001037141112': 'visa',
  '5533798818319497': 'mastercard',
  '378282246310005': 'amex',
  '6011236044609927': 'discover',
  '6362970000457013': 'elo',
  '6062825624254001': 'hipercard'
};

console.log('Card brand identification:');
for (const [card, expected] of Object.entries(testCards)) {
  const brand = creditcard.findBrand(card);
  const brandName = brand?.name || null;
  const status = brandName === expected ? '✓' : '✗';
  console.log(`${status} ${card}: ${brandName} (expected: ${expected})`);
}
console.log();

// Example 3: CVV validation
console.log('CVV validation:');
console.log('Visa CVV 123:', creditcard.validateCvv('123', 'visa'));
console.log('Amex CVV 1234:', creditcard.validateCvv('1234', 'amex'));
console.log('Visa CVV 12:', creditcard.validateCvv('12', 'visa'), '(invalid)');
console.log();

// Example 4: Get brand details
console.log('Visa brand details:');
const visaInfo = creditcard.getBrandInfo('visa');
if (visaInfo) {
  console.log('  BIN pattern:', visaInfo.regexpBin);
  console.log('  Full pattern:', visaInfo.regexpFull);
  console.log('  CVV pattern:', visaInfo.regexpCvv);
}
console.log();

// Example 5: Access raw data
console.log('Raw data access:');
console.log('Number of brands loaded:', creditcard.data.brands.length);
console.log('First brand:', creditcard.data.brands[0].name);
