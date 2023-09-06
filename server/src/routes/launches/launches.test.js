const request = require('supertest');

const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe('Test GET /v1/launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });
  describe('Test POST /v1/launches', () => {
    const payload = {
      mission: 'ZTM155',
      rocket: 'ZTM Explorer IS1',
      launchDate: 'January 17, 2020',
      target: 'Kepler-296 A f',
    };

    const payloadWithoutDate = {
      mission: 'ZTM155',
      rocket: 'ZTM Explorer IS1',
      target: 'Kepler-296 A f',
    };
    const payloadWithInvalidDate = {
      mission: 'ZTM155',
      rocket: 'ZTM Explorer IS1',
      target: 'Kepler-296 A f',
      launchDate: 'Hello World',
    };

    test('It should respond with 201 success', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(payload.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(payloadWithoutDate);
    });

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(payloadWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        success: false,
        error: 'Missing required launch property',
      });
    });

    test('It should catch invalid date', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(payloadWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        success: false,
        error: 'Invalid launch date',
      });
    });
  });
});
