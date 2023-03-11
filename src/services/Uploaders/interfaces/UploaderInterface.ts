import { Readable } from "stream";

export interface UploaderInterface {
  /**
   * Uploads a file to a remote location
   * @param { Readable } data Stream of data to be uploaded
   * @param { string } filepath Path to the file to be uploaded
   * @returns { Promise<void> }
   */
  upload: (data: Readable, filepath: string) => Promise<void>;
}
