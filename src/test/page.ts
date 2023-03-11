import { injectable } from "tsyringe";
import { PageScraperInterface } from "../services/Scraper/interfaces/PageScraperInterface";
import { UserInterface } from "./userInterface";

@injectable()
export class PageScraper implements PageScraperInterface<UserInterface> {
  async scrap() {
    return [
      {
        name: "test",
      },
    ];
  }
}
