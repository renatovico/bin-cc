'use strict';

const Chai = require('chai');
const creditcardIdentifier = require('../creditcard-identifier.js');
const { findBrand, validateCvv, isSupported, getBrandInfo, getBrandInfoDetailed, listBrands } = creditcardIdentifier;

let expect = Chai.expect;

// Simple range function to replace lodash.range
const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);

let ELO_BINS = [401178,401179,431274,438935,451416,457393,457631,457632,504175,627780,636297,636368];
Array.prototype.push.apply(ELO_BINS, range(506699,506778));
Array.prototype.push.apply(ELO_BINS, range(509000,509999));
Array.prototype.push.apply(ELO_BINS, range(650031,650033));
Array.prototype.push.apply(ELO_BINS, range(650035,650051));
Array.prototype.push.apply(ELO_BINS, range(650405,650439));
Array.prototype.push.apply(ELO_BINS, range(650485,650538));
Array.prototype.push.apply(ELO_BINS, range(650541,650598));
Array.prototype.push.apply(ELO_BINS, range(650700,650718));
Array.prototype.push.apply(ELO_BINS, range(650721,650727));
Array.prototype.push.apply(ELO_BINS, range(650901,650920));
Array.prototype.push.apply(ELO_BINS, range(651652,651679));
Array.prototype.push.apply(ELO_BINS, range(655000,655019));
Array.prototype.push.apply(ELO_BINS, range(655021, 655058));

describe('Find Brand tests', function() {
    this.timeout(5000);

    it('Should return brand object with name property', function(done) {
        const brand = findBrand('4111111111111111');
        expect(brand).to.be.an('object');
        expect(brand.name).to.equal('visa');
        done();
    });

    it('Should return detailed brand with matchedPattern when detailed=true', function(done) {
        const brand = findBrand('4111111111111111', true);
        expect(brand).to.be.an('object');
        expect(brand.scheme).to.equal('visa');
        expect(brand.matchedPattern).to.be.an('object');
        expect(brand).to.not.have.property('bins');
        done();
    });

    it('Should not identify elo for bin 4011770000000000', function invalidElo(done) {
        expect(findBrand('4011770000000000').name).to.not.equal('elo');
        done();
    });

    it('Should not identify elo for bin 4011800000000000', function invalidElo(done) {
        expect(findBrand('4011800000000000').name).to.not.equal('elo');
        done();
    });

    it('Should not identify elo for bin 5066980000000000', function invalidElo(done) {
        expect(findBrand('5066980000000000').name).to.not.equal('elo');
        done();
    });

    it('Should not identify elo for bin 6500340000000000', function invalidElo(done) {
        expect(findBrand('6500340000000000').name).to.not.equal('elo');
        done();
    });

    it('Should identify elo for bins ', function validElo(done) {
        ELO_BINS.forEach(function(cardbin) {
            const binStr = cardbin.toString();
            const padding = '0'.repeat(16 - binStr.length);
            expect(findBrand(binStr + padding).name).to.equal('elo');
        });
        done();
    });

    ['6062821294950895','6062827452101536','6062827557052048','3841001111222233334','3841401111222233334', '3841601111222233334'].forEach(function(cardbin) {
        it('Should identify hipercard for bin '+cardbin, function validHiper(done) {
            expect(findBrand(cardbin+'').name).to.equal('hipercard');
            done();
        });
    });

    ['378282246310005', '376411112222331', '371449635398431', '378734493671000', '376449047333005'].forEach(function(cardbin) {
        it('Should identify amex for bin '+cardbin, function validAmex(done) {
            expect(findBrand(cardbin+'').name).to.equal('amex');
            done();
        });
    });

    ['310000000000000','300000000000000','3060000000000000','370000000000000','390000000000000'].forEach(function(cardbin) {
        it('Should not identify diners for bin '+cardbin, function invaliDinners(done) {
            try {
                expect(findBrand(cardbin+'').name).to.not.equal('diners');
            } catch(err) {
                expect(err.message).to.equal('card number not supported');
            }
            done();
        });
    });

    ['30066909048113','30266056449987','38605306210123','30111122223331', '30569309025904', '38520000023237', '36490102462661'].forEach(function(cardbin) {
        it('Should identify diners for bin '+cardbin, function validDinners(done) {
            expect(findBrand(cardbin+'').name).to.equal('diners');
            done();
        });
    });


    ['510000000000000','500000000000000','5100000000000000'].forEach(function(cardbin) {
        it('Should not identify aura for bin '+cardbin, function invaliAura(done) {
            try {
                expect(findBrand(cardbin+'').name).to.not.equal('aura');
            } catch(err) {
                expect(err.message).to.equal('card number not supported');
            }
            done();
        });
    });

    ['5000000000000000','5010000000000000','5020000000000000','5030000000000000','5040000000000000','5050000000000000','5060000000000000','5070000000000000','5080000000000000', '5078601912345600019','5078601800003247449', '5078601870000127985'].forEach(function(cardbin) {
        it('Should identify aura for bin '+cardbin, function validAura(done) {
            expect(findBrand(cardbin+'').name).to.equal('aura');
            done();
        });
    });

    ['310000000000000','300000000000000','3060000000000000','370000000000000','390000000000000'].forEach(function(cardbin) {
        it('Should not identify discover for bin '+cardbin, function invaliDiscover(done) {
            try {
                expect(findBrand(cardbin+'').name).to.not.equal('discover');
            } catch(err) {
                expect(err.message).to.equal('card number not supported');
            }
            done();
        });
    });

    ['6011236044609927','6011091915358231', '6011726125958524', '6511020000245045'].forEach(function(cardbin) {
        it('Should identify discover for bin '+cardbin, function validDiscover(done) {
            expect(findBrand(cardbin+'').name).to.equal('discover');
            done();
        });
    });


    ['500000000000000','56000000000000000'].forEach(function(cardbin) {
        it('Should not identify mastercard for bin '+cardbin, function invaliDinners(done) {
            try {
                expect(findBrand(cardbin+'').name).to.not.equal('mastercard');
            } catch(err) {
                expect(err.message).to.equal('card number not supported');
            }
            done();
        });
    });

    ['5533798818319497', '5437251265160938', '5101514275875158', '5313557320486111', '5216730016991151', '2221000000000000', '2720990000000000'].forEach(function(cardbin) {
        it('Should identify mastercard for bin '+cardbin, function validDinners(done) {
            expect(findBrand(cardbin+'').name).to.equal('mastercard');
            done();
        });
    });

    ['4012001037141112', '4551870000000183', '4073020000000002', '4012001038443335', '4024007190131', '4556523434899','4477509054445560','4146805709584576', '6367000000001022'].forEach(function(cardbin) {
        it('Should identify visa for bin '+cardbin, function validDinners(done) {
            expect(findBrand(cardbin+'').name).to.equal('visa');
            done();
        });
    });
});

describe('validateCvv tests', function() {
    it('Should validate CVV with brand name', function(done) {
        expect(validateCvv('123', 'visa')).to.be.true;
        expect(validateCvv('1234', 'amex')).to.be.true;
        expect(validateCvv('1234', 'visa')).to.be.false;
        done();
    });

    it('Should validate CVV with simplified brand object', function(done) {
        const brand = findBrand('4111111111111111');
        expect(validateCvv('123', brand)).to.be.true;
        expect(validateCvv('1234', brand)).to.be.false;
        done();
    });

    it('Should validate CVV with detailed brand object', function(done) {
        const brand = findBrand('4111111111111111', true);
        expect(validateCvv('123', brand)).to.be.true;
        expect(validateCvv('1234', brand)).to.be.false;
        done();
    });

    it('Should return false for invalid brand', function(done) {
        expect(validateCvv('123', 'invalidbrand')).to.be.false;
        expect(validateCvv('123', null)).to.be.false;
        expect(validateCvv(null, 'visa')).to.be.false;
        done();
    });
});

describe('isSupported tests', function() {
    it('Should return true for supported cards', function(done) {
        expect(isSupported('4111111111111111')).to.be.true;
        expect(isSupported('5533798818319497')).to.be.true;
        done();
    });

    it('Should return false for unsupported cards', function(done) {
        expect(isSupported('1234567890123456')).to.be.false;
        expect(isSupported(null)).to.be.false;
        expect(isSupported('')).to.be.false;
        done();
    });
});

describe('getBrandInfo tests', function() {
    it('Should return brand info by name', function(done) {
        const brand = getBrandInfo('visa');
        expect(brand).to.be.an('object');
        expect(brand.name).to.equal('visa');
        done();
    });

    it('Should return null for unknown brand', function(done) {
        expect(getBrandInfo('unknown')).to.be.null;
        done();
    });
});

describe('getBrandInfoDetailed tests', function() {
    it('Should return detailed brand info by scheme', function(done) {
        const brand = getBrandInfoDetailed('visa');
        expect(brand).to.be.an('object');
        expect(brand.scheme).to.equal('visa');
        expect(brand.patterns).to.be.an('array');
        done();
    });

    it('Should return null for unknown scheme', function(done) {
        expect(getBrandInfoDetailed('unknown')).to.be.null;
        done();
    });
});

describe('listBrands tests', function() {
    it('Should return array of brand names', function(done) {
        const brands = listBrands();
        expect(brands).to.be.an('array');
        expect(brands).to.include('visa');
        expect(brands).to.include('mastercard');
        done();
    });
});

describe('luhn tests', function() {
    const { luhn } = creditcardIdentifier;

    it('Should return true for valid Visa card number', function(done) {
        expect(luhn('4012001037141112')).to.be.true;
        done();
    });

    it('Should return true for valid Mastercard number', function(done) {
        expect(luhn('5533798818319497')).to.be.true;
        done();
    });

    it('Should return true for valid Amex number', function(done) {
        expect(luhn('378282246310005')).to.be.true;
        done();
    });

    it('Should return false for invalid number', function(done) {
        expect(luhn('1234567890123456')).to.be.false;
        done();
    });

    it('Should return false for empty string', function(done) {
        expect(luhn('')).to.be.false;
        done();
    });

    it('Should return false for string with non-digits', function(done) {
        expect(luhn('4012-0010-3714-1112')).to.be.false;
        done();
    });

    it('Should throw for non-string input', function(done) {
        expect(() => luhn(4012001037141112)).to.throw(TypeError);
        done();
    });
});
