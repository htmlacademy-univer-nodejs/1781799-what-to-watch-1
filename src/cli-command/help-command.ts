import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        ${chalk.yellow('Программа для подготовки данных для REST API сервера')}.

        ${chalk.yellow('Пример')}:
            main.js ${chalk.gray('--<command>  [--arguments]')}

        ${chalk.yellow('Команды')}:
            ${chalk.gray('--version')}:                   ${chalk.yellow('# выводит номер версии')}
            ${chalk.gray('--help')}:                      ${chalk.yellow('# печатает этот текст')}
            ${chalk.gray('--import <path>')}:             ${chalk.yellow('# импортирует данные из TSV')}
            ${chalk.gray('--generator <n> <path> <url>')} ${chalk.yellow('# генерирует произвольное количество тестовых данных')}
        `);
  }
}
