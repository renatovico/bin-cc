# Usage Examples with Detailed BIN Data

This document shows how to use the enhanced BIN-level data in your applications.

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
  const bin = visa.bins.find(b => b.bin === '491414');
  
  if (bin) {
    console.log(`BIN: ${bin.bin}`);
    console.log(`Type: ${bin.type}`);              // CREDIT or DEBIT
    console.log(`Category: ${bin.category}`);       // GOLD, PLATINUM, etc.
    console.log(`Issuer: ${bin.issuer}`);          // Bank name
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
        print(f"BIN {bin_data['bin']}: {bin_data['issuer']}")
        if bin_data['category']:
            print(f"  Category: {bin_data['category']}")
```

## Card Category Lookup

```javascript
function getCardCategory(cardNumber) {
  const bin = cardNumber.substring(0, 6);
  const data = require('creditcard-identifier/data/compiled/brands.json');
  
  for (const brand of data) {
    if (brand.bins) {
      const binData = brand.bins.find(b => b.bin === bin);
      if (binData) {
        return {
          scheme: brand.scheme,
          brand: brand.brand,
          issuer: binData.issuer,
          category: binData.category,
          type: binData.type
        };
      }
    }
  }
  
  return null;
}

// Usage
const info = getCardCategory('4914140000000000');
if (info) {
  console.log(`Scheme: ${info.scheme}`);           // visa
  console.log(`Issuer: ${info.issuer}`);           // BANCO DO ESTADO DO PARANA
  console.log(`Category: ${info.category}`);       // GOLD
  console.log(`Type: ${info.type}`);               // CREDIT
}
```

## Issuer Bank Lookup

```javascript
function getIssuerBank(cardNumber) {
  const bin = cardNumber.substring(0, 6);
  const data = require('creditcard-identifier/data/compiled/brands.json');
  
  for (const brand of data) {
    if (brand.bins) {
      const binData = brand.bins.find(b => b.bin === bin);
      if (binData && binData.issuer) {
        return {
          issuer: binData.issuer,
          brand: brand.brand
        };
      }
    }
  }
  
  return null;
}

// Usage
const bank = getIssuerBank('4914410000000000');
console.log(bank.issuer);  // "BANCO PROSPER, S.A."
```

## Listing All Issuers by Scheme

```javascript
const data = require('creditcard-identifier/data/compiled/brands.json');

// Get all Visa issuers
const visa = data.find(b => b.scheme === 'visa');

if (visa && visa.bins) {
  const issuers = [...new Set(visa.bins.map(b => b.issuer))];
  console.log('Visa Issuers:');
  issuers.forEach(issuer => console.log(`  - ${issuer}`));
}
```

## Category Statistics

```javascript
const data = require('creditcard-identifier/data/compiled/brands.json');

function getCategoryStats(scheme) {
  const brand = data.find(b => b.scheme === scheme);
  
  if (!brand || !brand.bins) {
    return null;
  }
  
  const stats = {};
  brand.bins.forEach(bin => {
    const category = bin.category || 'Standard';
    stats[category] = (stats[category] || 0) + 1;
  });
  
  return stats;
}

// Usage
const visaStats = getCategoryStats('visa');
console.log('Visa Card Categories:');
console.log(visaStats);
// Output: { GOLD: 3, CLASSIC: 4, PLATINUM: 1, Standard: 7 }
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
          bin: bin,
          scheme: brand.scheme,
          brand: brand.brand,
          type: binData.type,
          category: binData.category,
          issuer: binData.issuer
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
  type: string;
  category: string | null;
  issuer: string | null;
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
- BIN data is primarily for Brazilian cards currently
- `category` can be `null` for standard cards
- `issuer` contains the bank name as provided in the source data
