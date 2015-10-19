import {combineReducers} from 'redux';
import { routerStateReducer } from 'redux-router';
import userReducer from './userReducer';

let reducers = combineReducers({
  user: userReducer,
  router: routerStateReducer
});

export default reducers;
