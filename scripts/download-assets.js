/* eslint-disable */
const fs = require('fs');
const path = require('path');
const https = require('https');

const CDN_BASE = 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';
const TARGET_DIR = path.join(__dirname, '../public/assets/models/imgly');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading resources.json...');
  const resourcesPath = path.join(TARGET_DIR, 'resources.json');
  await downloadFile(CDN_BASE + 'resources.json', resourcesPath);
  
  const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
  const keys = Object.keys(resources);
  
  for (const key of keys) {
    const entry = resources[key];
    console.log(`Processing resource: ${key}...`);
    for (const chunk of entry.chunks) {
      const chunkDest = path.join(TARGET_DIR, chunk.name);
      if (fs.existsSync(chunkDest) && fs.statSync(chunkDest).size > 0) {
        console.log(`Chunk ${chunk.name} already exists. Skipping.`);
        continue;
      }
      console.log(`Downloading chunk ${chunk.name}...`);
      await downloadFile(CDN_BASE + chunk.name, chunkDest);
    }
  }
  console.log('All assets downloaded successfully!');
}

main().catch(console.error);
