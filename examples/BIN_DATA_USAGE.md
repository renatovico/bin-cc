# Usage Examples with Detailed BIN Data

This document shows how to use the BIN-level data in your applications.

## Accessing BIN Details

### JavaScript Example

```javascript
const data = require('creditcard-identifier/data/compiled/brands.json');

// Find a specific scheme
const visa = data.find(brand => brand.scheme === 'visa');

// Check if BIN-level details are available
if (visa.bins) {
  console.log(`${visa.brand} has ${visa.bins.length} detailed BINs`);
  
  // Find a specific BIN
  const binEntry = visa.bins.find(b => b.bin === '491414');
  
  if (binEntry) {
    console.log(`BIN: ${binEntry.bin}`);
  }
}
```

### Python Example

```python
import json

# Load compiled data
with open('data/compiled/brands.json', 'r') as f:
    brands = json.load(f)

# Find scheme
visa = next((b for b in brands if b['scheme'] == 'visa'), None)

# Access BIN details
if visa and 'bins' in visa:
    for bin_data in visa['bins']:
        print(f"BIN {bin_data['bin']}")
```
```

## BIN Lookup

```javascript
function checkBin(cardNumber) {
  const bin = cardNumber.substring(0, 6);
  const data = require('creditcard-identifier/data/compiled/brands.json');
  
  for (const brand of data) {
    if (brand.bins) {
      const binData = brand.bins.find(b => b.bin === bin);
      if (binData) {
        return {
          scheme: brand.scheme,
          brand: brand.brand,
          bin: binData.bin
        };
      }
    }
  }
  
  return null;
}

// Usage
const info = checkBin('4914140000000000');
if (info) {
  console.log(`Scheme: ${info.scheme}`);           // visa
  console.log(`Brand: ${info.brand}`);             // Visa
  console.log(`BIN: ${info.bin}`);                 // 491414
}
```

## Listing All BINs by Scheme

```javascript
const data = require('creditcard-identifier/data/compiled/brands.json');

// Get all Visa BINs
const visa = data.find(b => b.scheme === 'visa');

if (visa && visa.bins) {
  console.log(`Visa has ${visa.bins.length} BINs`);
  visa.bins.forEach(binData => console.log(`  - ${binData.bin}`));
}
```

## REST API Example

```javascript
const express = require('express');
const data = require('creditcard-identifier/data/compiled/brands.json');

const app = express();

app.get('/api/bin/:bin', (req, res) => {
  const bin = req.params.bin;
  
  for (const brand of data) {
    if (brand.bins) {
      const binData = brand.bins.find(b => b.bin === bin);
      if (binData) {
        return res.json({
          bin: binData.bin,
          scheme: brand.scheme,
          brand: brand.brand
        });
      }
    }
  }
  
  res.status(404).json({ error: 'BIN not found' });
});

app.listen(3000, () => {
  console.log('BIN API running on port 3000');
});
```

## TypeScript Types

```typescript
interface BinData {
  bin: string;
}

interface Brand {
  scheme: string;
  brand: string;
  type: string;
  number: {
    lengths: number[];
    luhn: boolean;
  };
  cvv: {
    length: number;
  };
  patterns: {
    bin: string;
    full: string;
  };
  countries: string[];
  metadata: {
    sourceFile: string;
  };
  bins?: BinData[];
}

// Usage
import data from 'creditcard-identifier/data/compiled/brands.json';
const brands: Brand[] = data;
```

## Notes

- BIN-level details are **optional** - not all schemes have them
- Always check if `brand.bins` exists before accessing
- Each bin entry contains only the `bin` field with the 6-digit BIN number
