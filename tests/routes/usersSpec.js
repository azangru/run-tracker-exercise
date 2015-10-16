import app from '../../server/app.js';
import models from '../../server/models';
import chai from 'chai';
import request  from 'supertest';
let expect = chai.expect;

describe('Users Router', () => {

  beforeEach((done) => {
    models.sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log('stupid error while creating a test db:', err);
    });
  });

  describe('Create user route', () => {

    it('creates a new user', (done) => {
      request(app).post('/api/users')
      .send({
        username: 'jsmith',
        password: 'secret-password',
        firstName: 'John',
        lastName: 'Smith'
      })
      .expect(200)
      .end((err, response) => {
        expect(response.body.username).to.equal('jsmith');
        expect(response.body).to.have.property('password');
        expect(response.body.password).not.to.equal('secret-password');
        expect(response.body.firstName).to.equal('John');
        expect(response.body.lastName).to.equal('Smith');
        expect(response.body.role).to.equal(1);
        expect(response.body).to.have.property('token');
        done();
      });
    });

    it('returns an error if a user with the provided username already exists', (done) => {
      models.User.create({
        username: 'jsmith',
        password: 'whatever',
        firstName: 'doesnt matter',
        lastName: 'doesnt matter either'
      }).then(() => {
        request(app).post('/api/users')
        .send({
          username: 'jsmith',
          password: 'secret-password',
          firstName: 'John',
          lastName: 'Smith'
        })
        .expect(400, done);
      });
    });

  });

});
