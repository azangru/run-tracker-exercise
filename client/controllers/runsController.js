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
      // dates come as strings over json, so transform them back to dates
      $scope.runs.forEach((run) => {
        run.date = new Date(run.date);
      });
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

  $scope.submitUpdatedRun = (id, date, distance, time) => {
    let token = authentication.getToken();
    let headers = {'x-access-token': token};
    let url = `/api/users/${$stateParams.userId}/runs/${id}`;
    $http.put(url, {date, distance, time}, {headers}).then((data) => {
      $scope.stopEditing();
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

  $scope.startEditing = (id) => {
    $scope.editEntry = id;
  };

  $scope.stopEditing = () => {
    $scope.editEntry = '';
  };

  $scope.changeStringToDate = (string) => {
    return new Date(string);
  }

  $scope.toLoginPage = () => {
    $state.go('root.login');
  };

};

export default runsController;
