import app from '../../server/app.js';
import models from '../../server/models';
import chai from 'chai';
import request  from 'supertest';
import R from 'ramda';
import jwt from 'jsonwebtoken';
import config from '../../server/config/config.js';
let expect = chai.expect;

describe('Runs Router', () => {

  beforeEach((done) => {
    models.sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log('stupid error while creating a test db:', err);
    });
  });

  // create a user and the user’s run data
  let user1;
  let token1;
  let run1;

  beforeEach((done) => {
    models.User.create({
      username: 'jsmith',
      password: 'secret-password',
      firstName: 'John',
      lastName: 'Smith'
    }).then((newUser) => {
      user1 = newUser;
      token1 = jwt.sign({id: newUser.id}, config.jwtKey);
      return user1.createRun({
        distance: 1000,
        time: 10,
        date: new Date()
      });
    }).then((run) => {
      run1 = run;
      done();
    });
  });

  describe('List runs route', () => {

    it('returns an array of runs', (done) => {
      request(app).get('/api/users/1/runs')
      .query({
        token: token1
      })
      .expect(200)
      .end((err, response) => {
        expect(R.type(response.body)).to.equal('Array');
        expect(response.body.length).to.equal(1);
        let testRun = R.find(R.propEq({id: 1}));
        expect(testRun).to.exist;
        done();
      });
    });

  });

  describe('Create run route', () => {

    it('creates a new run', (done) => {
      request(app).post('/api/users/1/runs')
      .send({
        distance: 2500,
        time: 12,
        date: new Date(),
        token: token1
      })
      .expect(200)
      .end((err, response) => {
        user1.getRuns().then((runs) => {
          expect(R.type(runs)).to.equal('Array');
          expect(runs.length).to.equal(2);
          let testRun = R.find(R.propEq({id: 2}));
          expect(testRun).to.exist;
          done();
        });
      });
    });

    it('sends back the created run', (done) => {
      request(app).post('/api/users/1/runs')
      .send({
        distance: 2500,
        time: 12,
        date: new Date(),
        token: token1
      })
      .expect(200)
      .end((err, response) => {
        expect(R.type(response.body)).to.equal('Object');
        expect(response.body.id).to.equal(2);
        done();
      });
    });

  });

  describe('Show run route', () => {

    it('sends back a run entry', (done) => {
      request(app).get('/api/users/1/runs/1')
      .query({
        token: token1
      })
      .expect(200)
      .end((err, response) => {
        expect(R.type(response.body)).to.equal('Object');
        expect(response.body.id).to.equal(1);
        done();
      });
    });

  });

  describe('Update run route', () => {

    it('updates a run entry', (done) => {
      request(app).put('/api/users/1/runs/1')
      .send({
        distance: 2500,
        token: token1
      })
      .expect(200)
      .end((err, response) => {
        user1.getRuns({where: {id: 1}}).then((runs) => {
          let run = runs[0];
          expect(run.distance).to.equal(2500);
          done();
        });
      });
    });

    it('sends back the updated run entry', (done) => {
      request(app).put('/api/users/1/runs/1')
      .send({
        distance: 2500,
        token: token1
      })
      .expect(200)
      .end((err, response) => {
        expect(R.type(response.body)).to.equal('Object');
        expect(response.body.id).to.equal(1);
        expect(response.body.distance).to.equal(2500);
        done();
      });
    });

  });

  describe('Destroy run route', () => {

    it('deletes a run entry', (done) => {
      request(app).del('/api/users/1/runs/1')
      .send({
        token: token1
      })
      .expect(204)
      .end((err, response) => {
        user1.getRuns({where: {id: 1}}).then((runs) => {
          expect(runs.length).to.equal(0);
          done();
        });
      });
    });

  });

});
