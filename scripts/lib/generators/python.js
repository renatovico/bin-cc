'use strict';

/**
 * Python code generators
 */

const { LANG_CONFIG, toNativeValue, extractSimplifiedBrand, extractDetailedBrand, fileHeader } = require('./utils');

const py = LANG_CONFIG.python;

/**
 * Generate Python native data file (simplified)
 */
function generatePython(brands) {
  const lines = [
    ...fileHeader('#'),
    '"""Credit card brand data."""',
    '',
    'from typing import List, TypedDict',
    '',
    '',
    'class Brand(TypedDict):',
    '    """Brand definition."""',
    '    name: str',
    '    priority_over: List[str]',
    '    regexp_bin: str',
    '    regexp_full: str',
    '    regexp_cvv: str',
    '',
    '',
    'BRANDS: List[Brand] = ['
  ];

  for (const brand of brands) {
    const b = extractSimplifiedBrand(brand);
    lines.push('    {');
    lines.push(`        "name": ${py.string(b.name)},`);
    lines.push(`        "priority_over": ${toNativeValue(b.priorityOver, 'python')},`);
    lines.push(`        "regexp_bin": ${py.rawString(b.regexpBin)},`);
    lines.push(`        "regexp_full": ${py.rawString(b.regexpFull)},`);
    lines.push(`        "regexp_cvv": ${py.rawString(b.regexpCvv)},`);
    lines.push('    },');
  }

  lines.push(']', '');
  return lines.join('\n');
}

/**
 * Generate Python native data file (detailed)
 * Loads bins from JSON at runtime to avoid huge source files
 */
function generatePythonDetailed(detailed) {
  const lines = [
    ...fileHeader('#'),
    '"""Credit card brand data (detailed). Loads bins from JSON at runtime."""',
    '',
    'import json',
    'import os',
    'from typing import Any, Dict, List',
    '',
    '',
    'def _load_json() -> List[Dict[str, Any]]:',
    '    """Load detailed brand data from JSON file."""',
    '    json_path = os.path.join(os.path.dirname(__file__), "cards-detailed.json")',
    '    with open(json_path, "r", encoding="utf-8") as f:',
    '        return json.load(f)',
    '',
    '',
    '# Lazy-loaded brands data',
    '_brands_cache: List[Dict[str, Any]] = []',
    '',
    '',
    'def get_brands() -> List[Dict[str, Any]]:',
    '    """Get detailed brand data (lazy-loaded from JSON)."""',
    '    global _brands_cache',
    '    if not _brands_cache:',
    '        _brands_cache = _load_json()',
    '    return _brands_cache',
    '',
    '',
    '# Module-level lazy property for backwards compatibility',
    'class _BrandsProxy(list):',
    '    """Proxy that loads data on first access."""',
    '    _loaded = False',
    '',
    '    def _ensure_loaded(self):',
    '        if not self._loaded:',
    '            self.extend(get_brands())',
    '            self._loaded = True',
    '',
    '    def __iter__(self):',
    '        self._ensure_loaded()',
    '        return super().__iter__()',
    '',
    '    def __len__(self):',
    '        self._ensure_loaded()',
    '        return super().__len__()',
    '',
    '    def __getitem__(self, key):',
    '        self._ensure_loaded()',
    '        return super().__getitem__(key)',
    '',
    '',
    'BRANDS = _BrandsProxy()',
    '',
  ];

  return lines.join('\n');
}

module.exports = {
  generatePython,
  generatePythonDetailed,
};
