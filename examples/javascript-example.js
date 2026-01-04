'use strict';

/**
 * Example: Using bin-cc with the new compiled format schema
 * 
 * This example shows how to use the credit card BIN data with both
 * the new compiled format (preferred) and simplified format (for backward compatibility).
 * 
 * The library automatically detects and uses the available format.
 */

const creditcard = require('../libs/javascript/index.js');

console.log('=== Using bin-cc with New Format Schema ===\n');

// The library supports both compiled and simplified formats
// Check what format is currently loaded
const sampleBrand = creditcard.data.brands[0];
const isNewFormat = sampleBrand.hasOwnProperty('scheme');
console.log('Data format detected:', isNewFormat ? 'New compiled format' : 'Simplified format');
console.log('');

// Method 1: Access data through the module exports
console.log('Method 1: Via module exports');
if (isNewFormat) {
    // New format uses 'scheme' instead of 'name'
    console.log('Available brands:', creditcard.data.brands.map(b => b.scheme).join(', '));
} else {
    // Simplified format uses 'name'
    console.log('Available brands:', creditcard.data.brands.map(b => b.name).join(', '));
}
console.log('');

// Method 2: Use the data in your own validation logic
console.log('Method 2: Custom validation using the data');
function customValidate(cardNumber, brandName) {
    let brand;
    if (isNewFormat) {
        brand = creditcard.data.brands.find(b => b.scheme === brandName);
    } else {
        brand = creditcard.data.brands.find(b => b.name === brandName);
    }
    
    if (!brand) {
        return false;
    }
    
    let pattern;
    if (isNewFormat) {
        pattern = brand.patterns.full;
    } else {
        pattern = brand.regexpFull;
    }
    
    const regexp = new RegExp(pattern);
    return regexp.test(cardNumber);
}

console.log('Is 4012001037141112 a valid Visa?', customValidate('4012001037141112', 'visa'));
console.log('Is 5533798818319497 a valid Mastercard?', customValidate('5533798818319497', 'mastercard'));
console.log('');

// Method 3: Extract specific brand information
console.log('Method 3: Extract specific brand patterns');
let visaData;
if (isNewFormat) {
    visaData = creditcard.data.brands.find(b => b.scheme === 'visa');
} else {
    visaData = creditcard.data.brands.find(b => b.name === 'visa');
}

if (visaData) {
    if (isNewFormat) {
        // New format has patterns array with detailed pattern information
        console.log('Visa scheme:', visaData.scheme);
        console.log('Visa brand name:', visaData.brand);
        console.log('Visa patterns:', JSON.stringify(visaData.patterns, null, 2));
        console.log('Visa card lengths:', visaData.number.lengths);
        console.log('Visa CVV length:', visaData.cvv.length);
        console.log('Visa Luhn check required:', visaData.number.luhn);
        console.log('Visa countries:', visaData.countries);
    } else {
        // Simplified format has flat structure
        console.log('Visa BIN pattern:', visaData.regexpBin);
        console.log('Visa full validation pattern:', visaData.regexpFull);
        console.log('Visa CVV pattern:', visaData.regexpCvv);
    }
} else {
    console.log('Visa brand not found');
}
console.log('');

// Method 4: Use the built-in functions (still available - format-agnostic)
console.log('Method 4: Using built-in functions (format-agnostic)');
console.log('Brand of 4012001037141112:', creditcard.findBrand('4012001037141112'));
console.log('Brand of 5533798818319497:', creditcard.findBrand('5533798818319497'));
console.log('Brand of 378282246310005:', creditcard.findBrand('378282246310005'));
console.log('Is 378282246310005 supported?', creditcard.isSupported('378282246310005'));
console.log('');

// Method 5: NEW FORMAT - Access additional metadata
if (isNewFormat) {
    console.log('Method 5: Using new format features');
    const amexData = creditcard.data.brands.find(b => b.scheme === 'amex');
    if (amexData) {
        console.log('American Express metadata:');
        console.log('  Type:', amexData.type);
        console.log('  Source file:', amexData.metadata.sourceFile);
        console.log('  Card lengths:', amexData.number.lengths);
        console.log('  Luhn validation:', amexData.number.luhn);
    }
}
