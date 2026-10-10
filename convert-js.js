const fs = require('fs');

function convertScript(inputFile, outputFile) {
  let content = fs.readFileSync(inputFile, 'utf8');
  content = content.replace("import { auth, db } from './backend.js';", "import { auth, db } from './firebase/config';");
  
  // Replace only the FIRST occurrence of DOMContentLoaded
  content = content.replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/, 'export function initAll() {');
  
  // To replace the matching closing brace of DOMContentLoaded...
  // It's usually the very last `});` in the file. We can find the last `});` and replace it with `}`.
  let lastIndex = content.lastIndexOf('});');
  if (lastIndex !== -1) {
    content = content.substring(0, lastIndex) + '}' + content.substring(lastIndex + 3);
  }

  // Remove other top level event listeners if any, or just let them be inside initAll if we want, 
  // but actually the file has other functions outside DOMContentLoaded. Wait, no, usually the functions are defined outside.
  
  fs.writeFileSync(outputFile, content);
}

convertScript('legacy-vanilla/src/profile.js', 'src/lib/profile-legacy.ts');
convertScript('legacy-vanilla/src/admin.js', 'src/lib/admin-legacy.ts');
