import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import models from '../models';

let router = express.Router();

router.post('/', (req, res) => {
  let user;
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({error: 'Invalid data parameters.'});
  }
  models.User.findOne({
    where: {
      username: req.body.username
    }
  }).then((foundUser) => {
    if (!foundUser) {
      throw 'User with this username not found.';
    }
    user = foundUser;
    let hashedPassword = user.password;
    return models.User.checkPassword(req.body.password, hashedPassword);
  }).then((isValid) => {
    if (isValid) {
      let token = jwt.sign({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }, config.jwtKey);
      return res.status(200).json({token: token});
    } else {
      return res.status(403).json({error: 'Incorrect password'});
    }
  }).catch((error) => {
    return res.status(404).json({error: error});
  });
});

export default router;
