const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5177/');
  
  // Click start menu
  await page.locator('button').first().click();
  // Wait for apps to appear and click Terminal
  await page.getByText('Terminal').click();
  
  // Wait for terminal input to be visible
  const input = page.locator('input[type="text"]');
  await input.waitFor();
  
  // Type command
  await input.fill('echo "hello world" > test.txt');
  await input.press('Enter');
  
  await input.fill('cat test.txt');
  await input.press('Enter');
  
  // Wait a bit for output
  await page.waitForTimeout(500);
  
  // Get all text in the terminal
  const text = await page.locator('.whitespace-pre-wrap').allInnerTexts();
  console.log('Terminal outputs:', text);
  
  await browser.close();
})();
