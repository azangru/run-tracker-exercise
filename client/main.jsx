import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import store from './store/store';


// class HelloWorld extends React.Component {
//   render() {
//     return <p>Hello, world!</p>;
//   }
// }

// export default HelloWorld;
//
// render(
//   <HelloWorld />,
//   document.getElementById('main')
// );


render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('main')
);
