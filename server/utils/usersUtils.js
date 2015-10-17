import jwt from 'jsonwebtoken';
import R from 'ramda';

const roles = {
  1: 'common',
  2: 'manager',
  3: 'admin'
};

let getIdFromToken = (req) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  let decodedToken = jwt.decode(token);
  return decodedToken.id;
};

let isUserA = (allowedRoles, foundUser) => {
  let role = roles[foundUser.role];
  if (R.contains(role, allowedRoles)) {
    return true;
  } else {
    return false;
  }
};

let prepareUserDataForResponse = (data) => {
  let allowedProperties = ['id', 'username', 'firstName', 'lastName', 'role'];
  if (R.type(data) === 'Array') {
    return R.map(R.pick(allowedProperties), data);
  }
  if (R.type(data) === 'Object') {
    return R.pick(allowedProperties, data);
  }
};

export default {getIdFromToken, isUserA, prepareUserDataForResponse};
