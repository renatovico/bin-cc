'use strict';

/**
 * Python code generators
 */

const { LANG_CONFIG, toNativeValue, extractSimplifiedBrand, extractDetailedBrand, fileHeader } = require('./utils');

const py = LANG_CONFIG.python;

/**
 * Generate Python native data file (simplified)
 */
function generatePython(brands) {
  const lines = [
    ...fileHeader('#'),
    '"""Credit card brand data."""',
    '',
    'from typing import List, TypedDict',
    '',
    '',
    'class Brand(TypedDict):',
    '    """Brand definition."""',
    '    name: str',
    '    priority_over: List[str]',
    '    regexp_bin: str',
    '    regexp_full: str',
    '    regexp_cvv: str',
    '',
    '',
    'BRANDS: List[Brand] = ['
  ];

  for (const brand of brands) {
    const b = extractSimplifiedBrand(brand);
    lines.push('    {');
    lines.push(`        "name": ${py.string(b.name)},`);
    lines.push(`        "priority_over": ${toNativeValue(b.priorityOver, 'python')},`);
    lines.push(`        "regexp_bin": ${py.rawString(b.regexpBin)},`);
    lines.push(`        "regexp_full": ${py.rawString(b.regexpFull)},`);
    lines.push(`        "regexp_cvv": ${py.rawString(b.regexpCvv)},`);
    lines.push('    },');
  }

  lines.push(']', '');
  return lines.join('\n');
}

/**
 * Generate Python native data file (detailed)
 */
function generatePythonDetailed(detailed) {
  const lines = [
    ...fileHeader('#'),
    '"""Credit card brand data (detailed)."""',
    '',
    'BRANDS = ['
  ];

  for (const brand of detailed) {
    const b = extractDetailedBrand(brand);
    lines.push('    {');
    lines.push(`        "scheme": ${toNativeValue(b.scheme, 'python')},`);
    lines.push(`        "brand": ${toNativeValue(b.brand, 'python')},`);
    lines.push(`        "type": ${toNativeValue(b.type, 'python')},`);
    lines.push('        "number": {');
    lines.push(`            "lengths": ${toNativeValue(b.number.lengths, 'python')},`);
    lines.push(`            "luhn": ${toNativeValue(b.number.luhn, 'python')}`);
    lines.push('        },');
    lines.push('        "cvv": {');
    lines.push(`            "length": ${b.cvv.length}`);
    lines.push('        },');
    lines.push('        "patterns": [');
    for (const pattern of b.patterns) {
      lines.push('            {');
      lines.push(`                "bin": ${toNativeValue(pattern.bin, 'python')},`);
      lines.push(`                "length": ${toNativeValue(pattern.length, 'python')},`);
      lines.push(`                "luhn": ${toNativeValue(pattern.luhn, 'python')},`);
      lines.push(`                "cvvLength": ${pattern.cvvLength}`);
      lines.push('            },');
    }
    lines.push('        ],');
    lines.push(`        "countries": ${toNativeValue(b.countries, 'python')},`);
    lines.push(`        "metadata": ${toNativeValue(b.metadata, 'python')},`);
    lines.push(`        "priorityOver": ${toNativeValue(b.priorityOver, 'python')},`);
    
    if (b.bins.length > 0) {
      lines.push('        "bins": [');
      for (const bin of b.bins) {
        lines.push('            {');
        lines.push(`                "bin": ${toNativeValue(bin.bin, 'python')},`);
        lines.push(`                "type": ${toNativeValue(bin.type, 'python')},`);
        lines.push(`                "category": ${toNativeValue(bin.category, 'python')},`);
        lines.push(`                "issuer": ${toNativeValue(bin.issuer, 'python')},`);
        lines.push(`                "countries": ${toNativeValue(bin.countries || [], 'python')}`);
        lines.push('            },');
      }
      lines.push('        ]');
    } else {
      lines.push('        "bins": []');
    }
    
    lines.push('    },');
  }

  lines.push(']', '');
  return lines.join('\n');
}

module.exports = {
  generatePython,
  generatePythonDetailed,
};
