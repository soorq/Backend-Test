import { AuthService } from '@/infra/framework/auth/auth.service';

export const mockAuthService: Partial<AuthService> = {
  signIn: jest.fn(),
  refresh: jest.fn(),
  signUp: jest.fn(),
  logout: jest.fn(),
};
