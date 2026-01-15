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
 * Loads bins from JSON at runtime to avoid huge source files
 */
function generateGoDetailed(detailed) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'package creditcard',
    '',
    'import (',
    '    _ "embed"',
    '    "encoding/json"',
    '    "sync"',
    ')',
    '',
    '//go:embed cards-detailed.json',
    'var cardsDetailedJSON []byte',
    '',
    '// Pattern represents a BIN pattern for validation',
    'type Pattern struct {',
    '    Bin       string `json:"bin"`',
    '    Length    []int  `json:"length"`',
    '    Luhn      bool   `json:"luhn"`',
    '    CvvLength int    `json:"cvvLength"`',
    '}',
    '',
    '// BinInfo represents detailed BIN information',
    'type BinInfo struct {',
    '    Bin       string   `json:"bin"`',
    '    Type      string   `json:"type"`',
    '    Category  string   `json:"category"`',
    '    Issuer    string   `json:"issuer"`',
    '    Countries []string `json:"countries"`',
    '}',
    '',
    '// NumberInfo represents card number validation info',
    'type NumberInfo struct {',
    '    Lengths []int `json:"lengths"`',
    '    Luhn    bool  `json:"luhn"`',
    '}',
    '',
    '// CvvInfo represents CVV validation info',
    'type CvvInfo struct {',
    '    Length int `json:"length"`',
    '}',
    '',
    '// BrandDetailed represents detailed credit card brand information',
    'type BrandDetailed struct {',
    '    Scheme       string                 `json:"scheme"`',
    '    Brand        string                 `json:"brand"`',
    '    Type         string                 `json:"type"`',
    '    Number       NumberInfo             `json:"number"`',
    '    Cvv          CvvInfo                `json:"cvv"`',
    '    Patterns     []Pattern              `json:"patterns"`',
    '    Countries    []string               `json:"countries"`',
    '    Metadata     map[string]interface{} `json:"metadata"`',
    '    PriorityOver []string               `json:"priorityOver"`',
    '    Bins         []BinInfo              `json:"bins"`',
    '}',
    '',
    'var (',
    '    brandsDetailedOnce sync.Once',
    '    brandsDetailedData []BrandDetailed',
    ')',
    '',
    '// GetBrandsDetailed returns detailed information about all supported brands (lazy-loaded from JSON)',
    'func GetBrandsDetailed() []BrandDetailed {',
    '    brandsDetailedOnce.Do(func() {',
    '        if err := json.Unmarshal(cardsDetailedJSON, &brandsDetailedData); err != nil {',
    '            panic("failed to parse cards-detailed.json: " + err.Error())',
    '        }',
    '    })',
    '    return brandsDetailedData',
    '}',
    '',
    '// BrandsDetailed is deprecated. Use GetBrandsDetailed() instead.',
    'var BrandsDetailed = []BrandDetailed{}',
    '',
  ];

  return lines.join('\n');
}

module.exports = {
  generateGo,
  generateGoDetailed,
};
