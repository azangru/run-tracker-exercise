import app from '../../server/app.js';
import models from '../../server/models';
import chai from 'chai';
import request  from 'supertest';
let expect = chai.expect;


describe('Login Router', () => {

  beforeEach((done) => {
    models.sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log('stupid error while creating a test db:', err);
    });
  });

  beforeEach((done) => {
    let password = 'very-secret-password';
    models.User.hashPassword(password).then((hashedPassword) => {
      return models.User.create({
        username: 'jsmith',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Smith'
      });
    }).then((newUser) => {
      done();
    });
  });

  it('returns a token if the username and the password are correct', (done) => {
    request(app).post('/api/login')
    .send({
      username: 'jsmith',
      password: 'very-secret-password'
    })
    .expect(200)
    .end((err, response) => {
      expect(response.body.token).to.exist;
      done();
    });
  });

  it('returns an error if there is no user with such username', (done) => {
    request(app).post('/api/login')
    .send({
      username: 'janesmith',
      password: 'very-secret-password'
    })
    .expect(404)
    .end((err, response) => {
      expect(response.body.error).to.exist;
      expect(response.body.error).to.equal('User with this username not found.');
      done();
    });
  });

  it('returns an error if the password is incorrect', (done) => {
    request(app).post('/api/login')
    .send({
      username: 'jsmith',
      password: 'wrong-password'
    })
    .expect(403)
    .end((err, response) => {
      expect(response.body.error).to.exist;
      expect(response.body.error).to.equal('Incorrect password');
      done();
    });
  });

});
