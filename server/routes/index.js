import express from 'express';
import users from './users.js';
import login from './login.js';

let router = express.Router();

router.use('/users', users);

router.use('/login', login);

router.get('/', (req, res) => {
  res.json({message: 'hello!'});
});

export default router;
