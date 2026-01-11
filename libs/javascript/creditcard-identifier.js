'use strict';

// Load native data (no JSON parsing needed)
const brands = require('./data/brands');
const brandsDetailed = require('./data/brands-detailed');

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
 * @param {boolean} [detailed=false] - If true, returns detailed brand info with matched bin
 * @returns {object} Brand object or throws if not supported
 */
function findBrand(cardNumber, detailed = false) {
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

  if (detailed) {
    const detailedBrand = brandsDetailed.find(b => b.scheme === brand.name);
    if (detailedBrand) {
      // Find the specific pattern that matched
      const matchedPattern = detailedBrand.patterns.find(p => {
        const regex = new RegExp(p.bin);
        return regex.test(cardNumber);
      });
      
      // Find the specific bin that matched (if bins exist)
      const binPrefix = cardNumber.slice(0, 6);
      const matchedBin = detailedBrand.bins 
        ? detailedBrand.bins.find(b => binPrefix.startsWith(b.bin) || b.bin === binPrefix)
        : null;
      
      // Return without the full bins array, only the matched one
      const { bins, ...brandWithoutBins } = detailedBrand;
      return {
        ...brandWithoutBins,
        matchedPattern: matchedPattern || null,
        matchedBin: matchedBin || null
      };
    }
  }

  return brands.find(b => b.name === brand.name);
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
 * Validate CVV for a brand
 * @param {string} cvv - CVV code
 * @param {string|object} brandOrName - Brand name (string) or brand object from findBrand
 * @returns {boolean} True if valid
 */
function validateCvv(cvv, brandOrName) {
  if (!cvv) return false;
  
  // If it's an object (brand from findBrand), get the CVV length from it
  if (typeof brandOrName === 'object' && brandOrName !== null) {
    // Handle detailed brand object
    if (brandOrName.cvv && brandOrName.cvv.length) {
      const expectedLength = brandOrName.cvv.length;
      return new RegExp(`^\\d{${expectedLength}}$`).test(cvv);
    }
    // Handle simplified brand object
    if (brandOrName.regexpCvv) {
      return new RegExp(brandOrName.regexpCvv).test(cvv);
    }
    // Handle brand name from object
    if (brandOrName.name || brandOrName.scheme) {
      const brandName = brandOrName.name || brandOrName.scheme;
      const brand = compiledBrands.find(b => b.name === brandName);
      if (!brand) return false;
      return brand.regexpCvv.test(cvv);
    }
    return false;
  }
  
  // If it's a string, treat as brand name
  const brand = compiledBrands.find(b => b.name === brandOrName);
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
 * Get detailed brand info by scheme name
 * @param {string} scheme - Scheme name (e.g., 'visa', 'mastercard')
 * @returns {object|null} Detailed brand info or null
 */
function getBrandInfoDetailed(scheme) {
  return brandsDetailed.find(b => b.scheme === scheme) || null;
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
  validateCvv,
  getBrandInfo,
  getBrandInfoDetailed,
  listBrands,
  brands,
  brandsDetailed
};