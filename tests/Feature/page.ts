import { PageScraperInterface } from "@xkairo/scrapy-interfaces";
import { injectable } from "tsyringe";
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
