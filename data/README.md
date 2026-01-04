# Credit Card BIN Data

This directory contains credit card BIN (Bank Identification Number) data with a build system similar to browserslist.

## Directory Structure

```
data/
├── sources/              # Source data files (human-editable)
│   ├── visa/            # Subfolder organization (for complex brands)
│   │   ├── base.json
│   │   └── detailed.json
│   ├── mastercard/
│   │   └── base.json
│   ├── amex.json        # Single file (for simple brands)
│   ├── aura.json
│   └── ...
├── compiled/             # Generated enhanced format
│   └── brands.json
├── brands.json          # Legacy format (backward compatible)
├── SCHEMA.md            # Complete schema documentation
└── README.md            # This file
```

### Organization Options

**Single File** - For brands with simple patterns:
- `data/sources/amex.json`
- `data/sources/discover.json`

**Subfolder** - For brands with extensive BIN data or regional variations:
- `data/sources/visa/base.json` - Base patterns
- `data/sources/visa/detailed.json` - Detailed BIN database
- `data/sources/visa/br.json` - Brazil-specific data (optional)

The build script automatically merges all files within a subfolder into a single brand entry.

## File Formats

### Source Files (`sources/*.json`)

Human-editable card scheme definitions:

```json
{
  "scheme": "visa",
  "brand": "Visa",
  "patterns": [
    {
      "bin": "^4",
      "length": [13, 16],
      "luhn": true,
      "cvvLength": 3
    }
  ],
  "type": "credit",
  "countries": ["GLOBAL"]
}
```

### Compiled Format (`compiled/brands.json`)

Enhanced format with full metadata:

```json
{
  "scheme": "visa",
  "brand": "Visa",
  "type": "credit",
  "number": {
    "lengths": [13, 16],
    "luhn": true
  },
  "cvv": {
    "length": 3
  },
  "patterns": {
    "bin": "^4|^6367",
    "full": "(^4[0-9]{9,12}|^4[0-9]{12,15}|^6367[0-9]{12,15})"
  },
  "countries": ["GLOBAL"],
  "metadata": {
    "sourceFile": ["visa/base.json", "visa/detailed.json"]
  }
}
```

**Note:** When multiple source files are merged from a subfolder, `metadata.sourceFile` changes from a string (single file) to an array (merged files).

### Legacy Format (`brands.json`)

Backward-compatible simple format:

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

### Single File Brands

1. Update or create the JSON file in `data/sources/`
2. Ensure the data follows the schema (see `SCHEMA.md`)
3. Run `node scripts/build.js` to compile
4. Add test cases in the JavaScript library if needed
5. Document the source of the information in your pull request
6. Run `npm test` to verify all tests pass

### Subfolder-Organized Brands

1. Create or edit files in `data/sources/<brand>/`
2. Multiple files are automatically merged during build
3. Run `node scripts/build.js` to compile and merge
4. Add test cases if needed
5. Document the source of the information in your pull request
6. Run `npm test` to verify all tests pass

See `CONTRIBUTING.md` and `SCHEMA.md` for detailed guidelines.

## Data Sources

The data in this project has been collected from:

- Real credit card samples (anonymized BIN patterns only)
- Official brand documentation (where available)
- Community contributions

**Note:** Some brands (Elo, Hipercard, Aura) may not have official public documentation. The patterns for these brands have been collected from real-world usage and community input.

## License

This data is provided under the MIT license. See the main LICENSE file for details.
