#!/usr/bin/env node
'use strict';

/**
 * Simple test for the build script to verify subfolder support
 */

const { buildData } = require('./build.js');

console.log('🧪 Testing build script...\n');

try {
  // Run the build
  const data = buildData();
  
  // Verify we have the expected number of brands
  const brandCount = data.compiledBrands.length;
  console.log(`✓ Found ${brandCount} brands`);
  
  if (brandCount !== 8) {
    throw new Error(`Expected 8 brands, but found ${brandCount}`);
  }
  
  // Verify Visa appears only once
  const visaBrands = data.compiledBrands.filter(b => b.scheme === 'visa');
  console.log(`✓ Found ${visaBrands.length} Visa entry`);
  
  if (visaBrands.length !== 1) {
    throw new Error(`Expected 1 Visa entry, but found ${visaBrands.length}`);
  }
  
  // Verify Visa has merged data from both files
  const visa = visaBrands[0];
  
  if (!Array.isArray(visa.metadata.sourceFile)) {
    throw new Error('Expected Visa metadata.sourceFile to be an array');
  }
  
  console.log(`✓ Visa merged from ${visa.metadata.sourceFile.length} files: ${visa.metadata.sourceFile.join(', ')}`);
  
  if (visa.metadata.sourceFile.length !== 2) {
    throw new Error(`Expected Visa to be merged from 2 files, but found ${visa.metadata.sourceFile.length}`);
  }
  
  // Verify Visa has bins from the detailed file
  if (!visa.bins || !Array.isArray(visa.bins) || visa.bins.length === 0) {
    throw new Error('Expected Visa to have bins data from detailed file');
  }
  
  console.log(`✓ Visa has ${visa.bins.length} BIN entries`);
  
  // Verify patterns are merged
  console.log(`✓ Visa has pattern: ${visa.patterns.bin}`);
  
  if (!visa.patterns.bin.includes('^4') || !visa.patterns.bin.includes('^6367')) {
    throw new Error('Expected Visa to have both patterns (^4 and ^6367)');
  }
  
  console.log('\n✅ All build script tests passed!\n');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
