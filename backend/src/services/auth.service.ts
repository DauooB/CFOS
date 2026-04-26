import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { CreateUserDTO } from '../models/user.model';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'];

export class AuthService {
  async register(userData: CreateUserDTO) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password_hash, SALT_ROUNDS);
    
    const newUser = await userRepository.create({
      ...userData,
      password_hash: hashedPassword
    });

    const token = this.generateToken(newUser.id, newUser.role);
    
    const { password_hash, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.role);
    
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  private generateToken(userId: number, role: string) {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  async loginOrRegisterWithGoogle(data: { email: string; name: string }) {
    let user = await userRepository.findByEmail(data.email);

    if (!user) {
      // Create new user if doesn't exist
      // Since it's OAuth, we can set a dummy hashed password or handle it differently
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), SALT_ROUNDS);
      user = await userRepository.create({
        name: data.name,
        email: data.email,
        password_hash: dummyPassword,
        role: 'Customer'
      });
    }

    const token = this.generateToken(user.id, user.role);
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}

export const authService = new AuthService();
