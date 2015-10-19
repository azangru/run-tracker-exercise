let authenticationService = ($localStorage, $http) => {
  return {
    getToken() {
      return $localStorage.token;
    },
    saveToken(token) {
      $localStorage.token = token;
    },
    authenticate(username, password) {
      $http.post({
        url: '/api/login',
        data: {
          username: username,
          password: password
        }
      }).then((data) => {
        console.log('received data from login!', data);
        return data;
      }, (data) => {
        console.log('received error from login!', data);
        return data;
      });
    }
  };

};

export default authenticationService;
