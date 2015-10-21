let usersController = ($scope, $state, $http, authentication) => {

  if (authentication.getUserData().role === 1) {
    console.log('YOU SHALL NOT PASS!');
    $state.go('root.login');
  }
};

export default usersController;
