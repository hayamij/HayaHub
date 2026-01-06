import type { UserRole } from 'hayahub-domain';

export interface RegisterUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDTO {
  user: UserDTO;
  token: string;
}
