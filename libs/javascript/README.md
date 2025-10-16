# Credit Card Identifier - JavaScript Implementation

JavaScript/Node.js implementation for credit card BIN validation using the [bin-cc data](../../data/).

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
console.log(brand); // 'visa'

// Check if card is supported
const supported = creditcard.isSupported('4012001037141112');
console.log(supported); // true

// Get Hipercard regex
const hipercardRegex = creditcard.hipercardRegexp();
```

### Using Raw Data

```javascript
const creditcard = require('creditcard-identifier');

// Access brand data directly
const brands = creditcard.data.brands;
console.log(brands); 
// [
//   { name: 'elo', regexpBin: '...', regexpFull: '...', regexpCvv: '...' },
//   { name: 'diners', regexpBin: '...', regexpFull: '...', regexpCvv: '...' },
//   ...
// ]

// Use data in custom logic
brands.forEach(brand => {
    console.log(`${brand.name}: ${brand.regexpBin}`);
});
```

### Direct JSON Access

```javascript
const fs = require('fs');
const path = require('path');

// Load JSON directly
const dataPath = require.resolve('creditcard-identifier/data/brands.json');
const brands = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
```

## API

### `findBrand(cardNumber)`
Returns the brand name for the given card number.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (string) Brand name (e.g., 'visa', 'mastercard')

**Throws:** Error if card number is not supported

### `isSupported(cardNumber)`
Checks if the card number is supported.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (boolean) true if supported, false otherwise

### `hipercardRegexp()`
Returns the regular expression for Hipercard validation.

**Returns:** (RegExp) Hipercard validation pattern

### `brands`
Direct access to the brand data array.

### `data.brands`
Alternative access to the brand data array.

## Development

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm run test-unit
```

### Run Coverage

```bash
npm run coverage
```

## Data Source

This implementation loads data from [`../../data/brands.json`](../../data/brands.json), which is the authoritative source for all credit card BIN patterns.

## License

MIT
