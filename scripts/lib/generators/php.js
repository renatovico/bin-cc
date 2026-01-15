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
 * Loads bins from JSON at runtime to avoid huge source files
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
    ' * Loads bins from JSON at runtime to handle large data efficiently.',
    ' */',
    'class BrandDataDetailed',
    '{',
    '    private static ?array $brandsCache = null;',
    '',
    '    /**',
    '     * Get all detailed brand data (lazy-loaded from JSON).',
    '     * @return array<array>',
    '     */',
    '    public static function getBrands(): array',
    '    {',
    '        if (self::$brandsCache === null) {',
    '            self::$brandsCache = self::loadFromJson();',
    '        }',
    '        return self::$brandsCache;',
    '    }',
    '',
    '    private static function loadFromJson(): array',
    '    {',
    '        $jsonPath = __DIR__ . \'/cards-detailed.json\';',
    '        $json = file_get_contents($jsonPath);',
    '        if ($json === false) {',
    '            throw new \\RuntimeException(\'Failed to read cards-detailed.json\');',
    '        }',
    '        $data = json_decode($json, true);',
    '        if ($data === null) {',
    '            throw new \\RuntimeException(\'Failed to parse cards-detailed.json\');',
    '        }',
    '        return $data;',
    '    }',
    '}',
    '',
  ];

  return lines.join('\n');
}

module.exports = {
  generatePhp,
  generatePhpDetailed,
};
