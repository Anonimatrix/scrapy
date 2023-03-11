import { Browser, PuppeteerLaunchOptions } from "puppeteer";
import puppeteer from "puppeteer-extra";
import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin";
import { inject, injectable } from "tsyringe";

@injectable()
export class Puppeteer {
  private browser?: Browser;

  constructor(
    @inject("config") private config?: PuppeteerLaunchOptions,
    @inject("plugins") plugins?: PuppeteerExtraPlugin[]
  ) {
    plugins?.forEach((plugin) => puppeteer.use(plugin));
  }

  getBrowser = async () => {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.config || { headless: true });
    }

    return this.browser;
  };
}
