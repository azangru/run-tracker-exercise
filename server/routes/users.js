import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import models from '../models';
import authenticate from '../middleware/authentication.js';
import {getIdFromToken, isUserA, prepareUserDataForResponse} from '../utils/usersUtils.js';

let router = express.Router();

router.post('/', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({error: 'Invalid data parameters.'});
  }
  models.User.hashPassword(req.body.password).then((hashedPassword) => {
    return models.User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
  }).then((newUser) => {
    newUser = prepareUserDataForResponse(newUser);
    newUser.token = jwt.sign({id: newUser.id}, config.jwtKey);
    res.json(newUser);
  }).catch((err) => {
    let error = {error: 'Invalid data parameters.'};
    error.errors = err.errors;
    return res.status(400).json(error);
  });
});

// will use authentication on other user routes
router.use(authenticate);

router.get('/', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    if (isUserA(['manager', 'admin'], user)) {
      return models.User.findAll().then((users) => {
        res.json(prepareUserDataForResponse(users));
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to access the data.'
      });
    }
  });
});

export default router;
