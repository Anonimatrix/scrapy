import "reflect-metadata";
import { CsvProcessor } from "./services/Processors/CsvProcessor";
import { Scraper } from "./services/Scraper";
import { Puppeteer } from "./services/Services/Puppeteer/Puppeteer";
import { LocalUploader } from "./services/Uploaders/LocalUploader";
import { ExceptionHandler } from "./services/Exceptions/Handler/ExceptionHandler";
import { puppeteerProvider } from "./Providers/puppeteer";
import { injectable, inject } from "tsyringe";

export default Scraper;
const Uploaders = { LocalUploader };
const Processors = { CsvProcessor };
const Services = { Puppeteer };
const ExceptionsHandlers = { ExceptionHandler };
const Providers = { puppeteerProvider };

const Inject = inject;
const Injectable = injectable;

export {
  Uploaders,
  Processors,
  Services,
  ExceptionsHandlers,
  Providers,
  Injectable,
  Inject,
};
