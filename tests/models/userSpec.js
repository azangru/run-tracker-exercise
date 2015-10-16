import models from '../../server/models';
import chai from 'chai';
let expect = chai.expect;

describe('User', () => {
  let User = models.User;

  describe('hashPassword function', () => {

    it('exists', () => {
      expect(User.hashPassword).to.exist;
    });

    it('returns a hashed password asynchronously', (done) => {
      let password = 'secret';
      User.hashPassword(password).then((passwordHash) => {
        // Confirm that the passwordHash is not null
        expect(passwordHash).to.exist;
        done();
      });
    });

  });

  describe('checkPassword function', () => {

    it('exists', () => {
      expect(User.checkPassword).to.exist;
    });

    it('checks the hashed password correcly', (done) => {
      let password = 'secret';
      User.hashPassword(password).then((passwordHash) => {
        return User.checkPassword(password, passwordHash);
      }).then((result) => {
        expect(result).to.equal(true);
        done();
      });
    });

    it('checks the hashed password correcly', (done) => {
      let password = 'secret';
      let wrongPassword = 'boo-hoo!';
      User.hashPassword(password).then((passwordHash) => {
        return User.checkPassword(wrongPassword, passwordHash);
      }).then((result) => {
        expect(result).to.equal(false);
        done();
      });
    });

  });

});
