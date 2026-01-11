'use strict';

// Load native data (no JSON parsing needed)
const brands = require('./data/brands');

// Pre-compile regex patterns for better performance
const compiledBrands = brands.map(b => ({
  name: b.name,
  regexpBin: new RegExp(b.regexpBin),
  regexpFull: new RegExp(b.regexpFull),
  regexpCvv: new RegExp(b.regexpCvv)
}));

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

  const brand = compiledBrands.find(b => b.regexpFull.test(cardNumber));

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
  return compiledBrands.some(b => b.regexpFull.test(cardNumber));
}

/**
 * Get hipercard regex pattern
 * @returns {RegExp} Hipercard regex
 */
function hipercardRegexp() {
  const card = compiledBrands.find(b => b.name === 'hipercard');
  return card ? card.regexpFull : new RegExp('^$');
}

/**
 * Validate CVV for a brand
 * @param {string} cvv - CVV code
 * @param {string} brandName - Brand name
 * @returns {boolean} True if valid
 */
function validateCvv(cvv, brandName) {
  const brand = compiledBrands.find(b => b.name === brandName);
  if (!brand) return false;
  return brand.regexpCvv.test(cvv);
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