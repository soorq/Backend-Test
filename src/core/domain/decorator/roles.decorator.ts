import { SetMetadata } from '@nestjs/common';
import type { Role } from '@/shared/roles';

export const ROLE_KEY = 'role';

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
