import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { GENRES, TGenre } from '../../types/genre.type.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public name!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: GENRES
  })
  public genre!: TGenre;

  @prop({required: true})
  public year!: number;

  @prop({required: true})
  public rating!: number;

  @prop({required: true})
  public previewPath!: string;

  @prop({required: true})
  public videoPath!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true})
  public director!: string;

  @prop({required: true})
  public duration!: number;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true})
  public posterPath!: string;

  @prop({required: true})
  public backgroundImagePath!: string;

  @prop({required: true})
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);
