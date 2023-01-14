import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';
import { getMovieByRowData } from '../common/generator/movie-generator.js';
import { UserServiceInterface } from '../modules/user/user-service.interface';
import { MovieServiceInterface } from '../modules/movie/movie-service.interface';
import { DatabaseInterface } from '../common/database-client/database.interface';
import { LoggerInterface } from '../common/logger/logger.interface';
import { MovieService } from '../modules/movie/movie.service.js';
import { LoggerService } from '../common/logger/logger.service.js';
import { MovieModel } from '../modules/movie/movie.entity.js';
import { UserService } from '../modules/user/user.service.js';
import { UserModel } from '../modules/user/user.entity.js';
import { DatabaseService } from '../common/database-client/database.service.js';
import { getDatabaseURI } from '../utils/db.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.logger = new LoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    port: string,
    dbname: string,
    salt: string): Promise<void> {
    const uri = getDatabaseURI(login, password, host, Number.parseInt(port, 10), dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', async (line) => {
      const movie = getMovieByRowData(line);
      console.log(movie);
      const user = await this.userService.findOrCreate({
        ...movie.user,
        password: '12345'
      }, this.salt);

      await this.movieService.create({
        ...movie,
        userId: user.id,
      });

    });
    fileReader.on('end', (count) => {
      console.log(`${count} rows imported.`);
    });

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
