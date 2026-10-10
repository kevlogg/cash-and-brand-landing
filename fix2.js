const fs = require('fs');

// Fix page.tsx xmlns duplicate
let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
pageContent = pageContent.replace(/xmlns="http:\/\/www.w3.org\/2000\/svg" xmlns="http:\/\/www.w3.org\/2000\/svg"/g, 'xmlns="http://www.w3.org/2000/svg"');
fs.writeFileSync('src/app/page.tsx', pageContent);

// Fix admin/page.tsx colspan
let adminContent = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
adminContent = adminContent.replace(/colspan=/g, 'colSpan=');
fs.writeFileSync('src/app/admin/page.tsx', adminContent);

// Rename .ts to .js
try { fs.renameSync('src/lib/main-legacy.ts', 'src/lib/main-legacy.js'); } catch(e){}
try { fs.renameSync('src/lib/profile-legacy.ts', 'src/lib/profile-legacy.js'); } catch(e){}
try { fs.renameSync('src/lib/admin-legacy.ts', 'src/lib/admin-legacy.js'); } catch(e){}
