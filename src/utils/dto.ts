import {
  ClassConstructor,
  plainToInstance
} from 'class-transformer';

export const fillDto = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});
