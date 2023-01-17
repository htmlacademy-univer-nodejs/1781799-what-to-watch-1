export const GENRES = ['Comedy', 'Crime', 'Documentary', 'Drama', 'Horror', 'Family', 'Romance', 'Scifi', 'Thriller'];

export type TGenre = typeof GENRES[number];

export function getGenre(value: string): TGenre | never {
  if (!GENRES.includes(value)) {
    throw new Error(`Unrecognised genre: ${value}.`);
  }
  return value;
}

export enum GenreEnum {
  COMEDY = 'comedy',
  CRIME = 'crime',
  DOCUMENTARY = 'documentary',
  DRAMA = 'drama',
  HORROR = 'horror',
  FAMILY = 'family',
  ROMANCE = 'romance',
  SCIFI = 'scifi',
  THRILLER = 'thriller'
}
