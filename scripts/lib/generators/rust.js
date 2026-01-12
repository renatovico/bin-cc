'use strict';

/**
 * Rust code generators
 */

const { extractSimplifiedBrand, extractDetailedBrand, fileHeader } = require('./utils');

// Rust-specific configuration
const rust = {
  null: 'None',
  some: (v) => `Some(${v})`,
  string: (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`,
  slice: (items) => items.length > 0 ? `&[${items.join(', ')}]` : '&[]',
};

/**
 * Convert value to Rust literal for static data (using slices instead of Vec)
 */
function toRustValue(val, optional = false) {
  if (val === null || val === undefined) {
    return optional ? rust.null : '""';
  }
  if (val === true) return 'true';
  if (val === false) return 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const strVal = rust.string(val);
    return optional ? rust.some(strVal) : strVal;
  }
  if (Array.isArray(val)) {
    if (typeof val[0] === 'number') {
      return rust.slice(val.map(v => String(v)));
    }
    return rust.slice(val.map(v => toRustValue(v)));
  }
  return String(val);
}

/**
 * Generate Rust native data file (simplified)
 */
function generateRust(brands) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    '/// Credit card brand data (simplified).',
    '',
    '#[derive(Debug, Clone)]',
    'pub struct Brand {',
    '    pub name: &\'static str,',
    '    pub priority_over: &\'static [&\'static str],',
    '    pub regexp_bin: &\'static str,',
    '    pub regexp_full: &\'static str,',
    '    pub regexp_cvv: &\'static str,',
    '}',
    '',
    'pub static BRANDS: &[Brand] = &[',
  ];

  for (const brand of brands) {
    const b = extractSimplifiedBrand(brand);
    lines.push('    Brand {');
    lines.push(`        name: ${toRustValue(b.name)},`);
    lines.push(`        priority_over: ${toRustValue(b.priorityOver)},`);
    lines.push(`        regexp_bin: ${toRustValue(b.regexpBin)},`);
    lines.push(`        regexp_full: ${toRustValue(b.regexpFull)},`);
    lines.push(`        regexp_cvv: ${toRustValue(b.regexpCvv)},`);
    lines.push('    },');
  }

  lines.push('];', '');
  return lines.join('\n');
}

/**
 * Generate Rust native data file (detailed)
 */
function generateRustDetailed(detailed) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    '/// Credit card brand data (detailed).',
    '',
    '#[derive(Debug, Clone)]',
    'pub struct Pattern {',
    '    pub bin: &\'static str,',
    '    pub length: &\'static [i32],',
    '    pub luhn: bool,',
    '    pub cvv_length: i32,',
    '}',
    '',
    '#[derive(Debug, Clone)]',
    'pub struct Bin {',
    '    pub bin: &\'static str,',
    '    pub bin_type: &\'static str,',
    '    pub category: &\'static str,',
    '    pub issuer: &\'static str,',
    '    pub countries: &\'static [&\'static str],',
    '}',
    '',
    '#[derive(Debug, Clone)]',
    'pub struct BrandDetailed {',
    '    pub scheme: &\'static str,',
    '    pub brand: &\'static str,',
    '    pub brand_type: &\'static str,',
    '    pub number_lengths: &\'static [i32],',
    '    pub number_luhn: bool,',
    '    pub cvv_length: i32,',
    '    pub patterns: &\'static [Pattern],',
    '    pub countries: &\'static [&\'static str],',
    '    pub priority_over: &\'static [&\'static str],',
    '    pub bins: &\'static [Bin],',
    '}',
    '',
    'pub static BRANDS: &[BrandDetailed] = &[',
  ];

  for (const brand of detailed) {
    const b = extractDetailedBrand(brand);
    
    lines.push('    BrandDetailed {');
    lines.push(`        scheme: ${toRustValue(b.scheme)},`);
    lines.push(`        brand: ${toRustValue(b.brand)},`);
    lines.push(`        brand_type: ${toRustValue(b.type)},`);
    lines.push(`        number_lengths: ${toRustValue(b.number.lengths)},`);
    lines.push(`        number_luhn: ${toRustValue(b.number.luhn)},`);
    lines.push(`        cvv_length: ${b.cvv.length},`);
    
    // Patterns
    lines.push('        patterns: &[');
    for (const pattern of b.patterns) {
      lines.push('            Pattern {');
      lines.push(`                bin: ${toRustValue(pattern.bin)},`);
      lines.push(`                length: ${toRustValue(pattern.length)},`);
      lines.push(`                luhn: ${toRustValue(pattern.luhn)},`);
      lines.push(`                cvv_length: ${pattern.cvvLength},`);
      lines.push('            },');
    }
    lines.push('        ],');
    
    lines.push(`        countries: ${toRustValue(b.countries)},`);
    lines.push(`        priority_over: ${toRustValue(b.priorityOver)},`);
    
    // Bins
    lines.push('        bins: &[');
    for (const bin of b.bins) {
      lines.push('            Bin {');
      lines.push(`                bin: ${toRustValue(bin.bin)},`);
      lines.push(`                bin_type: ${toRustValue(bin.type)},`);
      lines.push(`                category: ${toRustValue(bin.category)},`);
      lines.push(`                issuer: ${toRustValue(bin.issuer)},`);
      lines.push(`                countries: ${toRustValue(bin.countries || [])},`);
      lines.push('            },');
    }
    lines.push('        ],');
    
    lines.push('    },');
  }

  lines.push('];', '');
  return lines.join('\n');
}

module.exports = {
  generateRust,
  generateRustDetailed,
};
