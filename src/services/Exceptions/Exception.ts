export class Exception extends Error {
  statusCode?: number;

  /**
   * @property needStop
   * @description This property is used to know if the exception is fatal or not
   * @type {boolean}
   */
  needStop?: boolean;

  /**
   * @function cry
   * @description This function is used to cry when an exception is thrown
   * @returns {void}
   */
  cry?(): void;
}
