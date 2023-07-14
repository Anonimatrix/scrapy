import "reflect-metadata";
import { CsvProcessor } from "./services/Processors/CsvProcessor";
import { Scraper } from "./services/Scraper";
import { LocalUploader } from "./services/Uploaders/LocalUploader";
import { ExceptionHandler } from "./services/Exceptions/Handler/ExceptionHandler";
import { injectable, inject } from "tsyringe";

export default Scraper;
const Uploaders = { LocalUploader };
const Processors = { CsvProcessor };
const ExceptionsHandlers = { ExceptionHandler };

const Inject = inject;
const Injectable = injectable;

export { Uploaders, Processors, ExceptionsHandlers, Injectable, Inject };
