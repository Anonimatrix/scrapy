import { Registable } from "../services/Resolver/Resolver";

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
