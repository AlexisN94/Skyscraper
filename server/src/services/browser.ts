import { Browser as PuppeteerBrowser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
const userAgent = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

type BrowserOptions = {
   headless: boolean
}

class Browser {
   private browser: PuppeteerBrowser
   private options: BrowserOptions

   constructor(options: BrowserOptions) {
      this.options = options
   }

   async loadPage(url, isSmall = false) {
      this.browser = await puppeteer.launch({
         headless: this.options.headless,
         args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            `${isSmall ? `--window-size=${400},${700}` : ''}`
         ]
      });
      const page = await this.browser.newPage();
      await page.setUserAgent(userAgent.toString());
      await page.goto(url, { timeout: 60000 });
      return page;
   }

   close() {
      this.browser?.close();
   }
}

export default Browser;