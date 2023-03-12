import { Exception } from "./Exception";

export class ResolverException extends Exception {
  needStop = true;

  constructor(message: string) {
    super(message);
  }
}
