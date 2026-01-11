'use strict';

const fs = require('fs');
const path = require('path');
const { SOURCES_DIR } = require('./config');

/**
 * Merge multiple source objects into one unified brand entry
 * Supports partial files that only contain bins or other optional data
 */
function mergeSources(sources, schemeName) {
  if (sources.length === 1) {
    return sources[0];
  }

  // Find the base source (one with patterns defined)
  const baseSources = sources.filter(s => s.patterns && s.patterns.length > 0);
  const base = baseSources[0] || sources[0];
  
  const merged = { 
    scheme: base.scheme || schemeName,
    brand: base.brand,
    type: base.type,
    countries: base.countries || []
  };

  // Deduplicate patterns by JSON key (only from sources that have patterns)
  const patternSet = new Set();
  merged.patterns = sources
    .filter(s => s.patterns)
    .flatMap(s => s.patterns)
    .filter(p => {
      const key = JSON.stringify(p);
      if (patternSet.has(key)) return false;
      patternSet.add(key);
      return true;
    });

  // Deduplicate bins by BIN number (first occurrence wins)
  const binSet = new Set();
  const allBins = sources
    .flatMap(s => s.bins || [])
    .filter(b => {
      if (binSet.has(b.bin)) return false;
      binSet.add(b.bin);
      return true;
    });

  if (allBins.length > 0) {
    merged.bins = allBins;
  }

  // Merge countries from all sources
  const allCountries = new Set(merged.countries);
  sources.forEach(s => {
    if (s.countries) s.countries.forEach(c => allCountries.add(c));
  });
  merged.countries = [...allCountries];

  return merged;
}

/**
 * Read a single source file
 */
function readSourceFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Read all sources from a directory
 */
function readSourceDirectory(dirPath, dirName) {
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json'))
    .sort();

  if (files.length === 0) return null;

  const sources = files.map(f => readSourceFile(path.join(dirPath, f)));
  const sourceFiles = files.map(f => `${dirName}/${f}`);

  return {
    source: mergeSources(sources, dirName),
    schemeName: dirName,
    sourceFiles
  };
}

/**
 * Read all source files and return parsed entries
 */
function readAllSources() {
  const entries = fs.readdirSync(SOURCES_DIR, { withFileTypes: true })
    .sort((a, b) => a.name.replace('.json', '').localeCompare(b.name.replace('.json', '')));

  const results = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const result = readSourceDirectory(path.join(SOURCES_DIR, entry.name), entry.name);
      if (result) results.push(result);
    } else if (entry.name.endsWith('.json')) {
      const source = readSourceFile(path.join(SOURCES_DIR, entry.name));
      results.push({
        source,
        schemeName: source.scheme,
        sourceFiles: [entry.name]
      });
    }
  }

  return results;
}

module.exports = {
  readAllSources,
  readSourceFile,
  readSourceDirectory,
  mergeSources
};
