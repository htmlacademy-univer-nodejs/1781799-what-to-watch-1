import chalk from 'chalk';
import { ConfigService } from '../common/config/config.service';
import { TSVFileReader } from '../common/file-reader/tsv-file-reader.js';
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
import { ConfigInterface } from '../common/config/config.interface';

export class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private config: ConfigInterface;
  private salt!: string;

  constructor() {
    this.logger = new LoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
    this.config = new ConfigService(this.logger);
  }

  public async execute(filename: string): Promise<void> {
    const uri = getDatabaseURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('PORT'),
      this.config.get('DB_NAME'));
    this.salt = this.config.get('SALT');

    await this.databaseService.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', async (line) => {
      const movie = getMovieByRowData(line);
      this.logger.info(`${movie}`);
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
      this.logger.info(`${count} rows imported.`);
    });

    try {
      await fileReader.read();
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      this.logger.info(`Не удалось импортировать данные из файла по причине: «${chalk.yellow(err.message)}»`);
    }
  }
}
