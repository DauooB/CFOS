export type UserRole = 'Customer' | 'Kitchen' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
}
