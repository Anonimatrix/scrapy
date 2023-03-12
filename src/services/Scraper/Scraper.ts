import path from "path";
import { Exception } from "../Exceptions/Exception";
import { ExceptionHandler } from "../Exceptions/Handler/ExceptionHandler";
import { ExceptionHandlerInterface } from "../Exceptions/interfaces/ExceptionHandlerInterface";
import { ResolverException } from "../Exceptions/ResolverException";
import { Resolver } from "../Resolver/Resolver";
import { ScraperConfigInterface } from "./interfaces/Scraper";

export class Scraper<T extends object> {
  private results: T[] = [];
  private readonly exceptionHandler: ExceptionHandlerInterface;
  constructor(private readonly config: ScraperConfigInterface<T>) {
    // Set the exception handler to the one provided in the config or the default one
    this.exceptionHandler = config.exceptionHandler
      ? new config.exceptionHandler()
      : new ExceptionHandler();
  }

  public async init() {
    try {
      await this.resolver();
      await this.scrap();
      await this.upload();
    } catch (e) {
      // If an error occurs, handle it
      if (e instanceof Error || e instanceof Exception) {
        this.exceptionHandler.handle(e);
      }
    }
  }

  public async resolver() {
    const { services, providers } = this.config;

    // Register the providers
    (providers || []).forEach((provider) => {
      Resolver.register(provider);
    });

    // Register the services
    (services || []).forEach((service) => {
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
