var app = angular.module('app', ['ngRoute', 'angular-carousel-3d']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'main',
            templateUrl: 'index.html'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);

app.factory('factory', function($http) {
	var urlBase = "";
	var factory = {};

	factory.getMedia = function() {
		return $http.get('/media')
			.error(function (data, status) {
				console.log('Error', data);
			});
	}

    return factory;
});

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.controller('main', function($scope, $sce, factory) {
    $scope.ind = 0;
	// $scope.slides = $scope.checkThing();

    factory.getMedia().success(function(data, status) {
        $scope.slides = data;
    });

	$scope.options = {
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 0,
            dir: 'ltr',
            width: 450,
            height: 440,
            space: 300,
            autoRotationSpeed: 100000
        };

    $scope.checkThing = function() {
        factory.getMedia()
            .success(function(data, status) {
                return data;
            });
    };

    $scope.clicked = function(index) {
        console.log(index);
    };

    $scope.setIndex = function(index) {
        $scope.ind = index;
    }

    $scope.getIndex = function() {
        return $scope.ind;
    }

    $scope.getFileType = function(file) {
    	return file.split('.').pop();
    }

    $scope.lastSlide =  function(index) {
        console.log("last slide " + index);
    }

    $scope.selectedClick = function(index) {
        console.log("selected slide " + index)
    }

    $scope.addSlide = function(slide, array) {
        array.push(slide);
    }

    $scope.removeSlide = function(index, array) {
        array.splice(array.indexOf(array[index]), 1);
    }
});