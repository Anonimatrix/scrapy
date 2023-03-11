import { Readable } from "stream";

export interface ProcessorInterface<T extends object> {
  extension: string;
  /**
   *  Process user data to a stream
   * @param { T[] } data
   * @returns { Promise<Readable> }
   */
  process: (data: T[]) => Promise<Readable>;
}
