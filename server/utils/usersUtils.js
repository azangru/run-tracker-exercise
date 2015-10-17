import jwt from 'jsonwebtoken';
import R from 'ramda';
import models from '../models';
import Promise from 'bluebird';

const roles = {
  1: 'common',
  2: 'manager',
  3: 'admin'
};

let getIdFromToken = (req) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  let decodedToken = jwt.decode(token);
  return decodedToken.id.toString();
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

// in a situation when a user is already available and its role checked,
// but it's still unsure which user object should be manipulated,
// return the correct user object for further manipulations
let getUser = (user, idFromParams) => {
  let returnUser = new Promise((resolve, reject) => {
    if (user.id.toString() === idFromParams) {
      resolve(user);
    } else {
      models.User.findById(idFromParams).then((user) => {
        resolve(user);
      });
    }
  });
  return returnUser;
};

let permittedUserParameters = (params, role) => {
  let allowedProperties = ['username', 'password', 'firstName', 'lastName'];
  if (role === 3) {
    allowedProperties.push('role');
  }
  let permittedParameters = R.pick(allowedProperties, params);
  return permittedParameters;
};

export default {getIdFromToken, isUserA, prepareUserDataForResponse, getUser, permittedUserParameters};
