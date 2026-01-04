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
 * Merge multiple source objects into one unified brand entry
 * 
 * @param {Array} sources - Array of source objects to merge
 * @param {string} schemeName - The scheme name to use (from subfolder or first file)
 * @returns {Object} Merged source object
 */
function mergeSources(sources, schemeName) {
  if (sources.length === 1) {
    return sources[0];
  }
  
  // Start with the first source as base
  const merged = { ...sources[0] };
  merged.scheme = schemeName;
  
  // Collect all patterns
  const allPatterns = [];
  const patternSet = new Set();
  
  for (const source of sources) {
    for (const pattern of source.patterns) {
      const key = JSON.stringify(pattern);
      if (!patternSet.has(key)) {
        patternSet.add(key);
        allPatterns.push(pattern);
      }
    }
  }
  
  merged.patterns = allPatterns;
  
  // Collect all bins
  const allBins = [];
  const binSet = new Set();
  
  for (const source of sources) {
    if (source.bins && Array.isArray(source.bins)) {
      for (const binData of source.bins) {
        // Note: If the same BIN appears in multiple files with different metadata,
        // only the first occurrence will be kept. This is intentional to avoid
        // conflicts when the same BIN has different categorizations.
        if (!binSet.has(binData.bin)) {
          binSet.add(binData.bin);
          allBins.push(binData);
        }
      }
    }
  }
  
  if (allBins.length > 0) {
    merged.bins = allBins;
  }
  
  // Merge countries
  const allCountries = new Set();
  for (const source of sources) {
    if (source.countries && Array.isArray(source.countries)) {
      source.countries.forEach(c => allCountries.add(c));
    }
  }
  merged.countries = Array.from(allCountries);
  
  return merged;
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
  // Strategy: For each pattern, match its BIN + remaining digits for each valid length
  const fullPatterns = [];
  
  for (const pattern of patterns) {
    const lengths = Array.isArray(pattern.length) ? pattern.length : [pattern.length];
    
    for (const len of lengths) {
      // For the full pattern, we match: BIN pattern + rest of digits to reach total length
      // Note: The BIN pattern itself may match variable digits (e.g., ^4 matches 1 digit, ^6367 matches 4)
      // We use heuristics for the common cases to create reasonably tight patterns
      const binPart = pattern.bin;
      
      // Most BIN patterns match between 1-6 digits depending on the scheme
      // For each card length, we calculate a range that handles most cases
      
      if (len === 13) {
        // 13-digit cards (e.g., Visa): BIN could be ^4 (1 digit) or ^6367 (4 digits)
        fullPatterns.push(`${binPart}[0-9]{9,12}`);  // BIN 1-4 digits, need 9-12 more
      } else if (len === 14) {
        // 14-digit cards (Diners): BIN is ^3(?:0[0-5]|[68][0-9]) which matches exactly 3 digits
        fullPatterns.push(`${binPart}[0-9]{11}`);    // BIN 3 digits, need exactly 11 more
      } else if (len === 15) {
        // 15-digit cards (Amex): BIN is ^3[47] which matches exactly 2 digits
        fullPatterns.push(`${binPart}[0-9]{13}`);    // BIN 2 digits, need exactly 13 more
      } else if (len === 16) {
        // 16-digit cards (most common): BIN varies widely from ^4 (1 digit) to ^6367 (4 digits) to ^50[0-9] (3 digits)
        fullPatterns.push(`${binPart}[0-9]{10,14}`); // BIN 2-6 digits, need 10-14 more
      } else if (len === 19) {
        // 19-digit cards (Hipercard): BIN could be ^3841[046]0 (6 digits) or ^60 (2 digits)
        fullPatterns.push(`${binPart}[0-9]{13,17}`); // BIN 2-6 digits, need 13-17 more
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
  
  // Define preferred ordering for brands to handle overlapping patterns correctly
  // More specific patterns should come first (e.g., elo before aura, discover before hipercard, hipercard before diners)
  const preferredOrder = ['elo', 'discover', 'hipercard', 'diners', 'amex', 'aura', 'mastercard', 'visa'];
  
  const entries = fs.readdirSync(SOURCES_DIR, { withFileTypes: true })
    .sort((a, b) => {
      const nameA = a.name.replace('.json', '');
      const nameB = b.name.replace('.json', '');
      
      const indexA = preferredOrder.indexOf(nameA);
      const indexB = preferredOrder.indexOf(nameB);
      
      // If both are in preferred order, use that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in preferred order, it comes first
      if (indexA !== -1) return -1;
      // If only B is in preferred order, it comes first
      if (indexB !== -1) return 1;
      // Otherwise, use alphabetical order
      return nameA.localeCompare(nameB);
    });
  
  const compiledBrands = [];
  const legacyBrands = [];
  
  for (const entry of entries) {
    let source;
    let schemeName;
    let sourceFiles = [];
    
    if (entry.isDirectory()) {
      // Read all JSON files from subdirectory and merge them
      const subdir = path.join(SOURCES_DIR, entry.name);
      const files = fs.readdirSync(subdir)
        .filter(f => f.endsWith('.json'))
        .sort();
      
      if (files.length === 0) continue;
      
      const sources = files.map(f => {
        const filePath = path.join(subdir, f);
        sourceFiles.push(`${entry.name}/${f}`);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      });
      
      schemeName = entry.name;
      source = mergeSources(sources, schemeName);
      
    } else if (entry.name.endsWith('.json')) {
      // Single JSON file
      const sourcePath = path.join(SOURCES_DIR, entry.name);
      source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      schemeName = source.scheme;
      sourceFiles.push(entry.name);
      
    } else {
      // Skip non-JSON files
      continue;
    }
    
    console.log(`  ✓ Processing ${source.brand} (${schemeName})`);
    
    const patterns = buildPatterns(source.patterns);
    
    // Enhanced format
    const compiledBrand = {
      scheme: schemeName,
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
        sourceFile: sourceFiles.length === 1 ? sourceFiles[0] : sourceFiles
      }
    };
    
    // Add optional BIN-level details if present
    if (source.bins && Array.isArray(source.bins) && source.bins.length > 0) {
      compiledBrand.bins = source.bins.map(binData => ({
        bin: binData.bin,
        type: binData.type,
        category: binData.category || null,
        issuer: binData.issuer || null
      }));
    }
    
    compiledBrands.push(compiledBrand);
    
    // Legacy format (backward compatible)
    const legacyBrand = {
      name: schemeName,
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
