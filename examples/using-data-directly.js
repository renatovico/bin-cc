'use strict';

/**
 * Example: Using bin-cc as a data source
 * 
 * This example shows how other libraries can consume the credit card
 * BIN data directly from this package, similar to how tzdata is used
 * by date/time libraries.
 */

const creditcard = require('../index.js');

console.log('=== Using bin-cc as a Data File Project ===\n');

// Method 1: Access data through the module exports
console.log('Method 1: Via module exports');
console.log('Available brands:', creditcard.data.brands.map(b => b.name).join(', '));
console.log('');

// Method 2: Use the data in your own validation logic
console.log('Method 2: Custom validation using the data');
function customValidate(cardNumber, brandName) {
    const brand = creditcard.data.brands.find(b => b.name === brandName);
    if (!brand) {
        return false;
    }
    const regexp = new RegExp(brand.regexpFull);
    return regexp.test(cardNumber);
}

console.log('Is 4012001037141112 a valid Visa?', customValidate('4012001037141112', 'visa'));
console.log('Is 5533798818319497 a valid Mastercard?', customValidate('5533798818319497', 'mastercard'));
console.log('');

// Method 3: Extract specific brand information
console.log('Method 3: Extract specific brand patterns');
const visaData = creditcard.data.brands.find(b => b.name === 'visa');
if (visaData) {
    console.log('Visa BIN pattern:', visaData.regexpBin);
    console.log('Visa full validation pattern:', visaData.regexpFull);
    console.log('Visa CVV pattern:', visaData.regexpCvv);
} else {
    console.log('Visa brand not found');
}
console.log('');

// Method 4: Use the built-in functions (still available)
console.log('Method 4: Using built-in functions');
console.log('Brand of 4012001037141112:', creditcard.findBrand('4012001037141112'));
console.log('Is 378282246310005 supported?', creditcard.isSupported('378282246310005'));
