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
  '6062825624254001': 'hipercard',
  '6220123456789012': 'unionpay',
  '6759123456789012': 'maestro'
};

console.log('Card brand identification:');
for (const [card, expected] of Object.entries(testCards)) {
  const brand = creditcard.findBrand(card);
  const brandName = brand?.name || null;
  const status = brandName === expected ? '✓' : '✗';
  console.log(`${status} ${card}: ${brandName} (expected: ${expected})`);
}
console.log();

// Example 3: Check if card is supported
console.log('Check if card is supported:');
console.log('Visa card supported:', creditcard.isSupported('4012001037141112'));
console.log('Invalid card supported:', creditcard.isSupported('1234567890123456'));
console.log();

// Example 4: CVV validation
console.log('CVV validation:');
console.log('Visa CVV 123:', creditcard.validateCvv('123', 'visa'));
console.log('Amex CVV 1234:', creditcard.validateCvv('1234', 'amex'));
console.log('Visa CVV 12:', creditcard.validateCvv('12', 'visa'), '(invalid)');
console.log();

// Example 5: Get brand details
console.log('Visa brand details:');
const visaInfo = creditcard.getBrandInfo('visa');
if (visaInfo) {
  console.log('  Name:', visaInfo.name);
  console.log('  BIN pattern:', visaInfo.regexpBin.toString());
  console.log('  Full pattern:', visaInfo.regexpFull.toString());
  console.log('  CVV pattern:', visaInfo.regexpCvv.toString());
}
console.log();

// Example 6: Get detailed brand information
console.log('Visa detailed info:');
const visaDetailed = creditcard.getBrandInfoDetailed('visa');
if (visaDetailed) {
  console.log('  Scheme:', visaDetailed.scheme);
  console.log('  Issuer:', visaDetailed.issuerName);
  console.log('  Type:', visaDetailed.type);
  console.log('  Country:', visaDetailed.country);
}
console.log();

// Example 7: Find brand with detailed info
console.log('Find brand with detailed info:');
const brandDetailed = creditcard.findBrand('4012001037141112', true);
if (brandDetailed) {
  console.log('  Scheme:', brandDetailed.scheme);
  console.log('  Issuer:', brandDetailed.issuerName);
  console.log('  Type:', brandDetailed.type);
  if (brandDetailed.matchedPattern) {
    console.log('  Matched pattern:', brandDetailed.matchedPattern.bin);
  }
}
console.log();

// Example 8: Access raw data
console.log('Raw data access:');
console.log('Number of brands loaded:', creditcard.data.brands.length);
console.log('First brand:', creditcard.data.brands[0].name);
