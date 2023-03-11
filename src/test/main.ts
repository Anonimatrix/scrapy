import { Scraper } from "../services/Scraper/Scraper";
import { puppeteerProvider } from "../Providers/puppeteer";
import { CsvProcessor } from "../services/Processors/CsvProcessor";
import { ScraperConfigInterface } from "../services/Scraper/interfaces/Scraper";
import { Puppeteer } from "../services/Services/Puppeteer/Puppeteer";
import { LocalUploader } from "../services/Uploaders/LocalUploader";
import { PageScraper } from "./page";
import { UserInterface } from "./userInterface";

(async () => {
  const config: ScraperConfigInterface<UserInterface> = {
    uploaders: [LocalUploader],
    processors: [CsvProcessor],
    scrapers: [PageScraper],
    services: [Puppeteer],
    providers: [
      puppeteerProvider,
      {
        filepath: {
          useValue: __dirname + "/result.csv",
        },
      },
    ],
  };

  const scraper = new Scraper(config);

  await scraper.init();
})();
