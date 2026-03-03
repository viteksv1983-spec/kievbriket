import { chromium } from 'playwright';

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => {
            console.log('--- PAGE CRASH ---');
            console.log(error.message);
        });

        console.log("Navigating to https://kievbriket.vercel.app/...");
        await page.goto('https://kievbriket.vercel.app/', { waitUntil: 'networkidle' });

        console.log("Waiting 2 seconds...");
        await new Promise(r => setTimeout(r, 2000));

        console.log("Clicking on 'Брикети' category link...");
        await page.click('a[href="/catalog/brikety"]');

        console.log("Waiting 3 seconds for React to transition...");
        await new Promise(r => setTimeout(r, 3000));

        console.log("Clicking on 'Вугілля' category link...");
        await page.click('a[href="/catalog/vugillya"]');

        console.log("Waiting 3 seconds for React to transition...");
        await new Promise(r => setTimeout(r, 3000));

        await browser.close();
    } catch (err) {
        console.error("Test failed:", err);
    }
})();
