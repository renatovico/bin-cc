'use strict';

const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const SOURCES_DIR = path.join(ROOT_DIR, 'data/sources');
const COMPILED_DIR = path.join(ROOT_DIR, 'data/compiled');
const LIBS_DIR = path.join(ROOT_DIR, 'libs');

module.exports = {
  ROOT_DIR,
  SOURCES_DIR,
  COMPILED_DIR,
  LIBS_DIR,
  CARDS_FILE: path.join(COMPILED_DIR, 'cards.json'),
  DETAILED_FILE: path.join(COMPILED_DIR, 'cards-detailed.json'),
  BRANDS_MD_FILE: path.join(COMPILED_DIR, 'BRANDS.md'),
  CONFLICTS_FILE: path.join(COMPILED_DIR, 'conflicts.json')
};
