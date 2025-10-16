'use strict';

// Load brands data from JSON file using require (more efficient in Node.js)
const brands = require('../../data/brands.json');

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


