let homeController = ($scope, $state, authentication) => {
  $scope.hasToken = authentication.getToken() ? true : false;
  $scope.userData = authentication.getUserData();

  $scope.toLoginPage = () => {
    $state.go('login');
  };

  $scope.toSignupPage = () => {
    $state.go('signup');
  };

  $scope.toRunsPage = () => {
    $state.go('signup');
  };

  $scope.toUsersPage = () => {
    $state.go('signup');
  };

};

export default homeController;
