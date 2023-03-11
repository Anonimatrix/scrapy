import { Page } from "puppeteer";
import { PluginOptions, PuppeteerExtraPlugin } from "puppeteer-extra-plugin";

export class AutoScroll extends PuppeteerExtraPlugin {
  constructor(opts?: PluginOptions) {
    super(opts);
  }

  get name() {
    return "autoScroll";
  }

  async onPageCreated(page: Page) {
    Object.assign(page, {
      autoScroll: async () => {
        let previousHeight = 0;
        const checkHeight = async () => {
          return await page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
            return document.body.scrollHeight;
          });
        };

        while ((await checkHeight()) !== previousHeight) {
          previousHeight = await checkHeight();
        }
      },
    });
  }
}
