import {
  inject,
  injectable
} from 'inversify';
import { CommentServiceInterface } from './comment-service.interface.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import {
  DocumentType,
  types
} from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {
  }

  async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`Comment created: ${dto}`);

    return comment.populate('userId');
  }

  async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    const comments = await this.commentModel
      .find({movieId})
      .populate('userId');

    this.logger.info(`Found ${comments.length} comments on movieID (${movieId})`);
    return comments;
  }

  async deleteById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    const comment = await this.commentModel
      .findByIdAndDelete(commentId)
      .exec();

    this.logger.info(`Comment ${commentId} has been deleted`);

    return comment;
  }
}
