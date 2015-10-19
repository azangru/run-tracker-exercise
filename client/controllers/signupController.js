let signupController = ($scope, $state, authentication) => {
  $scope.username = '';
  $scope.password = '';
  $scope.firstName = '';
  $scope.lastName = '';

  $scope.signup = () => {
    console.log('signing up');
  };

};


export default signupController;
