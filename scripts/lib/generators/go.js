'use strict';

/**
 * Go code generators
 */

const { extractSimplifiedBrand, extractDetailedBrand, fileHeader } = require('./utils');

// Go-specific configuration
const go = {
  null: 'nil',
  string: (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`,
  stringSlice: (items) => items.length > 0 ? `[]string{${items.join(', ')}}` : '[]string{}',
  intSlice: (items) => items.length > 0 ? `[]int{${items.join(', ')}}` : '[]int{}',
};

/**
 * Convert value to Go literal
 */
function toGoValue(val) {
  if (val === null || val === undefined) return '""';
  if (val === true) return 'true';
  if (val === false) return 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return go.string(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]string{}';
    if (typeof val[0] === 'number') return go.intSlice(val);
    return go.stringSlice(val.map(v => toGoValue(v)));
  }
  return String(val);
}

/**
 * Generate Go native data file (simplified)
 */
function generateGo(brands) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'package creditcard',
    '',
    '// Brand represents a credit card brand with validation patterns',
    'type Brand struct {',
    '    Name         string',
    '    PriorityOver []string',
    '    RegexpBin    string',
    '    RegexpFull   string',
    '    RegexpCvv    string',
    '}',
    '',
    '// Brands contains all supported credit card brands',
    'var Brands = []Brand{',
  ];

  for (const brand of brands) {
    const b = extractSimplifiedBrand(brand);
    lines.push('    {');
    lines.push(`        Name:         ${toGoValue(b.name)},`);
    lines.push(`        PriorityOver: ${toGoValue(b.priorityOver)},`);
    lines.push(`        RegexpBin:    ${toGoValue(b.regexpBin)},`);
    lines.push(`        RegexpFull:   ${toGoValue(b.regexpFull)},`);
    lines.push(`        RegexpCvv:    ${toGoValue(b.regexpCvv)},`);
    lines.push('    },');
  }

  lines.push('}', '');
  return lines.join('\n');
}

/**
 * Generate Go native data file (detailed)
 */
function generateGoDetailed(detailed) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'package creditcard',
    '',
    '// Pattern represents a BIN pattern for validation',
    'type Pattern struct {',
    '    Bin       string',
    '    Length    []int',
    '    Luhn      bool',
    '    CvvLength int',
    '}',
    '',
    '// BinInfo represents detailed BIN information',
    'type BinInfo struct {',
    '    Bin       string',
    '    Type      string',
    '    Category  string',
    '    Issuer    string',
    '    Countries []string',
    '}',
    '',
    '// BrandDetailed represents detailed credit card brand information',
    'type BrandDetailed struct {',
    '    Scheme        string',
    '    Brand         string',
    '    Type          string',
    '    NumberLengths []int',
    '    NumberLuhn    bool',
    '    CvvLength     int',
    '    Patterns      []Pattern',
    '    Countries     []string',
    '    Metadata      map[string]interface{}',
    '    PriorityOver  []string',
    '    Bins          []BinInfo',
    '}',
    '',
    '// BrandsDetailed contains detailed information about all supported brands',
    'var BrandsDetailed = []BrandDetailed{',
  ];

  for (const brand of detailed) {
    const b = extractDetailedBrand(brand);
    
    lines.push('    {');
    lines.push(`        Scheme:        ${toGoValue(b.scheme)},`);
    lines.push(`        Brand:         ${toGoValue(b.brand)},`);
    lines.push(`        Type:          ${toGoValue(b.type)},`);
    lines.push(`        NumberLengths: ${toGoValue(b.number.lengths)},`);
    lines.push(`        NumberLuhn:    ${toGoValue(b.number.luhn)},`);
    lines.push(`        CvvLength:     ${b.cvv.length},`);
    
    // Patterns
    lines.push('        Patterns: []Pattern{');
    for (const pattern of b.patterns) {
      lines.push('            {');
      lines.push(`                Bin:       ${toGoValue(pattern.bin)},`);
      lines.push(`                Length:    ${toGoValue(pattern.length)},`);
      lines.push(`                Luhn:      ${toGoValue(pattern.luhn)},`);
      lines.push(`                CvvLength: ${pattern.cvvLength},`);
      lines.push('            },');
    }
    lines.push('        },');
    
    lines.push(`        Countries: ${toGoValue(b.countries)},`);
    
    // Metadata
    lines.push('        Metadata: map[string]interface{}{');
    for (const [key, value] of Object.entries(b.metadata)) {
      lines.push(`            ${toGoValue(key)}: ${toGoValue(value)},`);
    }
    lines.push('        },');
    
    lines.push(`        PriorityOver: ${toGoValue(b.priorityOver)},`);
    
    // Bins
    lines.push('        Bins: []BinInfo{');
    for (const bin of b.bins) {
      lines.push('            {');
      lines.push(`                Bin:       ${toGoValue(bin.bin)},`);
      lines.push(`                Type:      ${toGoValue(bin.type)},`);
      lines.push(`                Category:  ${toGoValue(bin.category)},`);
      lines.push(`                Issuer:    ${toGoValue(bin.issuer)},`);
      lines.push(`                Countries: ${toGoValue(bin.countries || [])},`);
      lines.push('            },');
    }
    lines.push('        },');
    
    lines.push('    },');
  }

  lines.push('}', '');
  return lines.join('\n');
}

module.exports = {
  generateGo,
  generateGoDetailed,
};
