import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private users = [];

  private readonly jwtSecret = process.env.JWT_SECRET || 'pYqGeE1qhRow1hvVZPzjr0YUrqciSzbSFcpI4NfP9Vw';

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const userExists = this.users.find((user) => user.email === email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { email, password: hashedPassword };
    this.users.push(user);

    return { message: 'User registered successfully', user };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ email: user.email }, this.jwtSecret, { expiresIn: '1h' });

    return { message: 'Login successful', token };
  }
}
