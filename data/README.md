# Credit Card BIN Data

This directory contains credit card BIN (Bank Identification Number) data with a build system similar to browserslist.

## Directory Structure

```
data/
├── sources/              # Source data files (human-editable)
│   ├── visa/            # Subfolder organization (for complex brands)
│   │   ├── base.json    # Base patterns and brand info
│   │   ├── bins-br-1.json  # Partial BIN files (bins only)
│   │   └── bins-br-2.json
│   ├── amex.json        # Single file (for simple brands)
│   ├── aura.json
│   └── ...
├── compiled/             # Generated output formats
│   ├── cards.json       # Simplified regex format
│   └── cards-detailed.json  # Full detailed format with BINs
├── SCHEMA.md            # Complete schema documentation
└── README.md            # This file
```

## Organization Options

**Single File** - For brands with simple patterns:
- `data/sources/amex.json`
- `data/sources/discover.json`

**Subfolder** - For brands with extensive BIN data or regional variations:
- `data/sources/visa/base.json` - Base patterns (required: scheme, brand, patterns)
- `data/sources/visa/bins-br-1.json` - Partial file with bins only
- `data/sources/visa/bins-br-2.json` - Additional bins

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
  "countries": ["GLOBAL"],
  "bins": [
    {
      "bin": "491441",
      "type": "CREDIT",
      "category": "GOLD",
      "issuer": "BANCO PROSPER, S.A.",
      "countries": ["BR"]
    }
  ]
}
```

### Partial Source Files (Bins Only)

For subfolders, you can create partial files that only contain `bins`:

```json
{
  "bins": [
    {
      "bin": "491441",
      "type": "CREDIT",
      "category": null,
      "issuer": "BANCO PROSPER, S.A.",
      "countries": ["BR"]
    }
  ]
}
```

These inherit scheme, brand, and patterns from the base file in the same folder.

### Simplified Format (`compiled/cards.json`)

Regex patterns for validation:

```json
{
  "name": "visa",
  "regexpBin": "^4|^6367",
  "regexpFull": "^(4[0-9]{7,15}|6367[0-9]{10,15})$",
  "regexpCvv": "^\\d{3}$"
}
```

### Detailed Format (`compiled/cards-detailed.json`)

Full metadata with BIN information:

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
  "patterns": [
    {
      "bin": "^4",
      "length": [13, 16],
      "luhn": true,
      "cvvLength": 3
    }
  ],
  "countries": ["GLOBAL"],
  "metadata": {
    "sourceFile": ["visa/base.json", "visa/bins-br-1.json", "visa/bins-br-2.json"]
  },
  "bins": [
    {
      "bin": "491441",
      "type": "CREDIT",
      "category": null,
      "issuer": "BANCO PROSPER, S.A.",
      "countries": ["BR"]
    }
  ]
}
```

**Note:** When multiple source files are merged from a subfolder, `metadata.sourceFile` is an array listing all source files.

## Custom Properties

Both source files and BIN entries support custom properties that are preserved in the output:

```json
{
  "scheme": "visa",
  "brand": "Visa",
  "website": "https://visa.com",
  "patterns": [...],
  "bins": [
    {
      "bin": "491441",
      "type": "CREDIT",
      "issuer": "BANCO PROSPER",
      "countries": ["BR"],
      "customField": "custom value"
    }
  ]
}
```

## Supported Brands

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

```javascript
// Load simplified format (regex only)
const cards = require('./data/compiled/cards.json');

// Load detailed format (with BINs)
const detailed = require('./data/compiled/cards-detailed.json');
```

### For Application Developers

```javascript
const creditcard = require('creditcard-identifier');

const brand = creditcard.findBrand('4012001037141112');
const isSupported = creditcard.isSupported('4012001037141112');
```

## Contributing

### Single File Brands

1. Update or create the JSON file in `data/sources/`
2. Ensure the data follows the schema (see `SCHEMA.md`)
3. Run `node scripts/build.js` to compile
4. Document the source of the information in your pull request

### Subfolder-Organized Brands

1. Create or edit files in `data/sources/<brand>/`
2. Use `base.json` for patterns and brand info
3. Use partial files (`bins-*.json`) for additional BINs
4. Run `node scripts/build.js` to compile and merge
5. Document the source of the information in your pull request

See `CONTRIBUTING.md` and `SCHEMA.md` for detailed guidelines.

## Data Sources

The data in this project has been collected from:

- Real credit card samples (anonymized BIN patterns only)
- Official brand documentation (where available)
- Community contributions

**Note:** Some brands (Elo, Hipercard, Aura) may not have official public documentation. The patterns for these brands have been collected from real-world usage and community input.

## License

This data is provided under the MIT license. See the main LICENSE file for details.
