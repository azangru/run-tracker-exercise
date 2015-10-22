let homeController = ($scope, $rootScope, $state, authentication) => {
  $scope.hasToken = $rootScope.isLoggedIn || authentication.getToken() !== undefined;
  // i really have no idea why the line below doesn't work and the hack with the rootscope does. Makes no sense
  // $scope.userData = $rootScope.userData || authentication.getUserData();
  $rootScope.userData = $rootScope.userData || authentication.getUserData();

  $scope.toLoginPage = () => {
    $state.go('root.login');
  };

  $scope.toSignupPage = () => {
    $state.go('root.signup');
  };

  $scope.toRunsPage = () => {
    let user = authentication.getUserData();
    $state.go('root.runs', {userId: user.id});
  };

  $scope.toUsersPage = () => {
    $state.go('root.users');
  };

  $rootScope.$watch('isLoggedIn', () => {
    $scope.hasToken = $rootScope.isLoggedIn;
    $scope.userData = $rootScope.userData;
  });

};

export default homeController;
