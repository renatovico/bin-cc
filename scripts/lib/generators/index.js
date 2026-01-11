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
  // Utilities (exported for testing)
  toNativeValue,
  LANG_CONFIG,
  extractSimplifiedBrand,
  extractDetailedBrand,
};
