import { ProcessorInterface } from "../../Processors/interfaces/ProcessorInterface";
import { Registable } from "../../Resolver/Resolver";
import { UploaderInterface } from "../../Uploaders/interfaces/UploaderInterface";
import { PageScraperInterface } from "./PageScraperInterface";

export type Instantiable<T> = new (...args: any[]) => T;

export interface ScraperConfigInterface<T extends object> {
  uploaders: Instantiable<UploaderInterface>[];
  processors: Instantiable<ProcessorInterface<T>>[];
  scrapers: Instantiable<PageScraperInterface<T>>[];
  services: Instantiable<any>[];
  providers: Registable[];
}
