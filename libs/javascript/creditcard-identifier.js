'use strict';

const path = require('path');
const fs = require('fs');

// Try to load data from downloaded file first, fall back to bundled data
let brands;
let isNewFormat = false;

// Prefer new compiled format, fall back to legacy format
const downloadedCompiledPath = path.join(__dirname, 'data', 'compiled', 'brands.json');
const bundledCompiledPath = path.join(__dirname, '../../data/compiled/brands.json');
const downloadedLegacyPath = path.join(__dirname, 'data', 'brands.json');
const bundledLegacyPath = path.join(__dirname, '../../data/brands.json');

if (fs.existsSync(downloadedCompiledPath)) {
  // Load from downloaded compiled data (new format)
  brands = require(downloadedCompiledPath);
  isNewFormat = true;
} else if (fs.existsSync(bundledCompiledPath)) {
  // Fall back to bundled compiled data (for development)
  brands = require(bundledCompiledPath);
  isNewFormat = true;
} else if (fs.existsSync(downloadedLegacyPath)) {
  // Load from downloaded legacy data
  brands = require(downloadedLegacyPath);
  isNewFormat = false;
} else if (fs.existsSync(bundledLegacyPath)) {
  // Fall back to bundled legacy data (for development)
  brands = require(bundledLegacyPath);
  isNewFormat = false;
} else {
  throw new Error(
    'Credit card data not found. Please run: npm run postinstall or download-data.js'
  );
}

// Helper to get the regex pattern from brand data (supports both formats)
function getFullPattern(brand) {
    if (isNewFormat) {
        return brand.patterns.full;
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

    const pattern = getFullPattern(brand);
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


