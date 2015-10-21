let homeController = ($scope, $rootScope, $state, authentication) => {
  $scope.hasToken = $rootScope.isLoggedIn || authentication.getToken() !== undefined;
  console.log('$scope.userData', $scope.userData);
  $scope.userData = $rootScope.userData || authentication.getUserData();
  $scope.userRole = authentication.getUserData().role;
  console.log('$scope.userData', $scope.userData);

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
