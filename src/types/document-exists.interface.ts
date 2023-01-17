import { DocumentType } from '@typegoose/typegoose';

export interface DocumentExistsInterface {
  findById(documentId: string): Promise<DocumentType<unknown> | null>;
}
