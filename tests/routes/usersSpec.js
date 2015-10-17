import app from '../../server/app.js';
import models from '../../server/models';
import chai from 'chai';
import request  from 'supertest';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import {prepareUserDataForResponse} from '../../server/utils/usersUtils.js';
import config from '../../server/config/config.js';
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

  describe('User routes requiring authentication', () => {

    // will create 3 users with different roles
    let user1, user2, user3;
    let token1, token2, token3;

    beforeEach((done) => {
      let createUser1 = models.User.create({
        username: 'jsmith',
        password: 'secret-password',
        firstName: 'John',
        lastName: 'Smith',
        role: 1
      }).then((newUser) => {
        user1 = prepareUserDataForResponse(newUser);
        token1 = jwt.sign({id: newUser.id}, config.jwtKey);
      });

      let createUser2 = models.User.create({
        username: 'jbull',
        password: 'secret-password',
        firstName: 'John',
        lastName: 'Bull',
        role: 2
      }).then((newUser) => {
        user2 = prepareUserDataForResponse(newUser);
        token2 = jwt.sign({id: newUser.id}, config.jwtKey);
      });

      let createUser3 = models.User.create({
        username: 'jfrost',
        password: 'secret-password',
        firstName: 'John',
        lastName: 'Frost',
        role: 3
      }).then((newUser) => {
        user3 = prepareUserDataForResponse(newUser);
        token3 = jwt.sign({id: newUser.id}, config.jwtKey);
      });

      Promise.all([createUser1, createUser2, createUser3]).then(() => {
        done();
      });
    });

    describe('List users route', () => {
      it('returns an array of users if the request sender has sufficient privileges', (done) => {
        request(app).get('/api/users')
        .query({
          token: token2
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body.length).to.equal(3);
          expect(response.body).to.contain(user1);
          expect(response.body).to.contain(user2);
          expect(response.body).to.contain(user3);
          done();
        });
      });

      it('returns an error if the request sender does not have sufficient privileges', (done) => {
        request(app).get('/api/users')
        .query({
          token: token1
        })
        .expect(401)
        .end((err, response) => {
          expect(response.body).to.eql({
            success: false,
            message: 'Not enough privileges to access the data.'
          });
          done();
        });
      });

    });

    describe('Show user route', () => {

      it('returns user’s data if the request sender is the same user', (done) => {
        request(app).get('/api/users/1')
        .query({
          token: token1
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.eql(user1);
          done();
        });
      });

      it('returns a user’s data if the request sender is a user manager', (done) => {
        request(app).get('/api/users/1')
        .query({
          token: token2
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.eql(user1);
          done();
        });
      });

      it('returns a user’s data if the request sender is an admin', (done) => {
        request(app).get('/api/users/1')
        .query({
          token: token3
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.eql(user1);
          done();
        });
      });

      it('returns an error if the request sender does not have sufficient privileges', (done) => {
        request(app).get('/api/users/2')
        .query({
          token: token1
        })
        .expect(401)
        .end((err, response) => {
          expect(response.body).to.eql({
            success: false,
            message: 'Not enough privileges to access the data.'
          });
          done();
        });
      });

    });

    describe('Update user route', () => {

      it('updates user’s data if the request sender is the same user', (done) => {
        request(app).put('/api/users/1')
        .send({
          username: 'jsmith-new',
          password: 'new-secret-password',
          firstName: 'John',
          lastName: 'Smith-New',
          token: token1
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body.username).to.equal('jsmith-new');
          expect(response.body.lastName).to.equal('Smith-New');
          done();
        });
      });

      it('updates user’s data if the request sender is user manager', (done) => {
        request(app).put('/api/users/1')
        .send({
          username: 'jsmith-new',
          password: 'new-secret-password',
          firstName: 'John',
          lastName: 'Smith-New',
          token: token2
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body.username).to.equal('jsmith-new');
          expect(response.body.lastName).to.equal('Smith-New');
          done();
        });
      });

      it('updates user’s data if the request sender is an admin', (done) => {
        request(app).put('/api/users/1')
        .send({
          username: 'jsmith-new',
          password: 'new-secret-password',
          firstName: 'John',
          lastName: 'Smith-New',
          token: token2
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body.username).to.equal('jsmith-new');
          expect(response.body.lastName).to.equal('Smith-New');
          done();
        });
      });

      it('does not update user’s data if the request sender does not have sufficient privileges', (done) => {
        request(app).put('/api/users/2')
        .send({
          username: 'jsmith-new',
          password: 'new-secret-password',
          firstName: 'John',
          lastName: 'Smith-New',
          token: token1
        })
        .expect(401)
        .end((err, response) => {
          expect(response.body).to.eql({
            success: false,
            message: 'Not enough privileges to modify the data.'
          });
          done();
        });
      });

      it('allows the admin to update a user’s role', (done) => {
        request(app).put('/api/users/1')
        .send({
          role: 2,
          token: token3
        })
        .expect(401)
        .end((err, response) => {
          expect(response.body.role).to.equal(2);
          done();
        });
      });

      it('does not allow ordinary users to update their roles', (done) => {
        request(app).put('/api/users/1')
        .send({
          role: 2,
          token: token1
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body.role).to.equal(1);
          done();
        });
      });

      it('does not allow user managers to update user roles', (done) => {
        request(app).put('/api/users/2')
        .send({
          role: 3,
          token: token2
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body.role).to.equal(2);
          done();
        });
      });

    });

    describe('Delete user route', () => {

      it('deletes a user if the request sender is the same user', (done) => {
        request(app).del('/api/users/1')
        .send({
          token: token1
        })
        .expect(204)
        .end((err, response) => {
          models.User.findById(1).then((user) => {
            expect(user).to.equal(null);
            done();
          });
        });
      });

      it('deletes a user if the request sender is a user manager', (done) => {
        request(app).del('/api/users/1')
        .send({
          token: token2
        })
        .expect(204)
        .end((err, response) => {
          models.User.findById(1).then((user) => {
            expect(user).to.equal(null);
            done();
          });
        });
      });

      it('deletes a user if the request sender is an admin', (done) => {
        request(app).del('/api/users/1')
        .send({
          token: token3
        })
        .expect(204)
        .end((err, response) => {
          models.User.findById(1).then((user) => {
            expect(user).to.equal(null);
            done();
          });
        });
      });

      it('does not delete a user if the request sender does not have sufficient privileges', (done) => {
        request(app).del('/api/users/2')
        .send({
          token: token1
        })
        .expect(401)
        .end((err, response) => {
          models.User.findById(1).then((user) => {
            expect(user).to.exist;
            done();
          });
        });
      });

    });

  });

});
