import jwt from 'jsonwebtoken';

let authenticationService = ($localStorage, $rootScope, $state, $http) => {
  return {
    getToken() {
      return $localStorage.token;
    },
    getUserData() {
      return $localStorage.user;
    },
    saveToken(token) {
      $localStorage.token = token;
    },
    authenticate(username, password) {
      $http.post('/api/login',
        {
          username: username,
          password: password
        }
      ).then((data) => {
        console.log('received data from login!', jwt.decode(data.data.token));
        let userData = jwt.decode(data.data.token);
        userData.token = data.data.token;
        $rootScope.isLoggedIn = true;
        $rootScope.userData = jwt.decode(data.data.token);
        this.storeUserData(userData);
        $state.go('root.home');
      }, (data) => {
        console.log('received error from login!', data);
        return data;
      });
    },
    signup(username, password, firstName, lastName) {
      $http.post('/api/users',
        { username, password, firstName, lastName }
      ).then((data) => {
        console.log('received data from signup!', data);
        this.storeUserData(data.data);
        $rootScope.isLoggedIn = true;
        $rootScope.userData = data.data;
        $state.go('root.home');
      }, (data) => {
        console.log('received error from signup!', data);
        return data;
      });
    },
    storeUserData(data) {
      let user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      };
      $localStorage.user = user;
      $localStorage.token = data.token;
    },
    logout() {
      $localStorage.$reset();
      $rootScope.isLoggedIn = false;
      $rootScope.userData = undefined;
    }
  };

};

export default authenticationService;
