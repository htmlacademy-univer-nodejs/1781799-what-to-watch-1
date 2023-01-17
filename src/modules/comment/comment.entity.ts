import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { MovieEntity } from '../movie/movie.entity.js';
import { UserEntity } from '../user/user.entity.js';

export interface CommentEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text!: string;

  @prop({required: true})
  public rating!: number;

  @prop({
    ref: MovieEntity,
    required: true
  })
  public movieId!: Ref<MovieEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
