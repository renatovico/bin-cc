#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { SOURCES_DIR } = require('./lib/config');
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

  result.print();

  return !result.hasErrors;
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

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  console.log('');

  let isValid;
  if (args.length > 0) {
    // Validate specific path(s)
    isValid = args.every(arg => validatePath(arg));
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
