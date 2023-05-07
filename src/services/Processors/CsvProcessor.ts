import { ProcessorInterface } from "@xkairo/scrapy-interfaces";
import fs from "fs";
import ObjectToCsv from "objects-to-csv";
import { Readable } from "stream";
import { injectable } from "tsyringe";

const tmpPath = "./tmp.csv";

@injectable()
export class CsvProcessor<T extends object> implements ProcessorInterface<T> {
  readonly extension = ".csv";
  /**
   * Process data to csv stream
   * @param { UserResultInterface[] } data Array of users to be processed
   * @returns { Readable }
   */
  public async process(data: T[]): Promise<Readable> {
    //Parse data to csv and save it to tmp file
    await new ObjectToCsv(data).toDisk(tmpPath);
    //Convert temp file to stream
    const stream = fs.createReadStream(tmpPath);
    //Delete file when stream is closed
    stream.on("close", () => {
      fs.unlinkSync(tmpPath);
    });
    return stream;
  }
}
