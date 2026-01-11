# Credit Card Identifier - JavaScript Implementation

JavaScript/Node.js implementation for credit card BIN validation and identification.

## Supported Card Brands

- American Express (amex)
- Aura
- BaneseCard
- Diners Club
- Discover
- Elo
- Hipercard
- JCB
- Maestro
- Mastercard
- UnionPay
- Visa

## Installation

```bash
npm install creditcard-identifier
```

## Usage

### Basic Validation

```javascript
const creditcard = require('creditcard-identifier');

// Identify card brand
const brand = creditcard.findBrand('4012001037141112');
console.log(brand);
// { name: 'visa', regexpBin: '...', regexpFull: '...', regexpCvv: '...' }

// Check if card is supported
const supported = creditcard.isSupported('4012001037141112');
console.log(supported); // true

// Validate CVV
const validCvv = creditcard.validateCvv('123', 'visa');
console.log(validCvv); // true
```

### Detailed Brand Information

```javascript
const creditcard = require('creditcard-identifier');

// Get detailed brand info with matched pattern
const detailed = creditcard.findBrand('4012001037141112', true);
console.log(detailed);
// {
//   scheme: 'visa',
//   brand: 'Visa',
//   type: 'credit',
//   cvv: { name: 'CVV', length: 3 },
//   patterns: [...],
//   matchedPattern: { bin: '^4', length: [13, 16, 19], luhn: true, cvvLength: 3 },
//   matchedBin: null
// }

// Get brand info by name
const brandInfo = creditcard.getBrandInfo('mastercard');
console.log(brandInfo);

// Get detailed brand info by scheme
const detailedInfo = creditcard.getBrandInfoDetailed('amex');
console.log(detailedInfo);

// List all supported brands
const allBrands = creditcard.listBrands();
console.log(allBrands);
// ['amex', 'aura', 'banesecard', 'diners', 'discover', 'elo', 'hipercard', 'jcb', 'maestro', 'mastercard', 'unionpay', 'visa']
```

### Using Raw Data

```javascript
const creditcard = require('creditcard-identifier');

// Access brand data directly
const brands = creditcard.brands;
console.log(brands); 
// [
//   { name: 'amex', regexpBin: '...', regexpFull: '...', regexpCvv: '...' },
//   { name: 'visa', regexpBin: '...', regexpFull: '...', regexpCvv: '...' },
//   ...
// ]

// Access detailed brand data
const brandsDetailed = creditcard.brandsDetailed;
```

### OOP-Style Usage

```javascript
const { Validator } = require('creditcard-identifier');

const validator = new Validator();

const brand = validator.findBrand('5533798818319497');
console.log(brand); // { name: 'mastercard', ... }

const isValid = validator.isSupported('5533798818319497');
console.log(isValid); // true
```

## API

### `findBrand(cardNumber, detailed?)`
Returns the brand object for the given card number.

**Parameters:**
- `cardNumber` (string): The credit card number
- `detailed` (boolean, optional): If true, returns detailed brand info with matched pattern

**Returns:** (object) Brand object with name, regexpBin, regexpFull, regexpCvv (or detailed info if detailed=true)

**Throws:** Error if card number is not supported

### `isSupported(cardNumber)`
Checks if the card number is supported.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (boolean) true if supported, false otherwise

### `validateCvv(cvv, brandOrName)`
Validates the CVV for a given brand.

**Parameters:**
- `cvv` (string): The CVV code
- `brandOrName` (string|object): Brand name or brand object from findBrand

**Returns:** (boolean) true if CVV is valid for the brand

### `getBrandInfo(brandName)`
Returns brand info by name.

**Parameters:**
- `brandName` (string): The brand name (e.g., 'visa')

**Returns:** (object|null) Brand info or null if not found

### `getBrandInfoDetailed(scheme)`
Returns detailed brand info by scheme name.

**Parameters:**
- `scheme` (string): The scheme name (e.g., 'visa', 'mastercard')

**Returns:** (object|null) Detailed brand info or null if not found

### `listBrands()`
Returns an array of all supported brand names.

**Returns:** (string[]) Array of brand names

### `brands`
Direct access to the simplified brand data array.

### `brandsDetailed`
Direct access to the detailed brand data array.

### `Validator`
Class for OOP-style usage with all the above methods.

## Development

### Run Tests

```bash
npm test
```

### Run Coverage

```bash
npm run coverage
```

## Data Source

BIN data is maintained in the [bin-cc repository](https://github.com/renatovico/bin-cc) and embedded directly in the package.

## License

MIT
