import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('Users Controller', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'qwe@qwe.com',
          password: 'qwe',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'qwe' } as User]);
      },
      //   remove: () => {},
      //   updaate: () => {},
    };

    fakeAuthService = {
      //   signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    // service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list of users with the given email', async () => {
    const users = await controller.findMultipleUSers('qwe@qwe.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('qwe@qwe.com');
  });

  it('findUser returns a single user with the given id ', async () => {
    const user = await controller.findUser('qwe@qwe.com');

    expect(user).toBeDefined();
    expect(user.email).toEqual('qwe@qwe.com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('sign in updates session and returns user', async () => {
    const session = { userId: -1 };

    const user = await controller.signin(
      {
        email: 'qwe@qwe.com',
        password: 'qwe',
      },
      session,
    );

    expect(user.id).toEqual(1);

    expect(session.userId).toEqual(1);
  });
});
