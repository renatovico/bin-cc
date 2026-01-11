'use strict';

/**
 * Code generators for native data files in each language
 * 
 * This module re-exports all generators from individual language modules.
 */

const { LANG_CONFIG, toNativeValue, extractSimplifiedBrand, extractDetailedBrand } = require('./utils');
const { generateJavaScript, generateJavaScriptDetailed, generateTypeScriptDeclaration, generateTypeScriptDeclarationDetailed } = require('./javascript');
const { generatePython, generatePythonDetailed } = require('./python');
const { generateRuby, generateRubyDetailed } = require('./ruby');
const { generateElixir, generateElixirDetailed } = require('./elixir');
const { generateCSharp, generateCSharpDetailed } = require('./csharp');
const { generateJava, generateJavaDetailed } = require('./java');
const { generateRust, generateRustDetailed } = require('./rust');
const { generateGo, generateGoDetailed } = require('./go');
const { generatePhp, generatePhpDetailed } = require('./php');

module.exports = {
  // JavaScript/TypeScript
  generateJavaScript,
  generateJavaScriptDetailed,
  generateTypeScriptDeclaration,
  generateTypeScriptDeclarationDetailed,
  // Python
  generatePython,
  generatePythonDetailed,
  // Ruby
  generateRuby,
  generateRubyDetailed,
  // Elixir
  generateElixir,
  generateElixirDetailed,
  // C#
  generateCSharp,
  generateCSharpDetailed,
  // Java
  generateJava,
  generateJavaDetailed,
  // Rust
  generateRust,
  generateRustDetailed,
  // Go
  generateGo,
  generateGoDetailed,
  // PHP
  generatePhp,
  generatePhpDetailed,
  // Utilities (exported for testing)
  toNativeValue,
  LANG_CONFIG,
  extractSimplifiedBrand,
  extractDetailedBrand,
};
