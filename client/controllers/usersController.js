import R from 'ramda';

let usersController = ($scope, $state, $http, authentication) => {

  $scope.viewerData = authentication.getUserData();

  if ($scope.viewerData.role === 1) {
    console.log('YOU SHALL NOT PASS!');
    $state.go('root.login');
  }

  $scope.roles = {
    1: 'user',
    2: 'user manager',
    3: 'admin'
  };

  $scope.getUsers = () => {
    let token = authentication.getToken();
    let headers = {'x-access-token': token};
    let url = '/api/users/';
    $http({
      url: url,
      headers: headers
    }).then((data) => {
      $scope.users = data.data;
    }, (data) => {
      if (data.status === 401) {
        $scope.toLoginPage();
      }
      return data;
    });
  };
  $scope.getUsers();

  $scope.submitUpdatedUser = (id, username, firstName, lastName, role) => {
    let token = authentication.getToken();
    let headers = {'x-access-token': token};
    let url = `/api/users/${id}`;
    $http.put(url, {username, firstName, lastName, role}, {headers}).then((data) => {
      $scope.stopEditing();
    }, (data) => {
      if (data.status === 401) {
        $scope.toLoginPage();
      }
      return data;
    });
  };

  $scope.deleteUser = (userId) => {
    let token = authentication.getToken();
    let headers = {'x-access-token': token};
    let url = `/api/users/${userId}`;
    $http.delete(url, {headers}).then(() => {
      let userIndex = R.findIndex(R.propEq('id', userId), $scope.users);
      $scope.users.splice(userIndex, 1);
      $scope.stopEditing();
    });
  };

  $scope.startEditing = (id) => {
    $scope.editEntry = id;
  };

  $scope.stopEditing = () => {
    $scope.editEntry = '';
  };

};

export default usersController;
