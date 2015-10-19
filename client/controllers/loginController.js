let loginController = ($scope, $state, authentication) => {
  $scope.username = '';
  $scope.password = '';

  $scope.login = () => {
    authentication.authenticate($scope.username, $scope.password);
  };

  $scope.toSignupPage = () => {
    $state.go('signup');
  };

};

export default loginController;
