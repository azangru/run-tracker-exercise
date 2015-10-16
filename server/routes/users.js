import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import models from '../models';

let router = express.Router();

router.get('/', (req, res) => {
  res.json({message: 'i am users router'});
});

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
    newUser = newUser.dataValues;
    newUser.token = jwt.sign({id: newUser.id}, config.jwtKey);
    res.json(newUser);
  }).catch((err) => {
    let error = {error: 'Invalid data parameters.'};
    error.errors = err.errors;
    return res.status(400).json(error);
  });
});


export default router;