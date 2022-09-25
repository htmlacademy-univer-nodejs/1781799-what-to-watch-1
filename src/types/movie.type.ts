import { Genre } from './genre.enum.js';
import { User } from './user.type.js';

export type Movie = {
  name: string;
  description: string;
  postDate: Date;
  genre: Genre;
  year: number;
  rating: number;
  previewPath: string;
  videoPath: string;
  actors: string[];
  director: string;
  duration: number;
  commentsCount: number;
  user: User;
  posterPath: string;
  backgroundImagePath: string;
  backgroundColor: string;
}
