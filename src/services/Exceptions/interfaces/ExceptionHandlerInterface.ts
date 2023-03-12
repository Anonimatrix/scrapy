import { Exception } from "../Exception";

export interface ExceptionHandlerInterface {
  /**
   * @function handle
   * @description This function is used to handle an exception
   * @param {Exception} exception The exception to handle
   */
  handle(exception: Exception): void;
}
