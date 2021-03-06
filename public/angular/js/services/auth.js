angular.module('Aggie')
  .factory('AuthService', [
    '$rootScope',
    '$http',
    function AuthService($rootScope, $http) {
      return {
        login: function(credentials, callback) {
          var cb = callback || angular.noop;
          $http.post('/login', credentials)
            .then(function (res) {
              $rootScope.currentUser = res.data;
              return cb();
            }, function(err) {
              return cb(err);
            });
        },

        getCurrentUser: function() {
          var promise = $http.get('/session');
          promise.then(function(res) {
            if (res.data.username) {
              $rootScope.currentUser = res.data;
            }
          });
          return promise;
        },

        logout: function(callback) {
          var cb = callback || angular.noop;
          $http.get('/logout').then(function(res) {
            $rootScope.currentUser = null;
            return cb();
          }, function(err) {
            return cb(err.data);
          });
        }
      };
    }
  ]
);
