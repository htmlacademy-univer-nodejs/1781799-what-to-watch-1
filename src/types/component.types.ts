export const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  MovieServiceInterface: Symbol.for('MovieServiceInterface'),
  MovieModel: Symbol.for('MovieModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
} as const;
