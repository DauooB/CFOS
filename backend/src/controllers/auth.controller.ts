import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Customer', 'Kitchen', 'Admin']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const googleLoginSchema = z.object({
  idToken: z.string()
});

export class AuthController {
  async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);
    
    const result = await authService.register({
      name: validatedData.name,
      email: validatedData.email,
      password_hash: validatedData.password,
      role: validatedData.role as any
    });

    res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);
    
    const result = await authService.login(validatedData.email, validatedData.password);
    
    res.status(200).json(result);
  }

  async googleLogin(req: Request, res: Response) {
    const { idToken } = googleLoginSchema.parse(req.body);
    
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google Token');
    }

    const result = await authService.loginOrRegisterWithGoogle({
      email: payload.email,
      name: payload.name || 'Google User',
    });

    res.status(200).json(result);
  }
}

export const authController = new AuthController();
