const fs = require('fs');
let html = fs.readFileSync('legacy-vanilla/index.html', 'utf8');

// Extract body innerHTML
let bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) process.exit(1);
let bodyContent = bodyMatch[1];

// Remove script tags
bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Convert class to className
bodyContent = bodyContent.replace(/class=/g, 'className=');

// Convert style="..." to style={{...}}
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

// Fix unclosed tags (img, input, hr, br, path, circle)
bodyContent = bodyContent.replace(/<(img|input|hr|br|path|circle)([^>]*[^\/])>/g, '<$1$2 />');
bodyContent = bodyContent.replace(/<svg ([^>]*)>/g, '<svg $1 xmlns="http://www.w3.org/2000/svg">');

// Fix viewBox casing
bodyContent = bodyContent.replace(/viewbox/gi, 'viewBox');
bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');
bodyContent = bodyContent.replace(/stroke-linecap/g, 'strokeLinecap');
bodyContent = bodyContent.replace(/stroke-linejoin/g, 'strokeLinejoin');

// Fix svg path elements that are now properly closed
// Actually the previous regex `[^\/]>` might catch it, let's see.

let jsx = `"use client";
import { useEffect } from 'react';
import { initAll } from '@/lib/main-legacy';

export default function Home() {
  useEffect(() => {
    initAll();
  }, []);

  return (
    <>
      ${bodyContent}
    </>
  );
}
`;
fs.writeFileSync('src/app/page.tsx', jsx);
