# BIN-CC Data Schema

This document describes the data schema for the bin-cc project.

## Overview

The bin-cc project uses a **source → build → compiled** approach similar to browserslist:
- **Source files** (`data/sources/*.json` or `data/sources/*/`) - Human-editable card scheme definitions
- **Build script** (`scripts/build.js`) - Compiles, merges, and validates source data
- **Compiled outputs**:
  - `data/compiled/cards.json` - Simplified regex format
  - `data/compiled/cards-detailed.json` - Full detailed format with BINs

## Source Data Format

Source files in `data/sources/` define card schemes with their BIN patterns.

### Organization Options

**Option 1: Single File** (for simple brands)
```
data/sources/amex.json
data/sources/discover.json
```

**Option 2: Subfolder** (for brands with extensive data)
```
data/sources/visa/
├── base.json        # Required: scheme, brand, patterns
├── bins-br-1.json   # Optional: partial file with bins only
└── bins-br-2.json   # Optional: additional bins
```

When using subfolders:
- The subfolder name becomes the scheme identifier
- One file must contain `patterns` (the "base" file)
- Other files can be "partial" files containing only `bins`
- All JSON files in the subfolder are merged automatically
- Patterns are deduplicated by structure
- BINs are deduplicated by number (first occurrence wins)
- Countries are merged and deduplicated

### Full Source Schema

```json
{
  "scheme": "string",        // Scheme identifier (lowercase, e.g., "visa")
  "brand": "string",         // Display name (e.g., "Visa")
  "patterns": [              // Array of BIN patterns
    {
      "bin": "regex",        // BIN matching pattern (regex)
      "length": [number],    // Valid card number lengths
      "luhn": boolean,       // Whether Luhn algorithm applies
      "cvvLength": number    // CVV/CVC code length
    }
  ],
  "type": "credit|debit",    // Card type
  "countries": ["string"],   // ISO country codes or "GLOBAL"
  "unofficial": boolean,     // Optional: true if no official documentation exists
  "bins": [                  // Optional: Detailed BIN-level information
    {
      "bin": "string",       // Specific 6-digit BIN
      "type": "string",      // Card type (CREDIT, DEBIT)
      "category": "string",  // Card category (CLASSIC, GOLD, etc.) or null
      "issuer": "string",    // Issuing bank name
      "countries": ["string"] // Optional: BIN-specific countries
    }
  ]
}
```

### Partial Source Schema (Bins Only)

For subfolder organization, partial files can contain only `bins`:

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

### Custom Properties

Both source files and BIN entries support custom properties:

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
      "issuer": "BANCO",
      "customField": "custom value"
    }
  ]
}
```

Custom properties are preserved in the compiled output.

### Example: Full Source File

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
      "category": null,
      "issuer": "BANCO PROSPER, S.A.",
      "countries": ["BR"]
    }
  ]
}
```

## Compiled Output Formats

### Simplified Format (`cards.json`)

Regex patterns for validation:

```json
{
  "name": "string",       // Scheme name (e.g., "visa")
  "regexpBin": "regex",   // BIN pattern
  "regexpFull": "regex",  // Full card number validation pattern
  "regexpCvv": "regex"    // CVV validation pattern
}
```

Example:
```json
{
  "name": "visa",
  "regexpBin": "^4|^6367",
  "regexpFull": "^(4[0-9]{7,15}|6367[0-9]{10,15})$",
  "regexpCvv": "^\\d{3}$"
}
```

### Detailed Format (`cards-detailed.json`)

Full metadata with BIN information:

```json
{
  "scheme": "string",           // Scheme identifier
  "brand": "string",            // Display brand name
  "type": "credit|debit",       // Card type
  "number": {
    "lengths": [number],        // Valid card number lengths
    "luhn": boolean             // Luhn validation required
  },
  "cvv": {
    "length": number            // CVV code length
  },
  "patterns": [                 // Original pattern definitions
    {
      "bin": "regex",
      "length": [number],
      "luhn": boolean,
      "cvvLength": number
    }
  ],
  "countries": ["string"],      // Issuing countries
  "metadata": {
    "sourceFile": "string | array"  // Source file(s)
  },
  "bins": [                     // Optional: Detailed BIN information
    {
      "bin": "string",
      "type": "string",
      "category": "string",
      "issuer": "string",
      "countries": ["string"]
    }
  ]
}
```

**Note:** When multiple source files are merged, `metadata.sourceFile` is an array.

## Building the Data

### Prerequisites

- Node.js 12+

### Build Command

```bash
node scripts/build.js
```

This will:
1. Read all source files and subfolders from `data/sources/`
2. Merge multiple files per brand (if using subfolder organization)
3. Validate all source data
4. Compile patterns and generate regexes
5. Validate the compiled data
6. Write `data/compiled/cards.json` (simplified format)
7. Write `data/compiled/cards-detailed.json` (detailed format)

### Validation

```bash
# Validate all sources
node scripts/validate.js

# Validate specific file or directory
node scripts/validate.js data/sources/visa
node scripts/validate.js data/sources/amex.json
```

The validation script checks:
- Required fields are present
- Regex patterns are valid
- Data structure is correct
- Countries are valid ISO codes or "GLOBAL"

### Creating New Card Schemes

```bash
node scripts/create-card.js
```

Interactive CLI to create new card scheme source files.

## Contributing

### Adding a New Card Scheme

#### Option 1: Single File (Simple Brands)

1. Create a new file in `data/sources/` (e.g., `jcb.json`)
2. Follow the source schema format
3. Run `node scripts/build.js` to compile
4. Test the generated patterns
5. Submit a pull request

#### Option 2: Subfolder (Complex Brands)

1. Create a subfolder in `data/sources/` (e.g., `data/sources/jcb/`)
2. Create `base.json` with scheme, brand, patterns
3. Optionally add partial files with additional bins
4. Run `node scripts/build.js` to compile and merge
5. Test the generated patterns
6. Submit a pull request

### Example: Adding JCB

```json
{
  "scheme": "jcb",
  "brand": "JCB",
  "patterns": [
    {
      "bin": "^35",
      "length": [16],
      "luhn": true,
      "cvvLength": 3
    }
  ],
  "type": "credit",
  "countries": ["GLOBAL"]
}
```

Then run:
```bash
node scripts/build.js
```

## Data Sources

When contributing, please document your sources:
- Official documentation from card networks
- Published BIN ranges from issuing banks
- ISO/IEC 7812 standards
- Community-verified patterns

Include source URLs in pull request descriptions.

## License

This data schema and all data files are provided under the MIT license.
