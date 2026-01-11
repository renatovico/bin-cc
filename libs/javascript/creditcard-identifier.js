'use strict';

const path = require('path');
const fs = require('fs');

// Load data from local data file
const localDataPath = path.join(__dirname, 'data', 'cards.json');

let brands;
if (fs.existsSync(localDataPath)) {
  brands = require(localDataPath);
} else {
  throw new Error(
    'Credit card data not found. Please run: npm run build from the root directory'
  );
}

/**
 * Find card brand by card number
 * @param {string} cardNumber - Credit card number
 * @returns {string} Brand name or throws if not supported
 */
function findBrand(cardNumber) {
  if (!cardNumber || cardNumber === '') {
    cardNumber = '000000';
  }

  if (typeof cardNumber !== 'string') {
    throw Error('Card number should be a string');
  }

  const brand = brands.find(b => {
    const regex = new RegExp(b.regexpFull);
    return regex.test(cardNumber);
  });

  if (!brand) {
    throw Error('card number not supported');
  }

  return brand.name;
}

/**
 * Check if card number is supported
 * @param {string} cardNumber - Credit card number
 * @returns {boolean} True if supported
 */
function isSupported(cardNumber) {
  if (!cardNumber) return false;

  return brands.some(b => {
    const regex = new RegExp(b.regexpFull);
    return regex.test(cardNumber);
  });
}

/**
 * Get hipercard regex pattern
 * @returns {RegExp} Hipercard regex
 */
function hipercardRegexp() {
  const card = brands.find(b => b.name === 'hipercard');
  if (card) {
    return new RegExp(card.regexpFull);
  }
  return new RegExp('^$');
}

/**
 * Validate CVV for a brand
 * @param {string} cvv - CVV code
 * @param {string} brandName - Brand name
 * @returns {boolean} True if valid
 */
function validateCvv(cvv, brandName) {
  const brand = brands.find(b => b.name === brandName);
  if (!brand) return false;

  const regex = new RegExp(brand.regexpCvv);
  return regex.test(cvv);
}

/**
 * Get brand info by name
 * @param {string} brandName - Brand name
 * @returns {object|null} Brand info or null
 */
function getBrandInfo(brandName) {
  return brands.find(b => b.name === brandName) || null;
}

/**
 * List all supported brands
 * @returns {string[]} Array of brand names
 */
function listBrands() {
  return brands.map(b => b.name);
}

module.exports = {
  findBrand,
  isSupported,
  hipercardRegexp,
  validateCvv,
  getBrandInfo,
  listBrands,
  brands
};


