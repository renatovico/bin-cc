'use strict';

/**
 * Extract metadata from source patterns
 */
function extractPatternMetadata(patterns) {
  return {
    binPattern: patterns.map(p => p.bin).join('|'),
    lengths: [...new Set(patterns.flatMap(p => Array.isArray(p.length) ? p.length : [p.length]))],
    cvvLength: patterns[0].cvvLength
  };
}

/**
 * Build a full validation regex from patterns
 */
function buildFullPattern(patterns) {
  const parts = patterns.map(pattern => {
    const lengths = Array.isArray(pattern.length) ? pattern.length : [pattern.length];
    const binPart = pattern.bin.replace(/\^/g, '');
    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);
    const minRemaining = minLength - 6;
    const maxRemaining = maxLength - 1;

    if (minRemaining === maxRemaining) {
      return `${binPart}[0-9]{${minRemaining}}`;
    }
    if (minRemaining < maxRemaining) {
      return `${binPart}[0-9]{${minRemaining},${maxRemaining}}`;
    }
    return null;
  }).filter(Boolean);

  return `^(${parts.join('|')})$`;
}

/**
 * Standard fields in source schema (used to detect custom properties)
 */
const STANDARD_SOURCE_FIELDS = ['scheme', 'brand', 'patterns', 'type', 'countries', 'bins'];
const STANDARD_BIN_FIELDS = ['bin', 'type', 'category', 'issuer', 'countries'];

/**
 * Transform source to detailed format
 */
function toDetailedFormat(source, schemeName, sourceFiles) {
  const metadata = extractPatternMetadata(source.patterns);

  const detailed = {
    scheme: schemeName,
    brand: source.brand,
    type: source.type || 'credit',
    number: {
      lengths: metadata.lengths,
      luhn: source.patterns[0].luhn
    },
    cvv: {
      length: metadata.cvvLength
    },
    patterns: source.patterns,
    countries: source.countries || [],
    metadata: {
      sourceFile: sourceFiles.length === 1 ? sourceFiles[0] : sourceFiles
    },
    // Spread any custom properties from source
    ...Object.fromEntries(
      Object.entries(source).filter(([k]) => !STANDARD_SOURCE_FIELDS.includes(k))
    )
  };

  if (source.bins?.length > 0) {
    detailed.bins = source.bins.map(b => ({
      bin: b.bin,
      type: b.type || null,
      category: b.category || null,
      issuer: b.issuer || null,
      countries: b.countries || null,
      // Spread any custom properties from bin
      ...Object.fromEntries(
        Object.entries(b).filter(([k]) => !STANDARD_BIN_FIELDS.includes(k))
      )
    }));
  }

  return detailed;
}

/**
 * Transform source to simplified format
 */
function toSimplifiedFormat(source, schemeName) {
  const metadata = extractPatternMetadata(source.patterns);

  return {
    name: schemeName,
    regexpBin: metadata.binPattern,
    regexpFull: buildFullPattern(source.patterns),
    regexpCvv: `^\\d{${metadata.cvvLength}}$`
  };
}

module.exports = {
  extractPatternMetadata,
  buildFullPattern,
  toDetailedFormat,
  toSimplifiedFormat
};
