import db from '../config/db';
import { User, CreateUserDTO } from '../models/user.model';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(user: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [user.name, user.email, user.password_hash, user.role || 'Customer'];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

export const userRepository = new UserRepository();
