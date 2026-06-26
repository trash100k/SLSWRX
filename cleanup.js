const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/components', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    content = content.replace(/bg-black/g, 'bg-transparent');
    content = content.replace(/font-pixel/g, 'font-sans');
    content = content.replace(/text-shadow-pixel/g, '');
    
    // Also change buttons text from text-[10px] etc to normal sizing if we want, but let's stick to cleaning up the pixel stuff.
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filePath}`);
    }
  }
});
console.log('Done!');
