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
 * Loads bins from JSON at runtime to avoid huge source files
 */
function generateJavaDetailed(detailed) {
  const lines = [
    '// ' + fileHeader('//')[0].substring(3),
    '// ' + fileHeader('//')[1].substring(3),
    '',
    'package br.com.s2n.creditcard.identifier;',
    '',
    'import com.google.gson.Gson;',
    'import com.google.gson.reflect.TypeToken;',
    '',
    'import java.io.InputStream;',
    'import java.io.InputStreamReader;',
    'import java.lang.reflect.Type;',
    'import java.nio.charset.StandardCharsets;',
    'import java.util.List;',
    'import java.util.Map;',
    '',
    '/**',
    ' * Credit card brand data (detailed).',
    ' * Loads bins from JSON at runtime to handle large data efficiently.',
    ' */',
    'public class BrandDataDetailed {',
    '',
    '    public static class Pattern {',
    '        public String bin;',
    '        public int[] length;',
    '        public boolean luhn;',
    '        public int cvvLength;',
    '    }',
    '',
    '    public static class Bin {',
    '        public String bin;',
    '        public String type;',
    '        public String category;',
    '        public String issuer;',
    '        public String[] countries;',
    '    }',
    '',
    '    public static class Number {',
    '        public int[] lengths;',
    '        public boolean luhn;',
    '    }',
    '',
    '    public static class Cvv {',
    '        public int length;',
    '    }',
    '',
    '    public static class BrandDetailed {',
    '        public String scheme;',
    '        public String brand;',
    '        public String type;',
    '        public Number number;',
    '        public Cvv cvv;',
    '        public List<Pattern> patterns;',
    '        public String[] countries;',
    '        public Map<String, Object> metadata;',
    '        public String[] priorityOver;',
    '        public List<Bin> bins;',
    '    }',
    '',
    '    private static List<BrandDetailed> brandsCache = null;',
    '',
    '    /**',
    '     * Get all detailed brand data (lazy-loaded from JSON).',
    '     */',
    '    public static synchronized List<BrandDetailed> getBrands() {',
    '        if (brandsCache == null) {',
    '            brandsCache = loadBrandsFromJson();',
    '        }',
    '        return brandsCache;',
    '    }',
    '',
    '    private static List<BrandDetailed> loadBrandsFromJson() {',
    '        try (InputStream is = BrandDataDetailed.class.getResourceAsStream("/cards-detailed.json");',
    '             InputStreamReader reader = new InputStreamReader(is, StandardCharsets.UTF_8)) {',
    '            Gson gson = new Gson();',
    '            Type listType = new TypeToken<List<BrandDetailed>>(){}.getType();',
    '            return gson.fromJson(reader, listType);',
    '        } catch (Exception e) {',
    '            throw new RuntimeException("Failed to load cards-detailed.json", e);',
    '        }',
    '    }',
    '}',
    '',
  ];

  return lines.join('\n');
}

module.exports = {
  generateJava,
  generateJavaDetailed,
};
