import {
  Exception,
  ExceptionHandlerInterface,
} from "@xkairo/scrapy-interfaces";

export class ExceptionHandler implements ExceptionHandlerInterface {
  handle(exception: Exception): void {
    // Log the exception
    console.error("Error", exception.message);

    // If the exception has a cry function, call it
    exception.cry && exception.cry();

    // If the exception is fatal, stop the process
    if (exception.needStop) {
      process.exit(1);
    }
  }
}
