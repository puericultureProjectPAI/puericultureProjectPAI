import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log("Navigated to home");
  await new Promise(r => setTimeout(r, 1000));
  
  // click a link that goes to /second-hand/scan
  const links = await page.$$('a');
  for (const link of links) {
      const href = await page.evaluate(el => el.getAttribute('href'), link);
      if (href && href.includes('scan')) {
          console.log("Clicking link:", href);
          await link.click();
          break;
      }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("Done");
  await browser.close();
})();
