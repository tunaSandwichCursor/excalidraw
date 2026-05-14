import puppeteer from 'puppeteer';

const ARTIFACTS = '/opt/cursor/artifacts/screenshots';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Navigate to the app
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Toolbar showing the crescent moon icon
  await page.screenshot({ path: `${ARTIFACTS}/toolbar-overview.png`, fullPage: false });

  // Click the crescent moon tool (keyboard shortcut M)
  await page.keyboard.press('m');
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 2: Tool selected
  await page.screenshot({ path: `${ARTIFACTS}/crescent-moon-tool-selected.png`, fullPage: false });

  // Draw a crescent moon by clicking and dragging on the canvas
  const canvas = await page.$('canvas');
  if (canvas) {
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2 - 100;
      const startY = box.y + box.height / 2 - 100;
      const endX = startX + 200;
      const endY = startY + 200;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, { steps: 20 });
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Screenshot 3: Crescent moon drawn
  await page.screenshot({ path: `${ARTIFACTS}/crescent-moon-drawn.png`, fullPage: false });

  // Click elsewhere to deselect, then draw another with different color
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  // Draw a second crescent moon with fill
  await page.keyboard.press('m');
  await new Promise(r => setTimeout(r, 300));

  if (canvas) {
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2 + 50;
      const startY = box.y + box.height / 2 - 60;
      const endX = startX + 120;
      const endY = startY + 150;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, { steps: 20 });
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Screenshot 4: Multiple crescent moons
  await page.screenshot({ path: `${ARTIFACTS}/crescent-moon-multiple.png`, fullPage: false });

  // Open console to check for errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Navigate again to catch any console errors
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACTS}/clean-console.png`, fullPage: false });

  if (consoleErrors.length > 0) {
    console.log('Console errors found:', consoleErrors);
  } else {
    console.log('No console errors');
  }

  await browser.close();
  console.log('Screenshots saved to', ARTIFACTS);
}

main().catch(console.error);
