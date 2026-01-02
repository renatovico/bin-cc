# BIN-CC Data Schema

This document describes the data schema for the bin-cc project.

## Overview

The bin-cc project uses a **source → build → compiled** approach similar to browserslist:
- **Source files** (`data/sources/*.json`) - Human-editable card scheme definitions
- **Build script** (`scripts/build.js`) - Compiles and validates source data
- **Compiled data** (`data/compiled/brands.json`) - Enhanced format with full details
- **Legacy data** (`data/brands.json`) - Backward-compatible simple format

## Source Data Format

Source files in `data/sources/` define card schemes with their BIN patterns.

### Source Schema

```json
{
  "scheme": "string",      // Scheme identifier (lowercase, e.g., "visa")
  "brand": "string",       // Display name (e.g., "Visa")
  "patterns": [            // Array of BIN patterns for this scheme
    {
      "bin": "regex",      // BIN matching pattern (first 4-8 digits)
      "length": [number],  // Valid card number lengths (array)
      "luhn": boolean,     // Whether Luhn algorithm applies
      "cvvLength": number, // CVV/CVC code length
      "comment": "string"  // Optional: explanation of the pattern
    }
  ],
  "type": "credit|debit",  // Card type
  "countries": ["string"], // ISO country codes or "GLOBAL"
  "bins": [                // Optional: Array of specific BIN values
    {
      "bin": "string"      // Specific 6-digit BIN
    }
  ]
}
```

### Example Source File

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
    { "bin": "491441" },
    { "bin": "491414" }
  ]
}
```

## Compiled Data Format

The build process generates `data/compiled/brands.json` with enhanced metadata.

### Compiled Schema

```json
{
  "scheme": "string",           // Scheme identifier
  "brand": "string",            // Display brand name
  "type": "credit|debit",       // Card type
  "number": {
    "lengths": [number],        // Valid card number lengths
    "luhn": boolean            // Luhn validation required
  },
  "cvv": {
    "length": number            // CVV code length
  },
  "patterns": {
    "bin": "regex",            // Combined BIN pattern
    "full": "regex"            // Full card number validation pattern
  },
  "countries": ["string"],      // Issuing countries
  "metadata": {
    "sourceFile": "string"      // Source file reference
  },
  "bins": [                     // Optional: Array of specific BIN values
    {
      "bin": "string"          // Specific 6-digit BIN
    }
  ]
}
```

### Future Enhancements

The schema is designed to accommodate additional fields:

```json
{
  "prepaid": boolean,           // Prepaid card indicator
  "country": {                  // Detailed country info
    "numeric": "string",
    "alpha2": "string",
    "name": "string",
    "emoji": "string",
    "currency": "string",
    "latitude": number,
    "longitude": number
  },
  "bank": {                     // Issuing bank details
    "name": "string",
    "url": "string",
    "phone": "string",
    "city": "string"
  }
}
```

## Legacy Format (Backward Compatible)

The build also generates `data/brands.json` for backward compatibility.

### Legacy Schema

```json
{
  "name": "string",        // Scheme name (e.g., "visa")
  "regexpBin": "regex",    // BIN pattern
  "regexpFull": "regex",   // Full validation pattern
  "regexpCvv": "regex"     // CVV validation pattern
}
```

## Building the Data

### Prerequisites

- Node.js 12+

### Build Command

```bash
node scripts/build.js
```

This will:
1. Read all source files from `data/sources/`
2. Compile patterns and generate regexes
3. Validate the compiled data
4. Write `data/compiled/brands.json` (enhanced format)
5. Write `data/brands.json` (legacy format)

### Validation

The build script automatically validates:
- Required fields are present
- Regex patterns are valid
- Data structure is correct

## Contributing

### Adding a New Card Scheme

1. Create a new file in `data/sources/` (e.g., `jcb.json`)
2. Follow the source schema format
3. Run `node scripts/build.js` to compile
4. Test the generated patterns
5. Submit a pull request

### Updating Existing Patterns

1. Edit the appropriate file in `data/sources/`
2. Add comments explaining the changes
3. Run `node scripts/build.js` to recompile
4. Verify tests still pass
5. Submit a pull request with source documentation

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
