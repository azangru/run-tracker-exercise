import React from 'react';
import { connect } from 'react-redux';

@connect((state) => {
  return {
    reduxState: state
  };
})
class Login extends React.Component {
  componentDidMount() {
    console.log('heyheyhey!!!');
  }
  render() {
    return <p>Log in!</p>;
  }
}

export default Login;
