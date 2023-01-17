import { UserEntity } from './user.entity.js';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { types } from '@typegoose/typegoose';
import { UpdateUserDto } from './dto/update-user.dto.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {
  }

  async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`User created: ${user.email}`);

    return result;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findOne({email});
    this.logger.info(`User found: ${user?.email}`);

    return user;
  }

  async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);

    if (user) {
      this.logger.info(`A user with an email ${user.email} already exists`);
      return user;
    }

    return this.create(dto, salt);
  }

  async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    const newUser = await this.userModel.findByIdAndUpdate(userId, dto, {new: true}).exec();
    if (newUser) {
      this.logger.info(`The user ${userId} has been updated`);
    } else {
      this.logger.warn(`Failed to update user ${userId}`);
    }
    return newUser;
  }

  async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      this.logger.warn(`User ${userId} not found`);
    }

    return user;
  }
}
