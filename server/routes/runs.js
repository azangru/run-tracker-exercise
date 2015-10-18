import express from 'express';
import models from '../models';
import userUtils from '../utils/usersUtils.js';
let getIdFromToken = userUtils.getIdFromToken;
let isUserA = userUtils.isUserA;
let getUser = userUtils.getUser;
import runUtils from '../utils/runsUtils.js';
let permittedRunParameters = runUtils.permittedRunParameters;


let router = express.Router({mergeParams: true});

// LIST RUNS
router.get('/', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // ordinary users can only view their own data
    if (isUserA(['common'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to view the data.'
      });
    }
    getUser(user, req.params.id).then((user) => {
      user.getRuns().then((runs) => {
        res.json(runs);
      });
    });
  });
});

// CREATE A RUN
router.post('/', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // users can create only their own data
    if (userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to create a run.'
      });
    }
    user.createRun(permittedRunParameters(req.body))
      .then((run) => {
        res.json(run);
      })
      .catch((err) => {
        let error = {error: 'Invalid data parameters.'};
        error.errors = err.errors;
        return res.status(400).json(error);
      });
  });
});

// SHOW A RUN
router.get('/:runId', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // users can create only their own data
    if (isUserA(['common'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to access the data.'
      });
    }
    user.getRuns({where: {id: req.params.runId}}).then((runs) => {
      res.json(runs[0]);
    });
  });
});

// UPDATE A RUN
router.put('/:runId', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // users can create only their own data
    if (isUserA(['common', 'manager'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to modify the data.'
      });
    }
    user.getRuns({where: {id: req.params.runId}}).then((runs) => {
      let run = runs[0];
      return run.update(permittedRunParameters(req.body));
    }).then((updatedRun) => {
      res.json(updatedRun);
    });
  });
});

// DELETE A RUN
router.delete('/:runId', (req, res) => {
  let userId = getIdFromToken(req);
  models.User.findById(userId).then((user) => {
    // users can create only their own data
    if (isUserA(['common', 'manager'], user) && userId !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: 'Not enough privileges to modify the data.'
      });
    }
    models.Run.destroy({where: {id: req.params.runId}}).then(() => {
      // The 204 response MUST NOT include a message-body
      res.status(204).end();
    });
  });
});


export default router;
