'use strict';

/**
 * Extract metadata from source patterns
 * Simple approach: just concat all bins with |
 */
function extractPatternMetadata(patterns) {
  // Collect all unique lengths
  const lengths = [...new Set(patterns.flatMap(p => 
    Array.isArray(p.length) ? p.length : [p.length]
  ))].sort((a, b) => a - b);
  
  // Concat all bin patterns (strip ^ prefix, will add back at start)
  const allBins = patterns
    .map(p => p.bin.replace(/^\^/, ''))
    .flatMap(bin => bin.split('|').map(b => b.replace(/^\^/, ''))) // flatten nested |
    .join('|');
  
  return {
    binPattern: `^(${allBins})`,
    lengths,
    cvvLength: patterns[0].cvvLength
  };
}

/**
 * Build full validation regex
 * Simple approach: bin pattern + digits, with length boundaries
 */
function buildFullPattern(patterns) {
  // Get all bins (flatten alternatives)
  const allBins = patterns
    .map(p => p.bin.replace(/^\^/, ''))
    .flatMap(bin => bin.split('|').map(b => b.replace(/^\^/, '')))
    .join('|');
  
  // Get length range
  const allLengths = [...new Set(patterns.flatMap(p => 
    Array.isArray(p.length) ? p.length : [p.length]
  ))];
  
  const minLen = Math.min(...allLengths);
  const maxLen = Math.max(...allLengths);
  
  // Build pattern: ^(bin)[0-9]*$ 
  // The consumer should also check .length is within [minLen, maxLen]
  // But we can add a basic length constraint using lookahead
  if (minLen === maxLen) {
    return `^(?=.{${minLen}}$)(?:${allBins})[0-9]*$`;
  }
  return `^(?=.{${minLen},${maxLen}}$)(?:${allBins})[0-9]*$`;
}

/**
 * Standard fields in source schema (used to detect custom properties)
 */
const STANDARD_SOURCE_FIELDS = ['scheme', 'brand', 'patterns', 'type', 'countries', 'bins', 'priorityOver'];
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
    priorityOver: source.priorityOver || [],
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
    priorityOver: source.priorityOver || [],
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
