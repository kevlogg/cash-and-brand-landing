import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://cash-and-brand-landing.vercel.app/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshot1.png', fullPage: true });
  
  await page.click('.btn-checkout-trigger');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshot2.png' });
  
  await browser.close();
})();
