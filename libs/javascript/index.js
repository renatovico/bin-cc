'use strict';

const creditcardIdentifier = require('./creditcard-identifier.js');

// Export everything from the main module
module.exports = creditcardIdentifier;

// Also provide direct access to data for other libraries
module.exports.data = {
    brands: creditcardIdentifier.brands
};
