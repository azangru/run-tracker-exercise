import jwt from 'jsonwebtoken';

let authenticationService = ($localStorage, $http) => {
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
        this.storeUserData(userData);
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
      console.log('user', user);
      $localStorage.user = user;
      $localStorage.token = data.token;
    }
  };

};

export default authenticationService;
