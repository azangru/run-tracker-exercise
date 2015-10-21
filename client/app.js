import angular from 'angular';
import router from 'angular-ui-router';
import ngstorage from 'ngstorage';
import homeController from './controllers/homeController';
import runsController from './controllers/runsController';
import loginController from './controllers/loginController';
import signupController from './controllers/signupController';
import headerController from './controllers/headerController';
import authenticationService from './services/authenticationService';

let runTracker = angular.module('runTracker', [
  'ui.router',
  'ngStorage'
])
.config(($locationProvider, $stateProvider) => {
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      views: {
        'header': {
          templateUrl: 'templates/header.html',
          controller: headerController
        }
      },
      onEnter: function(authentication, $rootScope) {
        $rootScope.isLoggedIn = authentication.getToken() ? true : false;
      }
    })
    .state('root.home', {
      parent: 'root',
      url: '/',
      views: {
        '@': {
          templateUrl: 'templates/home.html',
          controller: homeController
        }
      }
    })
    .state('root.login', {
      url: '/login',
      views: {
        '@': {
          templateUrl: 'templates/login.html',
          controller: loginController
        }
      }
    })
    .state('root.signup', {
      url: '/signup',
      views: {
        '@': {
          templateUrl: 'templates/signup.html',
          controller: signupController
        }
      }
    })
    .state('root.runs', {
      url: '/users/:userId/runs',
      views: {
        '@': {
          templateUrl: 'templates/runs.html',
          controller: runsController
        }
      }
    });
})
.factory('authentication', ['$localStorage', '$rootScope', '$state', '$http', authenticationService]);

export default runTracker;
