import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import models from '../models';
import authenticate from '../middleware/authentication.js';
import userUtils from '../utils/usersUtils.js';
let getIdFromToken = userUtils.getIdFromToken;
let isUserA = userUtils.isUserA;
let prepareUserDataForResponse = userUtils.prepareUserDataForResponse;
let getUser = userUtils.getUser;
let permittedUserParameters = userUtils.permittedUserParameters;

let router = express.Router();

// CREATE USER
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

// LIST USERS
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

// SHOW A USER
router.get('/:id', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // ordinary users can only get user info about themselves
    if (isUserA(['common'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to access the data.'
      });
    }
    if (userId === req.params.id) {
      // returns the already available user data if the request sender
      // is the same user
      res.json(prepareUserDataForResponse(user));
    } else {
      // fetch the user with the id indicated in the params
      models.User.findById(req.params.id).then((user) => {
        res.json(prepareUserDataForResponse(user));
      });
    }
  });
});

// UPDATE A USER
router.put('/:id', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // ordinary users can only update info about themselves
    if (isUserA(['common'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to modify the data.'
      });
    }
    let updatedParameters = permittedUserParameters(req.body, user.role);
    // get the user for updating (could be already retrieved user or a different one)
    getUser(user, req.params.id).then((user) => {
      if (updatedParameters.password) {
        models.User.hashPassword(updatedParameters.password).then((hashedPassword) => {
          updatedParameters.password = hashedPassword;
          return user.update(updatedParameters);
        }).then(() => {
          return models.User.findById(req.params.id);
        }).then((user) => {
          res.json(prepareUserDataForResponse(user));
        });
      } else {
        return user.update(updatedParameters).then(() => {
          return models.User.findById(req.params.id);
        }).then((user) => {
          res.json(prepareUserDataForResponse(user));
        });
      }
    });
  });
});

// DELETE A USER
router.delete('/:id', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // ordinary users can only get user info about themselves
    if (isUserA(['common'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges modify the data.'
      });
    }
    getUser(user, req.params.id).then((user) => {
      user.destroy().then(() => {
        // The 204 response MUST NOT include a message-body
        res.status(204).end();
      });
    });
  });
});

export default router;
