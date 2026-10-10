const fs = require('fs');

['src/app/page.tsx', 'src/app/profile/page.tsx', 'src/app/admin/page.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
  fs.writeFileSync(file, content);
});

let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace(/@import url\('[^']+'\);\r?\n?/g, '');
css = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');\n` + css;
fs.writeFileSync('src/app/globals.css', css);
