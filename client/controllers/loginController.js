let loginController = ($scope, $rootScope, $state, authentication) => {
  $scope.username = '';
  $scope.password = '';

  $scope.login = () => {
    authentication.authenticate($scope.username, $scope.password);
  };

  $scope.toSignupPage = () => {
    $state.go('root.signup');
  };

};

export default loginController;
