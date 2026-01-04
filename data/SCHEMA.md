# BIN-CC Data Schema

This document describes the data schema for the bin-cc project.

## Overview

The bin-cc project uses a **source → build → compiled** approach similar to browserslist:
- **Source files** (`data/sources/*.json` or `data/sources/*/`) - Human-editable card scheme definitions
  - Single files for simple brands (e.g., `amex.json`)
  - Subfolders for complex brands with regional data (e.g., `visa/base.json`, `visa/br.json`)
- **Build script** (`scripts/build.js`) - Compiles, merges, and validates source data
- **Compiled data** (`data/compiled/brands.json`) - Enhanced format with full details
- **Legacy data** (`data/brands.json`) - Backward-compatible simple format

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
data/sources/visa/base.json
data/sources/visa/detailed.json
data/sources/visa/br.json
```

When using subfolders:
- The subfolder name becomes the scheme identifier
- All JSON files in the subfolder are merged automatically
- Patterns are deduplicated by structure
- BINs are deduplicated by number (first occurrence wins)
- Countries are merged and deduplicated

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
  "bins": [                // Optional: Detailed BIN-level information
    {
      "bin": "string",     // Specific 6-digit BIN
      "type": "string",    // Card type (CREDIT, DEBIT)
      "category": "string",// Card category (CLASSIC, GOLD, PLATINUM, etc.) or null
      "issuer": "string"   // Issuing bank name
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
    {
      "bin": "491441",
      "type": "CREDIT",
      "category": null,
      "issuer": "BANCO PROSPER, S.A."
    },
    {
      "bin": "491414",
      "type": "CREDIT",
      "category": "GOLD",
      "issuer": "BANCO DO ESTADO DO PARANA"
    }
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
    "sourceFile": "string | array" // Source file reference (single file name or array of file names when merged)
  },
  "bins": [                     // Optional: Detailed BIN information
    {
      "bin": "string",         // Specific 6-digit BIN
      "type": "string",        // Card type (CREDIT, DEBIT)
      "category": "string",    // Card category (CLASSIC, GOLD, PLATINUM) or null
      "issuer": "string"       // Issuing bank name or null
    }
  ]
}
```

**Note:** When multiple source files are merged (subfolder organization), `metadata.sourceFile` will be an array listing all source files (e.g., `["visa/base.json", "visa/detailed.json"]`).

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
1. Read all source files and subfolders from `data/sources/`
2. Merge multiple files per brand (if using subfolder organization)
3. Compile patterns and generate regexes
4. Validate the compiled data
5. Write `data/compiled/brands.json` (enhanced format)
6. Write `data/brands.json` (legacy format)

### Validation

The build script automatically validates:
- Required fields are present
- Regex patterns are valid
- Data structure is correct

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
2. Create one or more JSON files following the source schema
3. Run `node scripts/build.js` to compile and merge
4. Test the generated patterns
5. Submit a pull request

### Updating Existing Patterns

#### Single File Brands

1. Edit the appropriate file in `data/sources/`
2. Add comments explaining the changes
3. Run `node scripts/build.js` to recompile
4. Verify tests still pass
5. Submit a pull request with source documentation

#### Subfolder-Organized Brands

1. Edit the appropriate file in the brand's subfolder (e.g., `data/sources/visa/base.json`)
2. Or add new regional files (e.g., `data/sources/visa/es.json`)
3. Run `node scripts/build.js` to recompile and merge
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
