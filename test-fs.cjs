const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5177/');
  
  await page.locator('button').first().click();
  await page.getByText('Files').click();
  
  // Wait for the file explorer to show 'This folder is empty'
  await page.waitForTimeout(500);
  
  // Click new file button
  await page.locator('button[title="New File"]').click();
  
  // Type a/b.txt
  const input = page.locator('input[type="text"]');
  await input.waitFor();
  await input.fill('a/b.txt');
  await input.press('Enter');
  
  await page.waitForTimeout(500);
  
  const text = await page.locator('.flex-1.p-4').innerText();
  console.log('Files:', text);
  
  // Let's check localStorage for the orphan file
  const ls = await page.evaluate(() => window.localStorage.getItem('fs-storage'));
  console.log('LocalStorage nodes:', Object.keys(JSON.parse(ls).state.nodes));
  
  await browser.close();
})();
