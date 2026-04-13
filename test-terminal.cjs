const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5177/');
  
  await page.locator('button').first().click();
  await page.getByText('Terminal').click();
  
  const input = page.locator('input.text-green-400');
  await input.waitFor();
  
  // test mkdir and cd
  await input.fill('mkdir a');
  await input.press('Enter');
  
  await input.fill('mkdir a/../b');
  await input.press('Enter');
  
  await input.fill('ls a/..');
  await input.press('Enter');
  
  await page.waitForTimeout(500);
  
  const outputs = await page.locator('.whitespace-pre-wrap').allInnerTexts();
  console.log('Outputs:', outputs);
  
  await browser.close();
})();
