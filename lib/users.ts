import bcrypt from 'bcryptjs';
import { User } from './types';

// Hardcoded users for demo (passwords are hashed)
// Default password for all users: "password123"
const hashedPassword = bcrypt.hashSync('password123', 10);

export const users: User[] = [
  {
    id: 1,
    email: 'doctor@nexifuse.com',
    password: hashedPassword,
    role: 'doctor',
    name: 'Dr. Sarah Johnson',
  },
  {
    id: 2,
    email: 'admin@nexifuse.com',
    password: hashedPassword,
    role: 'admin',
    name: 'Admin User',
  },
  {
    id: 3,
    email: 'viewer@nexifuse.com',
    password: hashedPassword,
    role: 'viewer',
    name: 'John Viewer',
  },
];

export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

export function findUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
}

export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
