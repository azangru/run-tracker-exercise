import express from 'express';
import users from './users.js';

let router = express.Router();

router.use('/users', users);

router.get('/', (req, res) => {
  res.json({message: 'hello!'});
});

export default router;
