export const GENRES = ['Comedy', 'Crime', 'Documentary', 'Drama', 'Horror', 'Family', 'Romance', 'Scifi', 'Thriller'];

export type TGenre = typeof GENRES[number];

export function getGenre(value: string): TGenre | never {
  if (!GENRES.includes(value)) {
    throw new Error(`Unrecognised genre: ${value}.`);
  }
  return value;
}

export enum GenreEnum {
  COMEDY = 'Comedy',
  CRIME = 'Crime',
  DOCUMENTARY = 'Documentary',
  DRAMA = 'Drama',
  HORROR = 'Horror',
  FAMILY = 'Family',
  ROMANCE = 'Romance',
  SCIFI = 'Scifi',
  THRILLER = 'Thriller'
}
