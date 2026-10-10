const fs = require('fs');
const path = require('path');

function convertHtmlToJsx(htmlFile, outputFile, jsFileRef) {
  let html = fs.readFileSync(htmlFile, 'utf8');

  let bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
  if (!bodyMatch) process.exit(1);
  let bodyContent = bodyMatch[1];

  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  bodyContent = bodyContent.replace(/class=/g, 'className=');

  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
    let rules = p1.split(';').filter(r => r.trim());
    let styleObj = rules.map(r => {
      let [key, ...valParts] = r.split(':');
      let val = valParts.join(':');
      if (!val) return '';
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      return `'${key}': '${val.trim()}'`;
    }).filter(Boolean).join(', ');
    return `style={{${styleObj}}}`;
  });

  bodyContent = bodyContent.replace(/<(img|input|hr|br|path|circle|source)([^>]*[^\/])>/g, '<$1$2 />');
  bodyContent = bodyContent.replace(/<svg ([^>]*)>/g, '<svg $1 xmlns="http://www.w3.org/2000/svg">');

  bodyContent = bodyContent.replace(/viewbox/gi, 'viewBox');
  bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');
  bodyContent = bodyContent.replace(/stroke-linecap/g, 'strokeLinecap');
  bodyContent = bodyContent.replace(/stroke-linejoin/g, 'strokeLinejoin');

  let importLine = jsFileRef ? `import { initAll } from '@/lib/${jsFileRef}';` : '';
  let effectLine = jsFileRef ? `  useEffect(() => {\n    initAll();\n  }, []);` : '';

  let jsx = `"use client";
import { useEffect } from 'react';
${importLine}

export default function Page() {
${effectLine}
  return (
    <>
      ${bodyContent}
    </>
  );
}
`;
  
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, jsx);
}

convertHtmlToJsx('legacy-vanilla/profile.html', 'src/app/profile/page.tsx', 'profile-legacy');
convertHtmlToJsx('legacy-vanilla/admin.html', 'src/app/admin/page.tsx', 'admin-legacy');
