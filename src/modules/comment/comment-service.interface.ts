import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
}
