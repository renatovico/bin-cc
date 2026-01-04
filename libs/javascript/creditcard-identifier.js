'use strict';

const path = require('path');
const fs = require('fs');

// Try to load data from downloaded file first, fall back to bundled data
let brands;
let isNewFormat = false;

// Prefer new compiled format, fall back to simplified format
const downloadedCompiledPath = path.join(__dirname, 'data', 'compiled', 'brands.json');
const bundledCompiledPath = path.join(__dirname, '../../data/compiled/brands.json');
const downloadedSimplifiedPath = path.join(__dirname, 'data', 'brands.json');
const bundledSimplifiedPath = path.join(__dirname, '../../data/brands.json');

if (fs.existsSync(downloadedCompiledPath)) {
  // Load from downloaded compiled data (new format)
  brands = require(downloadedCompiledPath);
  isNewFormat = true;
} else if (fs.existsSync(bundledCompiledPath)) {
  // Fall back to bundled compiled data (for development)
  brands = require(bundledCompiledPath);
  isNewFormat = true;
} else if (fs.existsSync(downloadedSimplifiedPath)) {
  // Load from downloaded simplified data
  brands = require(downloadedSimplifiedPath);
  isNewFormat = false;
} else if (fs.existsSync(bundledSimplifiedPath)) {
  // Fall back to bundled simplified data (for development)
  brands = require(bundledSimplifiedPath);
  isNewFormat = false;
} else {
  throw new Error(
    'Credit card data not found. Please run: npm run postinstall or download-data.js'
  );
}

// Helper to check if a card number matches a brand's patterns (new format with patterns array)
function matchesPatternsArray(cardNumber, patterns) {
    for (const pattern of patterns) {
        // Check if BIN matches
        const binRegex = new RegExp(pattern.bin);
        if (!binRegex.test(cardNumber)) {
            continue;  // BIN doesn't match, try next pattern
        }
        
        // BIN matches - check if length is valid
        const lengths = Array.isArray(pattern.length) ? pattern.length : [pattern.length];
        if (lengths.includes(cardNumber.length)) {
            return true;  // Both BIN and length match
        }
    }
    return false;  // No pattern matched
}

// Helper to get the regex pattern from brand data (supports both formats)
function getFullPattern(brand) {
    if (isNewFormat) {
        // New format stores patterns array - we don't need a full pattern
        // Instead, we'll use matchesPatternsArray directly
        // This is a fallback for compatibility if patterns has bin/full structure
        if (brand.patterns && brand.patterns.full) {
            return brand.patterns.full;
        }
        // If patterns is an array, we can't return a single regex
        // Return null to indicate we should use matchesPatternsArray
        return null;
    }
    return brand.regexpFull;
}

// Helper to get the brand name/scheme (supports both formats)
function getBrandName(brand) {
    if (isNewFormat) {
        return brand.scheme;
    }
    return brand.name;
}

function cardNumberFilter(cardNumber, brand) {
    if (typeof cardNumber !== 'string') {
        throw Error('Card number should be a string');
    }

    // For new format with patterns array, use direct matching
    if (isNewFormat && Array.isArray(brand.patterns)) {
        return matchesPatternsArray(cardNumber, brand.patterns);
    }
    
    // For simplified format or new format with full pattern
    const pattern = getFullPattern(brand);
    if (!pattern) {
        return false;  // No pattern available
    }
    return cardNumber.match(pattern) !== null;
}

function cardNameFilter(brandName, brand) {
    return brandName === getBrandName(brand);
}

function hipercardRegexp() {
    let card = brands.filter(cardNameFilter.bind(this,'hipercard'))[0];
    if (card) {
        const pattern = getFullPattern(card);
        return new RegExp(pattern);
    } else {
        return new RegExp('^$');
    }
}

function findBrand(cardNumber) {
    if(!cardNumber || cardNumber === '') {
        cardNumber = '000000';
    }
    let brand = brands.filter(cardNumberFilter.bind(this, cardNumber))[0];

    if (brand === undefined) {
        throw Error('card number not supported');
    }

    brand = (brand === undefined) ? undefined : getBrandName(brand);

    return brand;
}

function isSupported(cardNumber) {
    let number = cardNumber || '0000000000000001';

    let supported = false;
    let result = brands.filter(cardNumberFilter.bind(this, number))[0];
    if (result !== undefined) {
        supported = true;
    }

    return supported;
}

module.exports = {
    findBrand: findBrand,
    isSupported: isSupported,
    hipercardRegexp: hipercardRegexp,
    brands: brands
}


