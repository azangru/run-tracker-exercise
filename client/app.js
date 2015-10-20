import angular from 'angular';
import router from 'angular-ui-router';
import ngstorage from 'ngstorage';
import homeController from './controllers/homeController';
import runsController from './controllers/runsController';
import loginController from './controllers/loginController';
import signupController from './controllers/signupController';
import authenticationService from './services/authenticationService';

let runTracker = angular.module('runTracker', [
  'ui.router',
  'ngStorage'
])
.config(($locationProvider, $stateProvider) => {
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: homeController
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: loginController
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: signupController
    })
    .state('runs', {
      url: '/users/:userId/runs',
      templateUrl: 'templates/runs.html',
      controller: runsController
    });
})
.factory('authentication', ['$localStorage', '$http', authenticationService]);

export default runTracker;
