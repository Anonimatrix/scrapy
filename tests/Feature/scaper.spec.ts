import { ScraperConfigInterface } from "@xkairo/scrapy-interfaces";
import { existsSync, readFileSync, rmSync } from "fs";
import { join } from "path";
import "reflect-metadata";
import { ExceptionHandler } from "../../src/services/Exceptions/Handler/ExceptionHandler";
import { CsvProcessor } from "../../src/services/Processors/CsvProcessor";
import { Scraper } from "../../src/services/Scraper";
import { LocalUploader } from "../../src/services/Uploaders/LocalUploader";
import { PageScraper } from "./page";
import { UserInterface } from "./userInterface";

describe("Scraper", () => {
  it("Should be able to scrape a page and create file", async () => {
    const filepath = join(__dirname, "result.csv");
    const config: ScraperConfigInterface<UserInterface> = {
      uploaders: [LocalUploader],
      processors: [CsvProcessor],
      scrapers: [PageScraper],
      providers: [
        {
          filepath: {
            useValue: filepath,
          },
        },
      ],
      exceptionHandler: ExceptionHandler,
    };

    const scraper = new Scraper(config);

    await scraper.init();

    const exists = existsSync(filepath);

    expect(exists).toBeTruthy();

    const data = readFileSync(filepath);

    expect(data.toString()).toBe("name\ntest\n");

    rmSync(filepath);
  });
});
