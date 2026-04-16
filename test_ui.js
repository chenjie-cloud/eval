const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/');

    // Check canvas exists
    const canvas = await page.$('#gameCanvas');
    if (!canvas) {
        console.error("FAIL: Canvas not found");
        process.exit(1);
    }

    // Check score
    let scoreText = await page.$eval('#score', el => el.innerText);
    console.log("Initial score:", scoreText);

    // Wait a bit, then press ArrowRight
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 500));

    // The game should have updated
    console.log("Game is running");

    // Force game over by going out of bounds
    // The snake starts at 10,10. Going right 10 times = wall.
    for(let i=0; i<12; i++) {
        await new Promise(r => setTimeout(r, 100));
    }

    // Check if game over modal is visible
    const modalClasses = await page.$eval('#gameOverModal', el => el.className);
    console.log("Modal classes:", modalClasses);
    
    if (!modalClasses.includes('hidden')) {
        console.log("Game over modal is visible!");
    } else {
        console.error("FAIL: Game over modal is NOT visible after hitting wall");
        process.exit(1);
    }

    await browser.close();
})();
