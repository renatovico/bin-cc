#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { COMPILED_DIR, CARDS_FILE, DETAILED_FILE, BRANDS_MD_FILE, CONFLICTS_FILE, LIBS_DIR } = require('./lib/config');
const { readAllSources } = require('./lib/source-reader');
const { toDetailedFormat, toSimplifiedFormat } = require('./lib/transformers');
const { validateSources, validateCompiled } = require('./validate');
const {
  generateJavaScript,
  generateJavaScriptDetailed,
  generateTypeScriptDeclaration,
  generateTypeScriptDeclarationDetailed,
  generatePython,
  generatePythonDetailed,
  generateRuby,
  generateRubyDetailed,
  generateElixir,
  generateElixirDetailed,
  generateCSharp,
  generateCSharpDetailed,
  generateJava,
  generateJavaDetailed,
  generateRust,
  generateRustDetailed,
  generateGo,
  generateGoDetailed,
  generatePhp,
  generatePhpDetailed
} = require('./lib/generators/index');

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(COMPILED_DIR)) {
    fs.mkdirSync(COMPILED_DIR, { recursive: true });
  }
}

/**
 * Generate native data files for all libraries
 */
function generateNativeFiles(simplified, detailed) {
  console.log('\n📦 Generating native data files...');
  
  // JSON data for detailed brands (to be copied to each library)
  const detailedJson = JSON.stringify(detailed, null, 2);
  
  // JavaScript (simplified + detailed)
  const jsDataDir = path.join(LIBS_DIR, 'javascript', 'data');
  fs.mkdirSync(jsDataDir, { recursive: true });
  fs.writeFileSync(path.join(jsDataDir, 'brands.js'), generateJavaScript(simplified));
  fs.writeFileSync(path.join(jsDataDir, 'brands.d.ts'), generateTypeScriptDeclaration());
  fs.writeFileSync(path.join(jsDataDir, 'brands-detailed.js'), generateJavaScriptDetailed(detailed));
  fs.writeFileSync(path.join(jsDataDir, 'brands-detailed.d.ts'), generateTypeScriptDeclarationDetailed());
  console.log('  ✓ Generated libs/javascript/data/brands.js');
  console.log('  ✓ Generated libs/javascript/data/brands-detailed.js');
  
  // Python (simplified + detailed + JSON)
  const pyDataDir = path.join(LIBS_DIR, 'python', 'creditcard_identifier');
  fs.mkdirSync(pyDataDir, { recursive: true });
  fs.writeFileSync(path.join(pyDataDir, 'brands.py'), generatePython(simplified));
  fs.writeFileSync(path.join(pyDataDir, 'brands_detailed.py'), generatePythonDetailed(detailed));
  fs.writeFileSync(path.join(pyDataDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/python/creditcard_identifier/brands.py');
  console.log('  ✓ Generated libs/python/creditcard_identifier/brands_detailed.py + JSON');
  
  // Ruby (simplified + detailed + JSON)
  const rbLibDir = path.join(LIBS_DIR, 'ruby', 'lib', 'creditcard_identifier');
  fs.mkdirSync(rbLibDir, { recursive: true });
  fs.writeFileSync(path.join(rbLibDir, 'brands.rb'), generateRuby(simplified));
  fs.writeFileSync(path.join(rbLibDir, 'brands_detailed.rb'), generateRubyDetailed(detailed));
  fs.writeFileSync(path.join(rbLibDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/ruby/lib/creditcard_identifier/brands.rb');
  console.log('  ✓ Generated libs/ruby/lib/creditcard_identifier/brands_detailed.rb + JSON');
  
  // Elixir (simplified + detailed + JSON in priv)
  const exLibDir = path.join(LIBS_DIR, 'elixir', 'lib', 'creditcard_identifier');
  const exPrivDir = path.join(LIBS_DIR, 'elixir', 'priv');
  fs.mkdirSync(exLibDir, { recursive: true });
  fs.mkdirSync(exPrivDir, { recursive: true });
  fs.writeFileSync(path.join(exLibDir, 'data.ex'), generateElixir(simplified));
  fs.writeFileSync(path.join(exLibDir, 'data_detailed.ex'), generateElixirDetailed(detailed));
  fs.writeFileSync(path.join(exPrivDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/elixir/lib/creditcard_identifier/data.ex');
  console.log('  ✓ Generated libs/elixir/lib/creditcard_identifier/data_detailed.ex + JSON');
  
  // C# (simplified + detailed + JSON as embedded resource)
  const csDir = path.join(LIBS_DIR, 'dotnet', 'CreditCardIdentifier');
  fs.mkdirSync(csDir, { recursive: true });
  fs.writeFileSync(path.join(csDir, 'BrandData.cs'), generateCSharp(simplified));
  fs.writeFileSync(path.join(csDir, 'BrandDataDetailed.cs'), generateCSharpDetailed(detailed));
  fs.writeFileSync(path.join(csDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/dotnet/CreditCardIdentifier/BrandData.cs');
  console.log('  ✓ Generated libs/dotnet/CreditCardIdentifier/BrandDataDetailed.cs + JSON');
  
  // Java (simplified + detailed + JSON in resources)
  const javaDir = path.join(LIBS_DIR, 'java', 'src', 'main', 'java', 'br', 'com', 's2n', 'creditcard', 'identifier');
  const javaResourcesDir = path.join(LIBS_DIR, 'java', 'src', 'main', 'resources');
  fs.mkdirSync(javaDir, { recursive: true });
  fs.mkdirSync(javaResourcesDir, { recursive: true });
  fs.writeFileSync(path.join(javaDir, 'BrandData.java'), generateJava(simplified));
  fs.writeFileSync(path.join(javaDir, 'BrandDataDetailed.java'), generateJavaDetailed(detailed));
  fs.writeFileSync(path.join(javaResourcesDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/java/src/main/java/br/com/s2n/creditcard/identifier/BrandData.java');
  console.log('  ✓ Generated libs/java/src/main/java/br/com/s2n/creditcard/identifier/BrandDataDetailed.java + JSON');
  
  // Rust (simplified + detailed + JSON in src)
  const rustDir = path.join(LIBS_DIR, 'rust', 'src');
  fs.mkdirSync(rustDir, { recursive: true });
  fs.writeFileSync(path.join(rustDir, 'brands.rs'), generateRust(simplified));
  fs.writeFileSync(path.join(rustDir, 'brands_detailed.rs'), generateRustDetailed(detailed));
  fs.writeFileSync(path.join(rustDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/rust/src/brands.rs');
  console.log('  ✓ Generated libs/rust/src/brands_detailed.rs + JSON');
  
  // Go (simplified + detailed + JSON embedded)
  const goDir = path.join(LIBS_DIR, 'go');
  fs.mkdirSync(goDir, { recursive: true });
  fs.writeFileSync(path.join(goDir, 'brands.go'), generateGo(simplified));
  fs.writeFileSync(path.join(goDir, 'brands_detailed.go'), generateGoDetailed(detailed));
  fs.writeFileSync(path.join(goDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/go/brands.go');
  console.log('  ✓ Generated libs/go/brands_detailed.go + JSON');
  
  // PHP (simplified + detailed + JSON)
  const phpDir = path.join(LIBS_DIR, 'php', 'src');
  fs.mkdirSync(phpDir, { recursive: true });
  fs.writeFileSync(path.join(phpDir, 'BrandData.php'), generatePhp(simplified));
  fs.writeFileSync(path.join(phpDir, 'BrandDataDetailed.php'), generatePhpDetailed(detailed));
  fs.writeFileSync(path.join(phpDir, 'cards-detailed.json'), detailedJson);
  console.log('  ✓ Generated libs/php/src/BrandData.php');
  console.log('  ✓ Generated libs/php/src/BrandDataDetailed.php + JSON');
}

/**
 * Write JSON file
 */
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Generate markdown table of supported brands
 */
function generateBrandsMd(detailed) {
  const lines = [
    '# Supported Card Brands',
    '',
    'This file is auto-generated by `npm run build`.',
    '',
    '| Brand | Starts with | Lengths | CVV | Official |',
    '| ----- | ----------- | ------- | --- | -------- |'
  ];

  for (const card of detailed) {
    const bins = card.patterns.map(p => p.bin.replace(/^\^/, '').replace(/\[.*?\]/g, 'X')).join(', ');
    const lengths = card.number.lengths.join(', ');
    const official = card.unofficial ? '❌' : '✅';
    lines.push(`| ${card.brand} | ${bins} | ${lengths} | ${card.cvv.length} | ${official} |`);
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Sort brands based on priorityOver relationships
 * If A has priorityOver: ["B"], then A comes before B
 */
function sortByPriority(items, getScheme, getPriorityOver) {
  // Build a map of scheme -> items that should come before it
  const mustComeBefore = new Map(); // scheme -> Set of schemes that must come before it
  
  for (const item of items) {
    const scheme = getScheme(item);
    const priorityOver = getPriorityOver(item) || [];
    
    for (const other of priorityOver) {
      if (!mustComeBefore.has(other)) {
        mustComeBefore.set(other, new Set());
      }
      mustComeBefore.get(other).add(scheme);
    }
  }
  
  // Sort: items with no dependencies first, then by how many depend on them
  return [...items].sort((a, b) => {
    const schemeA = getScheme(a);
    const schemeB = getScheme(b);
    
    // Check if A must come before B
    const bDeps = mustComeBefore.get(schemeB) || new Set();
    if (bDeps.has(schemeA)) return -1;
    
    // Check if B must come before A
    const aDeps = mustComeBefore.get(schemeA) || new Set();
    if (aDeps.has(schemeB)) return 1;
    
    // No direct relationship - sort by number of schemes that depend on them
    const aScore = mustComeBefore.get(schemeA)?.size || 0;
    const bScore = mustComeBefore.get(schemeB)?.size || 0;
    
    // More dependencies = more general = should come later
    return aScore - bScore;
  });
}

/**
 * Build compiled data from sources
 */
function build() {
  console.log('🔨 Building bin-cc data...\n');

  ensureOutputDir();

  const sources = readAllSources();
  let detailed = [];
  let simplified = [];

  for (const { source, schemeName, sourceFiles } of sources) {
    console.log(`  ✓ Processing ${source.brand} (${schemeName})`);

    detailed.push(toDetailedFormat(source, schemeName, sourceFiles));
    simplified.push(toSimplifiedFormat(source, schemeName));
  }

  // Sort by priorityOver relationships - more specific patterns first
  detailed = sortByPriority(detailed, d => d.scheme, d => d.priorityOver);
  simplified = sortByPriority(simplified, s => s.name, s => s.priorityOver);

  writeJson(DETAILED_FILE, detailed);
  console.log(`\n✅ Detailed data written to: ${path.relative(process.cwd(), DETAILED_FILE)}`);

  writeJson(CARDS_FILE, simplified);
  console.log(`✅ Simplified data written to: ${path.relative(process.cwd(), CARDS_FILE)}`);

  fs.writeFileSync(BRANDS_MD_FILE, generateBrandsMd(detailed));
  console.log(`✅ Brands markdown written to: ${path.relative(process.cwd(), BRANDS_MD_FILE)}`);

  console.log(`\n📊 Statistics:`);
  console.log(`   Total brands: ${detailed.length}`);

  // Generate native data files for each language
  generateNativeFiles(simplified, detailed);

  return { detailed, simplified };
}

// CLI execution
if (require.main === module) {
  try {
    console.log('');

    // Validate sources first
    if (!validateSources()) {
      console.error('\n❌ Build aborted due to validation errors\n');
      process.exit(1);
    }

    // Build
    const { detailed } = build();

    // Validate compiled output
    const { valid, conflicts } = validateCompiled(detailed);
    
    // Write conflicts to file
    if (conflicts && conflicts.length > 0) {
      writeJson(CONFLICTS_FILE, {
        generated: new Date().toISOString(),
        total: conflicts.length,
        conflicts
      });
      console.log(`⚠️  Conflicts written to: ${path.relative(process.cwd(), CONFLICTS_FILE)}`);
    }
    
    if (!valid) {
      console.error('\n❌ Build produced invalid output\n');
      process.exit(1);
    }

    console.log('\n✨ Build completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { build };
