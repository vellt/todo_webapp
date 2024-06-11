import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { ChangePasswordBody, RegisterUserRequestBody, UpdateUserDataBody, User } from './user.type';

const DB_PATH = resolve(__dirname, '../data/users.json');
const SALT_ROUNDS = 10;

@Injectable()
export class UsersService implements OnModuleInit {
  private logger = new Logger(UsersService.name);
  private users: Map<string, User>;

  async onModuleInit(): Promise<void> {
    try {
      const data = await readFile(DB_PATH, 'utf8');
      this.users = JSON.parse(data).reduce((users, rawUser: User) => {
        const userData = Object.keys(rawUser).reduce((user, key) => {
          user[key] = rawUser[key];
          return user;
        }, {} as User);
        users.set(userData.userId, userData);
        return users;
      }, new Map<string, User>());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Cannot find users!');
    }
  }

  public findOne(email: string): User {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  public findById(userId: string): User {
    return this.users.get(userId);
  }

  public createPasswordHash(password: string): Promise<string> {
    return hash(password, SALT_ROUNDS);
  }

  public async register(userData: RegisterUserRequestBody) {
    if (this.findOne(userData.username)) {
      throw new ConflictException('Already exists');
    }
    const user: User = {
      userId: uuid(),
      email: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: await this.createPasswordHash(userData.password),
    };
    this.users.set(user.userId, user);
    await this.save();
    return this.users.get(user.userId);
  }

  public async changePassword(userId: string, passwordData: ChangePasswordBody) {
    const user = this.findById(userId);
    if (!user) {
      throw new NotFoundException('Cannot find user');
    }
    const validPass = await compare(passwordData.oldPassword, user.password);
    if (!validPass) {
      throw new ForbiddenException('Hibás jelszó');
    }
    const samePasswordUsed = await compare(passwordData.password, user.password);
    if (samePasswordUsed) {
      throw new ConflictException('A régi és az új jelszó nem egyezhet!');
    }
    const password = await this.createPasswordHash(passwordData.password);
    this.users.set(userId, { ...user, password })
    await this.save();
  }

  public async updateUserData(userId: string, userData: UpdateUserDataBody): Promise<User> {
    const user = this.findById(userId);
    if (!user) {
      throw new NotFoundException('Cannot find user');
    }
    const { firstName, lastName } = userData;
    this.users.set(userId, {
      ...user,
      firstName,
      lastName,
    });
    await this.save();
    return this.users.get(userId);
  }

  private async save() {
    try {
      await writeFile(DB_PATH, JSON.stringify(Array.from(this.users.values()), null, 2));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
