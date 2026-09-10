const puppeteer = require('puppeteer');

async function redeemDiamond(playerId, pinCode) {
    console.log(`=========================================`);
    console.log(`[START] เริ่มต้นทำงานบอทเติมเงินบน Render`);
    console.log(`[INFO] UID: ${playerId} | PIN: ${pinCode}`);
    console.log(`=========================================`);

    let browser;
    try {
        // ดึงตำแหน่ง Chrome จาก Environment Variable ของ Render/Docker
        const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null;

        browser = await puppeteer.launch({
            executablePath: executablePath,
            headless: true, // รันแบบเบื้องหลังบน Cloud
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        console.log('[1/4] กำลังเปิดหน้าเว็บทดสอบ...');
        await page.goto('https://httpbin.org/forms/post', { waitUntil: 'networkidle2' });

        console.log('[2/4] กำลังกรอก Player UID...');
        await page.waitForSelector('input[name="custname"]');
        await page.type('input[name="custname"]', playerId);

        console.log('[3/4] กำลังกรอก PIN Code...');
        await page.waitForSelector('textarea[name="comments"]');
        await page.type('textarea[name="comments"]', pinCode);

        console.log('[4/4] กำลังส่งข้อมูลกดยืนยัน...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('button')
        ]);

        const pageContent = await page.content();
        await browser.close();

        if (pageContent.includes(playerId)) {
            console.log('✅ [SUCCESS] เติมเงินสำเร็จเรียบร้อยบน Render!');
            return { success: true, message: 'เติมเงินสำเร็จ' };
        } else {
            console.log('❌ [FAILED] ทำรายการไม่สำเร็จ');
            return { success: false };
        }

    } catch (error) {
        if (browser) await browser.close();
        console.error('⚠️ [ERROR]: เกิดข้อผิดพลาดในการรันบอท:', error.message);
        return { success: false, error: error.message };
    }
}

// ==========================================
// สั่งให้บอททำงานทันทีเมื่อ Render เริ่มต้นเซิร์ฟเวอร์
// ==========================================
redeemDiamond('FF_9988776655', 'PIN-1234-5678-9012');
