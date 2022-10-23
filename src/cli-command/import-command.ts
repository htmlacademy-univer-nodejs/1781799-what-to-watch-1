import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { getMovieByRowData } from '../common/generator/movie-generator.js';
import chalk from 'chalk';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', (line) => console.log(getMovieByRowData(line)));
    fileReader.on('end', (count) => console.log(`${count} rows imported.`));

    try {
      await fileReader.read();
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(`Не удалось импортировать данные из файла по причине: «${chalk.yellow(err.message)}»`);
    }
  }
}
