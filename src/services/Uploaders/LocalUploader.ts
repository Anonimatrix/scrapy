import { UploaderInterface } from "./interfaces/UploaderInterface";
import { Readable } from "stream";
import fs from "fs";
import { parse } from "path";
import { inject, injectable } from "tsyringe";

@injectable()
export class LocalUploader implements UploaderInterface {
  constructor(@inject("filepath") private filepath: string) {}
  /**
   * Uploads a file in system location
   */
  async upload(data: Readable): Promise<void> {
    const filepath = this.filepath;
    //Get dir of file path
    const dir = parse(filepath).dir;
    //Create dir if it doesn't exist recursively
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    //Create write stream and pipe data to it
    const ws = fs.createWriteStream(filepath);
    data.pipe(ws);
  }
}
