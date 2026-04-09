import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:5176/');
  await page.waitForSelector('.grid');
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Errors:', errors);
  await browser.close();
})();
