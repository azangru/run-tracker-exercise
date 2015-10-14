import express from 'express';

let router = express.Router();

router.get('/', (req, res) => {
  res.json({message: 'i am users router'});
});

export default router;
