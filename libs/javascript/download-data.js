#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'brands.json');
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
          
          // Find the brands.json asset
          const asset = dataRelease.assets.find(a => a.name === 'brands.json');
          
          if (!asset) {
            reject(new Error('brands.json not found in release assets'));
            return;
          }
          
          // Download the asset
          downloadFile(asset.browser_download_url, DATA_FILE)
            .then(() => {
              console.log(`✅ Data downloaded successfully to ${DATA_FILE}`);
              resolve();
            })
            .catch(reject);
          
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
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
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
  return fs.existsSync(DATA_FILE);
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
  DATA_FILE
};
