let signupController = ($scope, $state, authentication) => {
  $scope.username = '';
  $scope.password = '';
  $scope.firstName = '';
  $scope.lastName = '';

  $scope.signup = () => {
    authentication.signup(
      $scope.username,
      $scope.password,
      $scope.firstName,
      $scope.lastName
    );
  };

};


export default signupController;
