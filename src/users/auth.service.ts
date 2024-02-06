import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scryptSync } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //check email
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //hash pwd
    //generate salt
    const salt = randomBytes(8).toString('hex');

    //hash the salt and the password
    const hash = await scryptSync(password, salt, 32);

    //join hashe and salt

    const result = salt + '.' + hash.toString('hex');

    //create user
    const user = await this.usersService.create(email, result);

    //save user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = await scryptSync(password, salt, 32);

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }
    return user;
  }
}
