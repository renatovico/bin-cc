'use strict';

/**
 * PHP code generators
 */

const { extractSimplifiedBrand, extractDetailedBrand, fileHeader } = require('./utils');

// PHP-specific configuration
const php = {
  null: 'null',
  true: 'true',
  false: 'false',
  string: (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`,
  array: (items) => items.length > 0 ? `[${items.join(', ')}]` : '[]',
};

/**
 * Convert value to PHP literal
 */
function toPhpValue(val) {
  if (val === null || val === undefined) return php.null;
  if (val === true) return php.true;
  if (val === false) return php.false;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return php.string(val);
  if (Array.isArray(val)) {
    return php.array(val.map(v => toPhpValue(v)));
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val).map(([k, v]) => `${php.string(k)} => ${toPhpValue(v)}`);
    return php.array(entries);
  }
  return String(val);
}

/**
 * Generate PHP native data file (simplified)
 */
function generatePhp(brands) {
  const lines = [
    '<?php',
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'namespace CreditCard\\Identifier;',
    '',
    '/**',
    ' * Credit card brand data (simplified).',
    ' */',
    'class BrandData',
    '{',
    '    /**',
    '     * @return array<array{name: string, priorityOver: array<string>, regexpBin: string, regexpFull: string, regexpCvv: string}>',
    '     */',
    '    public static function getBrands(): array',
    '    {',
    '        return [',
  ];

  for (const brand of brands) {
    const b = extractSimplifiedBrand(brand);
    lines.push('            [');
    lines.push(`                'name' => ${toPhpValue(b.name)},`);
    lines.push(`                'priorityOver' => ${toPhpValue(b.priorityOver)},`);
    lines.push(`                'regexpBin' => ${toPhpValue(b.regexpBin)},`);
    lines.push(`                'regexpFull' => ${toPhpValue(b.regexpFull)},`);
    lines.push(`                'regexpCvv' => ${toPhpValue(b.regexpCvv)},`);
    lines.push('            ],');
  }

  lines.push('        ];');
  lines.push('    }');
  lines.push('}', '');
  return lines.join('\n');
}

/**
 * Generate PHP native data file (detailed)
 */
function generatePhpDetailed(detailed) {
  const lines = [
    '<?php',
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'namespace CreditCard\\Identifier;',
    '',
    '/**',
    ' * Credit card brand data (detailed).',
    ' */',
    'class BrandDataDetailed',
    '{',
    '    /**',
    '     * @return array<array>',
    '     */',
    '    public static function getBrands(): array',
    '    {',
    '        return [',
  ];

  for (const brand of detailed) {
    const b = extractDetailedBrand(brand);
    
    lines.push('            [');
    lines.push(`                'scheme' => ${toPhpValue(b.scheme)},`);
    lines.push(`                'brand' => ${toPhpValue(b.brand)},`);
    lines.push(`                'type' => ${toPhpValue(b.type)},`);
    lines.push('                \'number\' => [');
    lines.push(`                    'lengths' => ${toPhpValue(b.number.lengths)},`);
    lines.push(`                    'luhn' => ${toPhpValue(b.number.luhn)},`);
    lines.push('                ],');
    lines.push('                \'cvv\' => [');
    lines.push(`                    'length' => ${b.cvv.length},`);
    lines.push('                ],');
    
    // Patterns
    lines.push('                \'patterns\' => [');
    for (const pattern of b.patterns) {
      lines.push('                    [');
      lines.push(`                        'bin' => ${toPhpValue(pattern.bin)},`);
      lines.push(`                        'length' => ${toPhpValue(pattern.length)},`);
      lines.push(`                        'luhn' => ${toPhpValue(pattern.luhn)},`);
      lines.push(`                        'cvvLength' => ${pattern.cvvLength},`);
      lines.push('                    ],');
    }
    lines.push('                ],');
    
    lines.push(`                'countries' => ${toPhpValue(b.countries)},`);
    lines.push(`                'metadata' => ${toPhpValue(b.metadata)},`);
    lines.push(`                'priorityOver' => ${toPhpValue(b.priorityOver)},`);
    
    // Bins
    lines.push('                \'bins\' => [');
    for (const bin of b.bins) {
      lines.push('                    [');
      lines.push(`                        'bin' => ${toPhpValue(bin.bin)},`);
      lines.push(`                        'type' => ${toPhpValue(bin.type)},`);
      lines.push(`                        'category' => ${toPhpValue(bin.category)},`);
      lines.push(`                        'issuer' => ${toPhpValue(bin.issuer)},`);
      lines.push(`                        'countries' => ${toPhpValue(bin.countries || [])},`);
      lines.push('                    ],');
    }
    lines.push('                ],');
    
    lines.push('            ],');
  }

  lines.push('        ];');
  lines.push('    }');
  lines.push('}', '');
  return lines.join('\n');
}

module.exports = {
  generatePhp,
  generatePhpDetailed,
};
