import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

// @connect((state) => {
//   return {
//     reduxState: state
//   };
// }, {pushState})
class App extends React.Component {
  render() {
    return (
      <div>
        <p>Hello world!</p>
        {this.props.children}
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    reduxState: state
  };
};

export default connect(mapStateToProps, {pushState})(App);
