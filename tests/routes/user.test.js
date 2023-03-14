const request = require('supertest');
const app = require('../../src/app.js');
const { conn, User } = require('../../src/db.js');

describe('User Routes Tests', () => {
 
  beforeEach(async () => {
    await conn.sync({ force: true }); 
  });

  describe('POST /createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        id: "usuario1",
        name: 'Julio',
        lastName: 'Segundo Diaz',
        birthdate: '02/04/2023',
        phoneNumber: 9178875234,
        city: 'New York',
        country: 'USA',
        address: '123 Main St'
      };

      const response = await request(app)
        .post('/user/createUser')
        .send(newUser)
        .expect(200);

      expect(response.body.id).toBe(newUser.id);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.lastName).toBe(newUser.lastName);
      expect(new Date(response.body.birthdate)).toEqual(new Date(newUser.birthdate));
      expect(response.body.phoneNumber).toBe(newUser.phoneNumber.toString());
      expect(response.body.city).toBe(newUser.city);
      expect(response.body.country).toBe(newUser.country);
      expect(response.body.address).toBe(newUser.address);

      const users = await User.findAll();

      expect(users.length).toBe(1);
      expect(users[0].id).toBe(newUser.id);
    });
  });

  describe('GET /getUsers', () => {
    it('should return an array of users', async () => {
      const users = [
        {id: 1, name: 'John',lastName: 'Doe',birthdate: '1990-01-01', phoneNumber: '1234567890', city: 'New York', country: 'USA',address: '123 Main St'},
        {id: 2,name: 'Jane',lastName: 'Doe',birthdate: '1995-01-01',phoneNumber: '0987654321',city: 'Los Angeles',country: 'USA',address: '456 Elm St'}];

      await User.bulkCreate(users);

      const response = await request(app).get('/user/getUsers').expect(200);

      expect(response.body.length).toBe(users.length);
      expect(parseInt(response.body[0].id)).toBe(users[0].id);
      expect(parseInt(response.body[1].id)).toBe(users[1].id);
    });
  });
});