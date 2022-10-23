export const getRandomNumber = (min: number, max: number) => Number(((Math.random() * (max - min)) + min).toFixed(0));

export function getRandomItem<T>(items: T[]): T {
  return items[getRandomNumber(0, items.length - 1)];
}

export function getRandomItems<T>(items: T[]): T[] {
  const start = getRandomNumber(0, items.length - 1);
  return items.slice(
    start,
    getRandomNumber(start, items.length)
  );
}
