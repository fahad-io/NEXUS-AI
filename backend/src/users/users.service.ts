import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  role: 'user' | 'guest';
}

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: 'user' | 'guest';
  }): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: new Date(),
      role: data.role ?? 'user',
    };
    this.users.set(user.id, user);
    return user;
  }

  async update(
    id: string,
    data: Partial<Omit<User, 'id'>>,
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  sanitize(user: User): Omit<User, 'password'> {
    const { password, ...rest } = user;
    return rest;
  }
}
