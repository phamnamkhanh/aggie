angular.module('Aggie')

.controller('NavbarController', [
  '$scope',
  '$rootScope',
  '$location',
  'AuthService',
  'FlashService',
  'Socket',
  function($scope, $rootScope, $location, AuthService, flash, Socket) {
    $scope.unreadErrorCount = '0';

    var init = function() {
      if ($rootScope.currentUser) {
        Socket.on('sourceErrorCountUpdated', sourceErrorCountUpdated);
      } else {
        Socket.off('sourceErrorCountUpdated');
      }
    };

    var sourceErrorCountUpdated = function(response) {
      $scope.unreadErrorCount = response.unreadErrorCount;
    };

    $scope.logout = function() {
      AuthService.logout(function(err) {
        if (!err) {
          if ($location.path() == '/login') {
            flash.setNoticeNow('You have been successfully logged out.');
          } else {
            flash.setNotice('You have been successfully logged out.');
            $location.url('/login');
          }
        } else {
          console.log('Error', err);
        }
      });
    };

    $rootScope.$watch('currentUser', init);

    init();
  }
]);
