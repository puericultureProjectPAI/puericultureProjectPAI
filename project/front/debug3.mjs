import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173/second-hand/scan', { waitUntil: 'networkidle0' });
  
  // Wait to see if error happens later
  await new Promise(r => setTimeout(r, 3000));
  
  const html = await page.content();
  console.log("HTML:", html.substring(0, 500));
  await browser.close();
})();
