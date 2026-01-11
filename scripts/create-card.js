#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { SOURCES_DIR } = require('./lib/config');
const { validatePath } = require('./validate');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = '') {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  return new Promise(resolve => {
    rl.question(`${question}${suffix}: `, answer => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askYesNo(question, defaultValue = true) {
  const suffix = defaultValue ? '(Y/n)' : '(y/N)';
  return new Promise(resolve => {
    rl.question(`${question} ${suffix}: `, answer => {
      const normalized = answer.trim().toLowerCase();
      if (normalized === '') resolve(defaultValue);
      else resolve(normalized === 'y' || normalized === 'yes');
    });
  });
}

async function createCard() {
  console.log('\n🃏 Create a new card source\n');

  // Basic info
  const scheme = await ask('Scheme identifier (lowercase, e.g., "jcb")');
  if (!scheme) {
    console.error('❌ Scheme is required');
    process.exit(1);
  }

  const brand = await ask('Brand display name', scheme.charAt(0).toUpperCase() + scheme.slice(1));
  const type = await ask('Card type (credit/debit)', 'credit');
  const countriesInput = await ask('Countries (comma-separated ISO codes or GLOBAL)', 'GLOBAL');
  const countries = countriesInput.split(',').map(c => c.trim().toUpperCase());

  // Pattern info
  console.log('\n📋 Pattern configuration:\n');
  const binPattern = await ask('BIN regex pattern (e.g., "^4" for Visa)');
  if (!binPattern) {
    console.error('❌ BIN pattern is required');
    process.exit(1);
  }

  const lengthsInput = await ask('Card number lengths (comma-separated)', '16');
  const lengths = lengthsInput.split(',').map(l => parseInt(l.trim(), 10)).filter(n => !isNaN(n));

  const luhn = await askYesNo('Use Luhn validation?', true);
  const cvvLength = parseInt(await ask('CVV length', '3'), 10);

  // Build source object
  const source = {
    scheme,
    brand,
    patterns: [
      {
        bin: binPattern,
        length: lengths.length === 1 ? lengths[0] : lengths,
        luhn,
        cvvLength
      }
    ],
    type,
    countries
  };

  // Check if file already exists
  const filePath = path.join(SOURCES_DIR, `${scheme}.json`);
  if (fs.existsSync(filePath)) {
    const overwrite = await askYesNo(`\n⚠️  File ${scheme}.json already exists. Overwrite?`, false);
    if (!overwrite) {
      console.log('\n❌ Aborted\n');
      process.exit(1);
    }
  }

  // Preview
  console.log('\n📄 Preview:\n');
  console.log(JSON.stringify(source, null, 2));

  const confirm = await askYesNo('\nCreate this file?', true);
  if (!confirm) {
    console.log('\n❌ Aborted\n');
    process.exit(1);
  }

  // Write file
  fs.writeFileSync(filePath, JSON.stringify(source, null, 2) + '\n');
  console.log(`\n✅ Created: ${filePath}`);

  // Validate
  console.log('');
  rl.close();
  
  const isValid = validatePath(filePath);
  if (!isValid) {
    console.log('\n⚠️  File created but has validation issues. Please fix them.\n');
    process.exit(1);
  }

  console.log('✨ Card source created and validated!\n');
}

// CLI execution
if (require.main === module) {
  createCard().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = { createCard };
