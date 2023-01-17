import {
  getRandomItem,
  getRandomItems,
  getRandomNumber,
} from '../../utils/random.js';
import {
  GENRES,
  getGenre,
} from '../../types/genre.type.js';
import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { Movie } from '../../types/movie.type.js';

export const generateMovieRowData = (data: MockData): string => [
  getRandomItem(data.names),
  getRandomItem(data.descriptions),
  dayjs().subtract(getRandomNumber(1, 7), 'day').toISOString(),
  getRandomItem(GENRES),
  getRandomNumber(1900, 2022),
  getRandomNumber(1, 10),
  getRandomItem(data.previewPaths),
  getRandomItem(data.videoPaths),
  getRandomItems(data.actors).join(';'),
  getRandomItem(data.directors),
  getRandomNumber(60, 180),
  getRandomNumber(0, 100),
  getRandomItem(data.users),
  getRandomItem(data.emails),
  getRandomItem(data.avatarPaths),
  getRandomItem(data.posterPaths),
  getRandomItem(data.backgroundImagePaths),
  getRandomItem(data.backgroundColors)
].join('\t');

export const getMovieByRowData = (row: string): Movie => {
  const [
    name,
    description,
    postDate,
    genre,
    year,
    rating,
    previewPath,
    videoPath,
    actors,
    director,
    duration,
    commentsCount,
    userName,
    email,
    avatarPath,
    posterPath,
    backgroundImagePath,
    backgroundColor
  ] = row.split('\t');

  return {
    name,
    description,
    postDate: new Date(postDate),
    genre: getGenre(genre),
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
  };
};
