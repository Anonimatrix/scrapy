import { Registable } from "@xkairo/scrapy-interfaces";

export const puppeteerProvider: Registable = {
  plugins: {
    useValue: [],
  },
  config: {
    useValue: {
      headless: true,
    },
  },
};
