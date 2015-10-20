let runsController = ($scope, $state, $stateParams, $http, authentication) => {
  $scope.hasToken = authentication.getToken() ? true : false;
  $scope.userData = authentication.getUserData();
  $scope.newRun = {};
  $scope.isAddingNew = false;

  $scope.getRuns = () => {
    let token = authentication.getToken();
    let headers = {'x-access-token': token};
    let url = `/api/users/${$stateParams.userId}/runs`;
    $http.get(url, {headers}).then((data) => {
      $scope.runs = data.data;
      console.log($scope.runs);
    }, (data) => {
      if (data.status === 401) {
        $scope.toLoginPage();
      }
      return data;
    });
  };
  $scope.getRuns();

  $scope.submitNewRun = () => {
    let token = authentication.getToken();
    let headers = {'x-access-token': token};
    let url = `/api/users/${$stateParams.userId}/runs`;
    $http.post(url, $scope.newRun, {headers}).then((data) => {
      $scope.runs.unshift($scope.newRun);
      $scope.newRun = {};
      $scope.isAddingNew = false;
    }, (data) => {
      if (data.status === 401) {
        $scope.toLoginPage();
      }
      return data;
    });
  };

  $scope.openAddNewForm = () => {
    $scope.isAddingNew = true;
  };

  $scope.toLoginPage = () => {
    $state.go('login');
  };

};

export default runsController;
