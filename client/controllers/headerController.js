let headerController = ($scope, $rootScope, $state, authentication) => {
  $scope.isLoggedIn = $rootScope.isLoggedIn;

  $scope.logout = () => {
    authentication.logout();
    $rootScope.isLoggedIn = false;
    $state.go('root.login');
  };

  $rootScope.$watch('isLoggedIn', () => {
    $scope.isLoggedIn = $rootScope.isLoggedIn;
  });

};

export default headerController;
