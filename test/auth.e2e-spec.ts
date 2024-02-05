import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'qwe@qweqwe.qwe';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'qazwsx' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id);
        expect(email).toEqual(email);
      });
  });

  it('signup as a new user then get the cirrently logged in user', async () => {
    const email = 'asdasdas@asdasdasd.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'qazwsx' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
