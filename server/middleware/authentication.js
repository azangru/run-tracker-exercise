import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Promise from 'bluebird';
let jwtVerifyAsync = Promise.promisify(jwt.verify, jwt);

let authenticate = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwtVerifyAsync(token, config.jwtKey)
      .then(() => {
        next();
      })
      .catch(() => {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      });
  } else {
    return res.status(401).json({
      success: false,
      message: 'No token provided.'
    });
  }
};

export default authenticate;
