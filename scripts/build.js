#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Build script for bin-cc data
 * 
 * Reads source files from data/sources/ and compiles them into:
 * 1. data/compiled/brands.json - Enhanced format with all details
 * 2. data/brands.json - Legacy format for backward compatibility
 */

const SOURCES_DIR = path.join(__dirname, '../data/sources');
const COMPILED_DIR = path.join(__dirname, '../data/compiled');
const LEGACY_FILE = path.join(__dirname, '../data/brands.json');

// Ensure compiled directory exists
if (!fs.existsSync(COMPILED_DIR)) {
  fs.mkdirSync(COMPILED_DIR, { recursive: true });
}

/**
 * Build regex patterns from source patterns
 * 
 * This builds comprehensive patterns for card validation.
 * The BIN pattern matches the first digits, and full pattern validates entire card numbers.
 */
function buildPatterns(patterns) {
  // Combine all BIN patterns
  const binPatterns = patterns.map(p => p.bin).join('|');
  
  // For full pattern, we need to match exact card lengths
  // Strategy: For each pattern, match its BIN + exact remaining digits for each valid length
  const fullPatterns = [];
  
  for (const pattern of patterns) {
    const lengths = Array.isArray(pattern.length) ? pattern.length : [pattern.length];
    
    for (const len of lengths) {
      // For the full pattern, we match: BIN pattern + rest of digits to reach total length
      // Note: The BIN pattern itself may match variable digits (e.g., ^4 matches 1 digit, ^6367 matches 4)
      // So we use a simplified approach: the pattern already includes anchors
      const binPart = pattern.bin;
      
      // Rough heuristic: most BIN patterns match 4-6 digits
      // For simplicity, let's match (pattern) followed by remaining digits
      // This won't be perfect for all cases but handles common scenarios
      
      if (len === 13) {
        fullPatterns.push(`${binPart}[0-9]{9,12}`);
      } else if (len === 14) {
        fullPatterns.push(`${binPart}[0-9]{10,13}`);
      } else if (len === 15) {
        fullPatterns.push(`${binPart}[0-9]{11,14}`);
      } else if (len === 16) {
        fullPatterns.push(`${binPart}[0-9]{12,15}`);
      } else if (len === 19) {
        fullPatterns.push(`${binPart}[0-9]{15,18}`);
      }
    }
  }
  
  // Deduplicate patterns
  const uniqueFullPatterns = [...new Set(fullPatterns)];
  
  return {
    binPattern: binPatterns,
    fullPattern: `(${uniqueFullPatterns.join('|')})`,
    lengths: [...new Set(patterns.flatMap(p => Array.isArray(p.length) ? p.length : [p.length]))],
    cvvLength: patterns[0].cvvLength
  };
}

/**
 * Read all source files and compile
 */
function buildData() {
  console.log('🔨 Building bin-cc data...\n');
  
  const sourceFiles = fs.readdirSync(SOURCES_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();
  
  const compiledBrands = [];
  const legacyBrands = [];
  
  for (const file of sourceFiles) {
    const sourcePath = path.join(SOURCES_DIR, file);
    const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    console.log(`  ✓ Processing ${source.brand} (${source.scheme})`);
    
    const patterns = buildPatterns(source.patterns);
    
    // Enhanced format
    const compiledBrand = {
      scheme: source.scheme,
      brand: source.brand,
      type: source.type || 'credit',
      number: {
        lengths: patterns.lengths,
        luhn: source.patterns[0].luhn
      },
      cvv: {
        length: patterns.cvvLength
      },
      patterns: {
        bin: patterns.binPattern,
        full: patterns.fullPattern
      },
      countries: source.countries || [],
      metadata: {
        sourceFile: file
      }
    };
    
    compiledBrands.push(compiledBrand);
    
    // Legacy format (backward compatible)
    const legacyBrand = {
      name: source.scheme,
      regexpBin: patterns.binPattern,
      regexpFull: patterns.fullPattern,
      regexpCvv: `^\\d{${patterns.cvvLength}}$`
    };
    
    legacyBrands.push(legacyBrand);
  }
  
  // Write compiled format
  const compiledPath = path.join(COMPILED_DIR, 'brands.json');
  fs.writeFileSync(compiledPath, JSON.stringify(compiledBrands, null, 2));
  console.log(`\n✅ Compiled data written to: ${path.relative(process.cwd(), compiledPath)}`);
  
  // Note: Legacy data/brands.json is maintained manually for backward compatibility
  // The source files provide a structured, extensible format for future enhancements
  console.log(`ℹ️  Legacy data/brands.json maintained separately for backward compatibility`);
  
  // Generate statistics
  console.log(`\n📊 Statistics:`);
  console.log(`   Total brands: ${compiledBrands.length}`);
  console.log(`   Global brands: ${compiledBrands.filter(b => b.countries.includes('GLOBAL')).length}`);
  console.log(`   Brazilian brands: ${compiledBrands.filter(b => b.countries.includes('BR')).length}`);
  
  return { compiledBrands, legacyBrands };
}

/**
 * Validate the built data
 */
function validate(data) {
  console.log('\n🔍 Validating data...\n');
  
  let errors = 0;
  
  for (const brand of data.compiledBrands) {
    // Check required fields
    const required = ['scheme', 'brand', 'type', 'number', 'cvv', 'patterns'];
    for (const field of required) {
      if (!brand[field]) {
        console.error(`  ✗ ${brand.scheme}: Missing required field '${field}'`);
        errors++;
      }
    }
    
    // Validate patterns are valid regex
    try {
      new RegExp(brand.patterns.bin);
      new RegExp(brand.patterns.full);
    } catch (e) {
      console.error(`  ✗ ${brand.scheme}: Invalid regex pattern - ${e.message}`);
      errors++;
    }
  }
  
  if (errors === 0) {
    console.log('  ✓ All validations passed!');
  } else {
    console.error(`\n❌ ${errors} validation error(s) found`);
    process.exit(1);
  }
}

// Run build
if (require.main === module) {
  try {
    const data = buildData();
    validate(data);
    console.log('\n✨ Build completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { buildData, validate };
