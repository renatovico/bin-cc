# Credit Card BIN Data Schema

This directory contains the credit card BIN (Bank Identification Number) data files that serve as the source of truth for credit card brand identification.

## File Structure

### brands.json

Contains an array of credit card brand objects with their validation patterns.

**Schema:**

```json
[
  {
    "name": "string",        // Brand name (e.g., "visa", "mastercard", "amex")
    "regexpBin": "string",   // Regular expression to identify the brand from the first digits (BIN)
    "regexpFull": "string",  // Regular expression to validate the full card number
    "regexpCvv": "string"    // Regular expression to validate the CVV/CVC code
  }
]
```

**Example:**

```json
{
  "name": "visa",
  "regexpBin": "^4|^6367",
  "regexpFull": "^4[0-9]{12}(?:[0-9]{3})?|6367[0-9]{12}$",
  "regexpCvv": "^\\d{3}$"
}
```

## Supported Brands

The following credit card brands are currently supported:

- **Elo** - Brazilian credit card brand
- **Diners** - Diners Club International
- **Discover** - Discover Financial Services
- **Hipercard** - Brazilian credit card brand
- **Amex** (American Express)
- **Aura** - Brazilian credit card brand
- **Mastercard** - Mastercard Worldwide
- **Visa** - Visa Inc.

## Data Usage

### For Library Developers

If you're building a library that needs credit card validation data:

```javascript
// Method 1: Import the module
const ccData = require('creditcard-identifier');
const brands = ccData.data.brands;

// Method 2: Load JSON directly
const fs = require('fs');
const path = require('path');
const dataPath = require.resolve('creditcard-identifier/data/brands.json');
const brands = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
```

### For Application Developers

If you're building an application and need to validate credit cards:

```javascript
const creditcard = require('creditcard-identifier');

// Use the provided functions
const brand = creditcard.findBrand('4012001037141112');
const isSupported = creditcard.isSupported('4012001037141112');
```

## Contributing

When contributing new brand data or updating existing patterns:

1. Update the `data/brands.json` file
2. Ensure the data follows the schema above
3. Add test cases in `test/creditcard-identifier.test.js`
4. Document the source of the information in your pull request
5. Run `npm run test-unit` to verify all tests pass

## Data Sources

The data in this project has been collected from:

- Real credit card samples (anonymized BIN patterns only)
- Official brand documentation (where available)
- Community contributions

**Note:** Some brands (Elo, Hipercard, Aura) may not have official public documentation. The patterns for these brands have been collected from real-world usage and community input.

## License

This data is provided under the MIT license. See the main LICENSE file for details.
