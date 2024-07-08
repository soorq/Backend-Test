import { ECategory } from '@/core/domain/entities/category.entity';
import { EUser } from '@/core/domain/entities/user.entity';
import { EPost } from '@/core/domain/entities/post.entity';
import { EToken } from '@/core/domain/entities/token.entity';

export * from './category.entity';
export * from './token.entity';
export * from './post.entity';
export * from './user.entity';

// For metadata to migration :D
export const ENTITIES = [EUser, EPost, ECategory, EToken];
