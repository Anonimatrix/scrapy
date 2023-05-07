import { Exception } from "@xkairo/scrapy-interfaces";

export class ResolverException extends Exception {
  needStop = true;

  constructor(message: string) {
    super(message);
  }
}
