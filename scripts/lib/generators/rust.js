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
 * Loads bins from JSON at runtime to avoid huge source files
 */
function generateRustDetailed(detailed) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    '//! Credit card brand data (detailed).',
    '//! Loads bins from JSON at runtime to handle large data efficiently.',
    '',
    'use serde::Deserialize;',
    'use std::sync::OnceLock;',
    '',
    'const CARDS_DETAILED_JSON: &str = include_str!("cards-detailed.json");',
    '',
    '#[derive(Debug, Clone, Deserialize)]',
    '#[serde(rename_all = "camelCase")]',
    'pub struct Pattern {',
    '    pub bin: String,',
    '    pub length: Vec<i32>,',
    '    pub luhn: bool,',
    '    pub cvv_length: i32,',
    '}',
    '',
    '#[derive(Debug, Clone, Deserialize)]',
    'pub struct BinInfo {',
    '    pub bin: String,',
    '    #[serde(rename = "type")]',
    '    pub bin_type: Option<String>,',
    '    pub category: Option<String>,',
    '    pub issuer: Option<String>,',
    '    pub countries: Option<Vec<String>>,',
    '}',
    '',
    '#[derive(Debug, Clone, Deserialize)]',
    'pub struct NumberInfo {',
    '    pub lengths: Vec<i32>,',
    '    pub luhn: bool,',
    '}',
    '',
    '#[derive(Debug, Clone, Deserialize)]',
    'pub struct CvvInfo {',
    '    pub length: i32,',
    '}',
    '',
    '#[derive(Debug, Clone, Deserialize)]',
    '#[serde(rename_all = "camelCase")]',
    'pub struct BrandDetailed {',
    '    pub scheme: String,',
    '    pub brand: String,',
    '    #[serde(rename = "type")]',
    '    pub brand_type: Option<String>,',
    '    pub number: NumberInfo,',
    '    pub cvv: CvvInfo,',
    '    pub patterns: Vec<Pattern>,',
    '    pub countries: Vec<String>,',
    '    #[serde(default)]',
    '    pub priority_over: Vec<String>,',
    '    #[serde(default)]',
    '    pub bins: Vec<BinInfo>,',
    '}',
    '',
    'static BRANDS_CACHE: OnceLock<Vec<BrandDetailed>> = OnceLock::new();',
    '',
    '/// Get detailed brand data (lazy-loaded from JSON).',
    'pub fn get_brands() -> &\'static [BrandDetailed] {',
    '    BRANDS_CACHE.get_or_init(|| {',
    '        serde_json::from_str(CARDS_DETAILED_JSON)',
    '            .expect("Failed to parse cards-detailed.json")',
    '    })',
    '}',
    '',
    '/// Deprecated: Use get_brands() instead.',
    '#[deprecated(note = "Use get_brands() instead")]',
    'pub static BRANDS: &[BrandDetailed] = &[];',
    '',
  ];

  return lines.join('\n');
}

module.exports = {
  generateRust,
  generateRustDetailed,
};
