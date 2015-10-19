import combineReducers from 'redux';
import userReducer from './userReducer';

let reducers = combineReducers({user: userReducer});

export default reducers;
