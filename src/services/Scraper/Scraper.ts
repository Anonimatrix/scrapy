import path from "path";
import { Resolver } from "../Resolver/Resolver";
import { ScraperConfigInterface } from "./interfaces/Scraper";

export class Scraper<T extends object> {
  private results: T[] = [];
  constructor(private readonly config: ScraperConfigInterface<T>) {}

  public async init() {
    await this.resolver();
    await this.scrap();
    await this.upload();
  }

  public async resolver() {
    const { services, providers } = this.config;

    providers.forEach((provider) => {
      Resolver.register(provider);
    });

    services.forEach((service) => {
      Resolver.register({ [service.constructor.name]: { useClass: service } });
    });
  }

  public async scrap() {
    const { scrapers } = this.config;
    const results: T[] = [];

    for (const scraper of scrapers) {
      // Scrap the page and push the results to the results array
      const scraperInstance = Resolver.resolve(scraper);
      await scraperInstance.scrap().then((result) => {
        results.push(...result);
      });
    }

    this.results = results;
  }

  public async upload() {
    const { processors, uploaders } = this.config;
    const results = this.results;

    for (const processor of processors) {
      const processorInstance = Resolver.resolve(processor);
      const processed = await processorInstance.process(results);
      for (const uploader of uploaders) {
        const uploaderInstance = Resolver.resolve(uploader);
        await uploaderInstance.upload(
          processed,
          path.join("result" + processorInstance.extension)
        );
      }
    }
  }
}
