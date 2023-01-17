import got from 'got';
import { CliCommandInterface } from './cli-command.interface';
import { MockData } from '../types/mock-data.type';
import { generateMovieRowData } from '../common/generator/movie-generator.js';
import { TSVFileWriter } from '../common/file-writer/tsv-file-writer.js';

export class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = parseInt(count, 10);

    let data: MockData;
    try {
      data = await got.get(url).json<MockData>();
    } catch {
      return console.log(`${url} not available.`);
    }

    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(generateMovieRowData(data));
    }

    console.log(`File ${filepath} was created!`);
  }
}
