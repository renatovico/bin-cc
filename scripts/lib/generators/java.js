'use strict';

/**
 * Java code generators
 */

const { toNativeValue, extractSimplifiedBrand, extractDetailedBrand, fileHeader } = require('./utils');

// Java-specific configuration
const java = {
  null: 'null',
  true: 'true',
  false: 'false',
  string: (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`,
  intArray: (items) => items.length > 0 ? `new int[] { ${items.join(', ')} }` : 'new int[0]',
  stringArray: (items) => items.length > 0 ? `new String[] { ${items.join(', ')} }` : 'new String[0]',
};

/**
 * Convert value to Java literal
 */
function toJavaValue(val) {
  if (val === null || val === undefined) return java.null;
  if (val === true) return java.true;
  if (val === false) return java.false;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return java.string(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return 'new String[0]';
    if (typeof val[0] === 'number') return java.intArray(val);
    return java.stringArray(val.map(v => toJavaValue(v)));
  }
  return String(val);
}

/**
 * Generate Java native data file (simplified)
 */
function generateJava(brands) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'package br.com.s2n.creditcard.identifier;',
    '',
    'import java.util.ArrayList;',
    'import java.util.List;',
    '',
    '/**',
    ' * Credit card brand data (simplified).',
    ' */',
    'public class BrandData {',
    '',
    '    public static class Brand {',
    '        public final String name;',
    '        public final String[] priorityOver;',
    '        public final String regexpBin;',
    '        public final String regexpFull;',
    '        public final String regexpCvv;',
    '',
    '        public Brand(String name, String[] priorityOver, String regexpBin, String regexpFull, String regexpCvv) {',
    '            this.name = name;',
    '            this.priorityOver = priorityOver;',
    '            this.regexpBin = regexpBin;',
    '            this.regexpFull = regexpFull;',
    '            this.regexpCvv = regexpCvv;',
    '        }',
    '    }',
    '',
    '    public static final List<Brand> BRANDS = new ArrayList<Brand>() {{',
  ];

  for (const brand of brands) {
    const b = extractSimplifiedBrand(brand);
    lines.push(`        add(new Brand(${toJavaValue(b.name)}, ${toJavaValue(b.priorityOver)}, ${toJavaValue(b.regexpBin)}, ${toJavaValue(b.regexpFull)}, ${toJavaValue(b.regexpCvv)}));`);
  }

  lines.push('    }};', '}', '');
  return lines.join('\n');
}

/**
 * Generate Java native data file (detailed)
 */
function generateJavaDetailed(detailed) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'package br.com.s2n.creditcard.identifier;',
    '',
    'import java.util.ArrayList;',
    'import java.util.HashMap;',
    'import java.util.List;',
    'import java.util.Map;',
    '',
    '/**',
    ' * Credit card brand data (detailed).',
    ' */',
    'public class BrandDataDetailed {',
    '',
    '    public static class Pattern {',
    '        public final String bin;',
    '        public final int[] length;',
    '        public final boolean luhn;',
    '        public final int cvvLength;',
    '',
    '        public Pattern(String bin, int[] length, boolean luhn, int cvvLength) {',
    '            this.bin = bin;',
    '            this.length = length;',
    '            this.luhn = luhn;',
    '            this.cvvLength = cvvLength;',
    '        }',
    '    }',
    '',
    '    public static class Bin {',
    '        public final String bin;',
    '        public final String type;',
    '        public final String category;',
    '        public final String issuer;',
    '        public final String[] countries;',
    '',
    '        public Bin(String bin, String type, String category, String issuer, String[] countries) {',
    '            this.bin = bin;',
    '            this.type = type;',
    '            this.category = category;',
    '            this.issuer = issuer;',
    '            this.countries = countries;',
    '        }',
    '    }',
    '',
    '    public static class BrandDetailed {',
    '        public final String scheme;',
    '        public final String brand;',
    '        public final String type;',
    '        public final int[] numberLengths;',
    '        public final boolean numberLuhn;',
    '        public final int cvvLength;',
    '        public final List<Pattern> patterns;',
    '        public final String[] countries;',
    '        public final Map<String, Object> metadata;',
    '        public final String[] priorityOver;',
    '        public final List<Bin> bins;',
    '',
    '        public BrandDetailed(String scheme, String brand, String type, int[] numberLengths, boolean numberLuhn,',
    '                            int cvvLength, List<Pattern> patterns, String[] countries, Map<String, Object> metadata,',
    '                            String[] priorityOver, List<Bin> bins) {',
    '            this.scheme = scheme;',
    '            this.brand = brand;',
    '            this.type = type;',
    '            this.numberLengths = numberLengths;',
    '            this.numberLuhn = numberLuhn;',
    '            this.cvvLength = cvvLength;',
    '            this.patterns = patterns;',
    '            this.countries = countries;',
    '            this.metadata = metadata;',
    '            this.priorityOver = priorityOver;',
    '            this.bins = bins;',
    '        }',
    '    }',
    '',
    '    public static final List<BrandDetailed> BRANDS = new ArrayList<BrandDetailed>() {{',
  ];

  for (let i = 0; i < detailed.length; i++) {
    const b = extractDetailedBrand(detailed[i]);
    
    // Patterns - use unique variable name
    lines.push(`        List<Pattern> patterns${i} = new ArrayList<Pattern>() {{`);
    for (const pattern of b.patterns) {
      lines.push(`            add(new Pattern(${toJavaValue(pattern.bin)}, ${toJavaValue(pattern.length)}, ${toJavaValue(pattern.luhn)}, ${pattern.cvvLength}));`);
    }
    lines.push('        }};');
    
    // Bins - use unique variable name
    lines.push(`        List<Bin> bins${i} = new ArrayList<Bin>() {{`);
    for (const bin of b.bins) {
      lines.push(`            add(new Bin(${toJavaValue(bin.bin)}, ${toJavaValue(bin.type)}, ${toJavaValue(bin.category)}, ${toJavaValue(bin.issuer)}, ${toJavaValue(bin.countries || [])}));`);
    }
    lines.push('        }};');
    
    // Metadata - use unique variable name
    lines.push(`        Map<String, Object> metadata${i} = new HashMap<>();`);
    for (const [key, value] of Object.entries(b.metadata)) {
      lines.push(`        metadata${i}.put(${toJavaValue(key)}, ${toJavaValue(value)});`);
    }
    
    lines.push(`        add(new BrandDetailed(${toJavaValue(b.scheme)}, ${toJavaValue(b.brand)}, ${toJavaValue(b.type)}, ${toJavaValue(b.number.lengths)}, ${toJavaValue(b.number.luhn)}, ${b.cvv.length}, patterns${i}, ${toJavaValue(b.countries)}, metadata${i}, ${toJavaValue(b.priorityOver)}, bins${i}));`);
  }

  lines.push('    }};', '}', '');
  return lines.join('\n');
}

module.exports = {
  generateJava,
  generateJavaDetailed,
};
