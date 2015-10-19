let homeController = ($scope, $state, authentication) => {
  $scope.hasToken = authentication.getToken() ? true : false;

  $scope.toLoginPage = () => {
    $state.go('login');
  };

  $scope.toSignupPage = () => {
    $state.go('signup');
  };

};

export default homeController;
