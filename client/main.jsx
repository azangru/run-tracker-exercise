import React from 'react';
import ReactDOM from 'react-dom'

class HelloWorld extends React.Component {
  render() {
    return <p>Hello, world!</p>;
  }
}

// export default HelloWorld;

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('main')
);
