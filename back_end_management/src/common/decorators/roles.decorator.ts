import { SetMetadata } from '@nestjs/common';

// Đây là custom decorator để đính metadata "roles"
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
