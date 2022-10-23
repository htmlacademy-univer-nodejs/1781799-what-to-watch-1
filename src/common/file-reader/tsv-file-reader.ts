import { readFileSync } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Movie } from '../../types/movie.type.js';
import { Genre } from '../../types/genre.enum.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Movie[] {
    if (!this.rawData) {
      return [];
    }

    console.log(this.rawData.split('\n').map((line) => line.split('\t')));
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([name, description, postDate, genre, year, rating, previewPath,
        videoPath, actors, director, duration, commentsCount, userName,
        email, avatarPath, posterPath, backgroundImagePath, backgroundColor]) => ({
        name,
        description,
        postDate: new Date(postDate),
        genre: genre as Genre,
        year: Number.parseInt(year, 10),
        rating: Number.parseInt(rating, 10),
        previewPath,
        videoPath,
        actors: actors.split(';'),
        director,
        duration: Number.parseInt(duration, 10),
        commentsCount: Number.parseInt(commentsCount, 10),
        user: { name: userName, email, avatarPath },
        posterPath,
        backgroundImagePath,
        backgroundColor
      }));
  }
}
