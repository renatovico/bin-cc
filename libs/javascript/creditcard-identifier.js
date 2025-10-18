'use strict';

const path = require('path');
const fs = require('fs');

// Try to load data from downloaded file first, fall back to bundled data
let brands;
const downloadedDataPath = path.join(__dirname, 'data', 'brands.json');
const bundledDataPath = path.join(__dirname, '../../data/brands.json');

if (fs.existsSync(downloadedDataPath)) {
  // Load from downloaded data
  brands = require(downloadedDataPath);
} else if (fs.existsSync(bundledDataPath)) {
  // Fall back to bundled data (for development)
  brands = require(bundledDataPath);
} else {
  throw new Error(
    'Credit card data not found. Please run: npm run postinstall or download-data.js'
  );
}

function cardNumberFilter(cardNumber, brand) {
    if (typeof cardNumber !== 'string') {
        throw Error('Card number should be a string');
    }

    return cardNumber.match(brand.regexpFull) !== null;
}

function cardNameFilter(brandName, brand) {
    return brandName === brand.name;
}

function hipercardRegexp() {
    let card = brands.filter(cardNameFilter.bind(this,'hipercard'))[0];
    if (card) {
        return new RegExp(card.regexpFull);
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

    brand = (brand === undefined) ? undefined : brand.name;

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


