#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { SOURCES_DIR, COMPILED_DIR } = require('./lib/config');
const { readAllSources, readSourceFile, readSourceDirectory } = require('./lib/source-reader');

/**
 * Validation result collector
 */
class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  addError(source, message) {
    this.errors.push({ source, message });
  }

  addWarning(source, message) {
    this.warnings.push({ source, message });
  }

  get hasErrors() {
    return this.errors.length > 0;
  }

  print() {
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:\n');
      this.warnings.forEach(w => console.log(`  ⚠ ${w.source}: ${w.message}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:\n');
      this.errors.forEach(e => console.error(`  ✗ ${e.source}: ${e.message}`));
    }

    if (!this.hasErrors && this.warnings.length === 0) {
      console.log('  ✓ All validations passed!');
    }
  }
}

/**
 * Validate a single pattern object
 */
function validatePattern(pattern, sourceName, result) {
  // Validate BIN regex
  if (!pattern.bin) {
    result.addError(sourceName, 'Pattern missing "bin" field');
  } else {
    try {
      new RegExp(pattern.bin);
    } catch (e) {
      result.addError(sourceName, `Invalid BIN regex: ${e.message}`);
    }
  }

  // Validate length
  if (!pattern.length) {
    result.addError(sourceName, 'Pattern missing "length" field');
  } else if (!Array.isArray(pattern.length) && typeof pattern.length !== 'number') {
    result.addError(sourceName, 'Pattern "length" must be a number or array of numbers');
  }

  // Validate luhn
  if (typeof pattern.luhn !== 'boolean') {
    result.addError(sourceName, 'Pattern missing or invalid "luhn" field (must be boolean)');
  }

  // Validate cvvLength
  if (typeof pattern.cvvLength !== 'number') {
    result.addError(sourceName, 'Pattern missing or invalid "cvvLength" field (must be number)');
  }
}

/**
 * Validate a single BIN entry
 */
function validateBin(bin, sourceName, result) {
  if (!bin.bin || typeof bin.bin !== 'string') {
    result.addError(sourceName, 'BIN entry missing or invalid "bin" field');
  } else if (!/^\d{6,8}$/.test(bin.bin)) {
    result.addWarning(sourceName, `BIN "${bin.bin}" should be 6-8 digits`);
  }

  if (!bin.type) {
    result.addWarning(sourceName, `BIN "${bin.bin}" missing "type" field`);
  }

  if (bin.countries) {
    if (!Array.isArray(bin.countries)) {
      result.addError(sourceName, `BIN "${bin.bin}" countries must be an array`);
    } else {
      bin.countries.forEach(c => {
        if (c !== 'GLOBAL' && !/^[A-Z]{2}$/.test(c)) {
          result.addWarning(sourceName, `BIN "${bin.bin}" country "${c}" should be ISO 3166-1 alpha-2 or "GLOBAL"`);
        }
      });
    }
  }
}

/**
 * Validate a source object (full source with all required fields)
 */
function validateSource(source, sourceName, result) {
  // Required fields
  const required = ['scheme', 'brand', 'patterns'];
  for (const field of required) {
    if (!source[field]) {
      result.addError(sourceName, `Missing required field "${field}"`);
    }
  }

  // Validate scheme format
  if (source.scheme && !/^[a-z][a-z0-9-]*$/.test(source.scheme)) {
    result.addWarning(sourceName, 'Scheme should be lowercase alphanumeric with hyphens');
  }

  // Validate patterns array
  if (!Array.isArray(source.patterns) || source.patterns.length === 0) {
    result.addError(sourceName, '"patterns" must be a non-empty array');
  } else {
    source.patterns.forEach((p, i) => validatePattern(p, `${sourceName}[pattern ${i}]`, result));
  }

  // Validate type
  if (source.type && !['credit', 'debit'].includes(source.type)) {
    result.addWarning(sourceName, 'Type should be "credit" or "debit"');
  }

  // Validate countries
  if (source.countries) {
    if (!Array.isArray(source.countries)) {
      result.addError(sourceName, '"countries" must be an array');
    } else {
      source.countries.forEach(c => {
        if (c !== 'GLOBAL' && !/^[A-Z]{2}$/.test(c)) {
          result.addWarning(sourceName, `Country "${c}" should be ISO 3166-1 alpha-2 or "GLOBAL"`);
        }
      });
    }
  }

  // Validate bins if present
  if (source.bins) {
    if (!Array.isArray(source.bins)) {
      result.addError(sourceName, '"bins" must be an array');
    } else {
      source.bins.forEach(b => validateBin(b, sourceName, result));
    }
  }
}

/**
 * Validate a partial source file (bins-only file in a subfolder)
 */
function validatePartialSource(source, sourceName, result) {
  // A partial source must have at least bins
  if (!source.bins || !Array.isArray(source.bins)) {
    result.addError(sourceName, 'Partial source must have a "bins" array');
    return;
  }

  source.bins.forEach(b => validateBin(b, sourceName, result));

  // Warn if partial source has base fields (should be in base.json)
  if (source.patterns) {
    result.addWarning(sourceName, 'Partial source should not define "patterns" (use base.json)');
  }
}

/**
 * Check if a source is a partial source (bins-only)
 */
function isPartialSource(source) {
  return source.bins && !source.patterns;
}

/**
 * Validate all source files
 */
function validateSources() {
  console.log('🔍 Validating source files...\n');

  const result = new ValidationResult();
  const sources = readAllSources();

  for (const { source, schemeName, sourceFiles } of sources) {
    const sourceName = sourceFiles.length === 1 ? sourceFiles[0] : schemeName;
    const sourcePath = sourceFiles.length === 1 
      ? path.join(SOURCES_DIR, sourceFiles[0])
      : path.join(SOURCES_DIR, schemeName);
    console.log(`  Checking ${sourcePath}...`);
    validateSource(source, sourceName, result);
  }

  result.print();

  return !result.hasErrors;
}

/**
 * Validate compiled data (post-build validation)
 */
function validateCompiled(compiledBrands) {
  console.log('\n🔍 Validating compiled data...\n');

  const result = new ValidationResult();

  for (const brand of compiledBrands) {
    const required = ['scheme', 'brand', 'type', 'number', 'cvv', 'patterns'];
    for (const field of required) {
      if (!brand[field]) {
        result.addError(brand.scheme || 'unknown', `Missing required field "${field}"`);
      }
    }

    if (Array.isArray(brand.patterns)) {
      brand.patterns.forEach((p, i) => validatePattern(p, `${brand.scheme}[pattern ${i}]`, result));
    }
  }

  // Check for BIN conflicts between brands
  const conflicts = detectBinConflicts(compiledBrands, result);

  result.print();

  return { valid: !result.hasErrors, conflicts };
}

/**
 * Generate test card numbers for a given pattern and lengths
 */
function generateTestNumbers(pattern, lengths) {
  const testNumbers = [];
  const binRegex = pattern.bin.replace(/^\^/, '');
  
  // Extract sample prefixes from the pattern
  const prefixes = extractSamplePrefixes(binRegex);
  
  for (const prefix of prefixes) {
    for (const len of lengths) {
      const remaining = len - prefix.length;
      if (remaining >= 0) {
        const testNum = prefix + '0'.repeat(remaining);
        if (testNum.length === len) {
          testNumbers.push(testNum);
        }
      }
    }
  }
  
  return testNumbers;
}

/**
 * Extract sample prefixes from a BIN pattern
 * This generates concrete examples from regex patterns
 */
function extractSamplePrefixes(pattern) {
  const prefixes = new Set();
  
  // Handle simple alternation: 401178|401179|431274
  if (!pattern.includes('(') && !pattern.includes('[') && !pattern.includes('\\')) {
    pattern.split('|').forEach(p => prefixes.add(p.replace(/^\^/, '')));
    return Array.from(prefixes);
  }
  
  // Handle patterns starting with digits
  const leadingDigits = pattern.match(/^(\d+)/);
  if (leadingDigits) {
    prefixes.add(leadingDigits[1]);
  }
  
  // Handle alternation with groups: (401178|401179) or ^(506699|5067[0-6]\d)
  const topAlts = splitTopLevelOr(pattern);
  for (const alt of topAlts) {
    const cleaned = alt.replace(/^\^?\(?/, '').replace(/\)?$/, '');
    
    // Check for simple number
    if (/^\d+$/.test(cleaned)) {
      prefixes.add(cleaned);
      continue;
    }
    
    // Check for leading digits
    const digits = cleaned.match(/^(\d+)/);
    if (digits) {
      prefixes.add(digits[1]);
      
      // If followed by character class, expand it
      const withClass = cleaned.match(/^(\d+)\[(\d)-(\d)\]/);
      if (withClass) {
        const [, prefix, start, end] = withClass;
        for (let i = parseInt(start); i <= parseInt(end) && i - parseInt(start) < 5; i++) {
          prefixes.add(prefix + i);
        }
      }
      
      // If followed by \d, add with 0-9
      if (cleaned.match(/^(\d+)\\d/)) {
        for (let i = 0; i <= 9; i++) {
          prefixes.add(digits[1] + i);
        }
      }
    }
  }
  
  // Handle patterns like 3(?:0[0-5]|[68][0-9])
  if (pattern.includes('(?:')) {
    const leadMatch = pattern.match(/^(\d+)/);
    const lead = leadMatch ? leadMatch[1] : '';
    
    const groupMatch = pattern.match(/\(\?:([^)]+)\)/);
    if (groupMatch) {
      const groupContent = groupMatch[1];
      const alternatives = groupContent.split('|');
      
      for (const alt of alternatives) {
        const expanded = expandFirstCharClass(alt);
        for (const exp of expanded.slice(0, 5)) {
          prefixes.add(lead + exp);
        }
      }
    }
  }
  
  return Array.from(prefixes).filter(p => p.length >= 2);
}

/**
 * Split pattern by top-level OR (|) not inside parentheses
 */
function splitTopLevelOr(pattern) {
  const parts = [];
  let current = '';
  let depth = 0;
  
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    if (char === '(' || char === '[') depth++;
    if (char === ')' || char === ']') depth--;
    if (char === '|' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  
  return parts;
}

/**
 * Expand first character class in a pattern to get sample values
 */
function expandFirstCharClass(pattern) {
  const results = [];
  const match = pattern.match(/^([^\[]*)\[(\d)-(\d)\](.*)$/);
  
  if (match) {
    const [, prefix, start, end, suffix] = match;
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      // Recursively expand remaining pattern
      const rest = expandFirstCharClass(suffix);
      if (rest.length > 0) {
        for (const r of rest) {
          results.push(prefix + i + r);
        }
      } else {
        results.push(prefix + i);
      }
    }
  } else if (pattern.includes('\\d')) {
    // Replace \d with 0
    results.push(pattern.replace(/\\d/g, '0'));
  } else {
    results.push(pattern);
  }
  
  return results;
}

/**
 * Detect BIN conflicts between brands
 * Returns array of conflicts for writing to file
 */
function detectBinConflicts(compiledBrands, result) {
  const conflicts = [];
  
  // For each pair of brands, check if their patterns can match the same card number
  for (let i = 0; i < compiledBrands.length; i++) {
    for (let j = i + 1; j < compiledBrands.length; j++) {
      const brand1 = compiledBrands[i];
      const brand2 = compiledBrands[j];
      
      // Generate test numbers for brand1 and check if brand2 also matches
      for (const pattern1 of brand1.patterns) {
        const lengths1 = Array.isArray(pattern1.length) ? pattern1.length : [pattern1.length];
        const testNumbers = generateTestNumbers(pattern1, lengths1);
        
        for (const testNum of testNumbers) {
          // Check if brand2 matches this test number
          for (const pattern2 of brand2.patterns) {
            const lengths2 = Array.isArray(pattern2.length) ? pattern2.length : [pattern2.length];
            
            if (!lengths2.includes(testNum.length)) continue;
            
            try {
              const regex2 = new RegExp(pattern2.bin);
              if (regex2.test(testNum)) {
                conflicts.push({
                  testNumber: testNum,
                  brand1: brand1.scheme,
                  pattern1: pattern1.bin,
                  brand2: brand2.scheme,
                  pattern2: pattern2.bin
                });
              }
            } catch (e) {
              // Invalid regex, skip
            }
          }
        }
      }
    }
  }
  
  // Deduplicate by BIN prefix (first 6 digits)
  const uniqueConflicts = new Map();
  for (const conflict of conflicts) {
    const bin = conflict.testNumber.substring(0, 6);
    const key = `${conflict.brand1}:${conflict.brand2}:${bin}`;
    if (!uniqueConflicts.has(key)) {
      uniqueConflicts.set(key, {
        bin,
        brands: [conflict.brand1, conflict.brand2],
        patterns: {
          [conflict.brand1]: conflict.pattern1,
          [conflict.brand2]: conflict.pattern2
        },
        example: conflict.testNumber
      });
    }
  }
  
  const conflictList = Array.from(uniqueConflicts.values());
  
  if (conflictList.length > 0) {
    console.log(`\n⚠️  BIN Conflicts Detected: ${conflictList.length} conflicts\n`);
    
    // Group by brand pair for cleaner output
    const byPair = new Map();
    for (const c of conflictList) {
      const pairKey = c.brands.sort().join(' vs ');
      if (!byPair.has(pairKey)) byPair.set(pairKey, []);
      byPair.get(pairKey).push(c.bin);
    }
    
    for (const [pair, bins] of byPair) {
      console.log(`  ⚠ ${pair}: ${bins.slice(0, 5).join(', ')}${bins.length > 5 ? ` (+${bins.length - 5} more)` : ''}`);
      result.addWarning('bin-conflict', `${pair}: ${bins.length} overlapping BINs`);
    }
    
    console.log('\n  💡 Tip: Use "priorityOver" in source files to control matching order.');
    console.log('     See data/compiled/conflicts.json for full details.\n');
  }
  
  return conflictList;
}

/**
 * Validate a specific file or directory
 */
function validatePath(targetPath) {
  const absolutePath = path.isAbsolute(targetPath) 
    ? targetPath 
    : path.resolve(process.cwd(), targetPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Path not found: ${absolutePath}`);
    return false;
  }

  console.log('🔍 Validating...\n');

  const result = new ValidationResult();
  const stat = fs.statSync(absolutePath);

  if (stat.isDirectory()) {
    const dirName = path.basename(absolutePath);
    const data = readSourceDirectory(absolutePath, dirName);
    if (data) {
      console.log(`  Checking ${absolutePath}...`);
      validateSource(data.source, dirName, result);
    } else {
      console.error(`  No JSON files found in ${absolutePath}`);
      return false;
    }
  } else if (absolutePath.endsWith('.json')) {
    const source = readSourceFile(absolutePath);
    const fileName = path.basename(absolutePath);
    console.log(`  Checking ${absolutePath}...`);
    
    // Check if it's a partial source (bins-only file)
    if (isPartialSource(source)) {
      validatePartialSource(source, fileName, result);
    } else {
      validateSource(source, fileName, result);
    }
  } else {
    console.error(`❌ Invalid file type. Must be a .json file or directory.`);
    return false;
  }

  result.print();
  return !result.hasErrors;
}

/**
 * Print CLI usage help
 */
function printHelp() {
  console.log(`
Usage: node scripts/validate.js [options] [path...]

Validate bin-cc source files and detect BIN conflicts.

Options:
  --help, -h     Show this help message
  --conflicts    Show only BIN conflicts (requires compiled data)

Arguments:
  path           Path to a .json file or directory to validate
                 If no path is given, validates all sources in data/sources/

Examples:
  node scripts/validate.js                        # Validate all sources
  node scripts/validate.js data/sources/elo.json  # Validate specific file
  node scripts/validate.js data/sources/visa/     # Validate directory
  node scripts/validate.js --conflicts            # Show BIN conflicts only

Output Files:
  data/compiled/conflicts.json  - Generated during build with all BIN conflicts
`);
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Handle help flag
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  
  // Handle conflicts flag
  if (args.includes('--conflicts')) {
    const conflictsPath = path.join(COMPILED_DIR, 'conflicts.json');
    if (fs.existsSync(conflictsPath)) {
      const conflicts = JSON.parse(fs.readFileSync(conflictsPath, 'utf8'));
      console.log(`\n⚠️  BIN Conflicts: ${conflicts.total} total\n`);
      console.log(`Generated: ${conflicts.generated}\n`);
      
      // Group by brand pair
      const byPair = new Map();
      for (const c of conflicts.conflicts) {
        const pairKey = c.brands.sort().join(' vs ');
        if (!byPair.has(pairKey)) byPair.set(pairKey, []);
        byPair.get(pairKey).push(c);
      }
      
      for (const [pair, items] of byPair) {
        console.log(`${pair}: ${items.length} overlapping BINs`);
        items.slice(0, 5).forEach(c => {
          console.log(`  - ${c.bin} (example: ${c.example})`);
        });
        if (items.length > 5) {
          console.log(`  ... and ${items.length - 5} more`);
        }
        console.log('');
      }
    } else {
      console.error('❌ No conflicts.json found. Run `npm run build` first.\n');
      process.exit(1);
    }
    process.exit(0);
  }
  
  console.log('');

  let isValid;
  const paths = args.filter(a => !a.startsWith('-'));
  
  if (paths.length > 0) {
    // Validate specific path(s)
    isValid = paths.every(arg => validatePath(arg));
  } else {
    // Validate all sources
    isValid = validateSources();
  }

  console.log('');

  if (!isValid) {
    console.error('❌ Validation failed\n');
    process.exit(1);
  }

  console.log('✨ All sources are valid!\n');
}

module.exports = { 
  validateSources, 
  validateCompiled, 
  validateSource, 
  validatePartialSource,
  validatePath, 
  isPartialSource,
  ValidationResult 
};
