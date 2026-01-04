#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const COMPILED_DIR = path.join(DATA_DIR, 'compiled');
const COMPILED_FILE = path.join(COMPILED_DIR, 'brands.json');
const LEGACY_FILE = path.join(DATA_DIR, 'brands.json');
const GITHUB_API_URL = 'https://api.github.com/repos/renatovico/bin-cc/releases';

/**
 * Download data from GitHub releases
 */
function downloadData() {
  console.log('📥 Downloading latest credit card BIN data from GitHub releases...');
  
  return new Promise((resolve, reject) => {
    // First, get the latest data release
    https.get(GITHUB_API_URL, {
      headers: {
        'User-Agent': 'creditcard-identifier'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const releases = JSON.parse(data);
          
          // Find the latest data release (tag starts with 'data-v')
          const dataRelease = releases.find(r => r.tag_name.startsWith('data-v'));
          
          if (!dataRelease) {
            reject(new Error('No data releases found'));
            return;
          }
          
          console.log(`   Found data release: ${dataRelease.tag_name}`);
          
          // Try to find the compiled/brands.json asset (new format)
          const compiledAsset = dataRelease.assets.find(a => a.name === 'compiled-brands.json');
          
          // Fall back to legacy brands.json if compiled format not available
          const legacyAsset = dataRelease.assets.find(a => a.name === 'brands.json');
          
          if (compiledAsset) {
            // Download new compiled format
            console.log('   Downloading compiled format (new schema)...');
            downloadFile(compiledAsset.browser_download_url, COMPILED_FILE)
              .then(() => {
                console.log(`✅ Compiled data downloaded successfully to ${COMPILED_FILE}`);
                resolve();
              })
              .catch(reject);
          } else if (legacyAsset) {
            // Download legacy format
            console.log('   Downloading legacy format...');
            downloadFile(legacyAsset.browser_download_url, LEGACY_FILE)
              .then(() => {
                console.log(`✅ Legacy data downloaded successfully to ${LEGACY_FILE}`);
                resolve();
              })
              .catch(reject);
          } else {
            reject(new Error('No data files found in release assets'));
          }
          
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download a file from URL
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Ensure data directory exists
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const file = fs.createWriteStream(dest);
    
    https.get(url, {
      headers: {
        'User-Agent': 'creditcard-identifier',
        'Accept': 'application/octet-stream'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file on error
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

/**
 * Check if data needs to be downloaded
 */
function checkDataExists() {
  return fs.existsSync(COMPILED_FILE) || fs.existsSync(LEGACY_FILE);
}

// Run if executed directly
if (require.main === module) {
  if (!checkDataExists()) {
    downloadData()
      .then(() => {
        console.log('✨ Setup complete!');
        process.exit(0);
      })
      .catch((err) => {
        console.error('❌ Failed to download data:', err.message);
        process.exit(1);
      });
  } else {
    console.log('✓ Data already exists');
    process.exit(0);
  }
}

module.exports = {
  downloadData,
  checkDataExists,
  COMPILED_FILE,
  LEGACY_FILE
};
