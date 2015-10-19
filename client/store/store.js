import { createStore, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import reducers from '../reducers';
import routes from '../routes.jsx';


let finalCreateStore = compose(
  reduxReactRouter({ routes, createHistory })
)(createStore);

let store = finalCreateStore(reducers);

export default store;
