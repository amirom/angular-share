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
	var factory = {};

	factory.getMedia = function() {
		return $http.get('/media')
			.error(function (data, status) {
				console.log('Error', data);
			});
	}
    return factory;
});

app.factory('Poller', function($http, $timeout) {
    var data = { response: {}, calls: 0 };
    var poller = function() {
        $http.get('/media')
        .then(function(r) {
            console.log(data);
            data.response = r.data;
            data.calls++;
            $timeout(poller, 10000);
        });      
    };
    poller();

    return {
        data: data
    };
});

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.controller('main', function($scope, $sce, $timeout, factory) {
    $scope.ind = 0;
    $scope.newSize = 0;
    $scope.oldSize = 0;
    $scope.slides = [];

    factory.getMedia().success(function(data, status) {
        $scope.slides = data;
        $scope.newSize = Object.keys(data).length;
        $scope.oldSize = Object.keys(data).length;
    });

    var poller = function() {
        factory.getMedia().success(function(data, status) {

            $scope.newSize = Object.keys(data).length;
            console.log("new: " + $scope.newSize + " old:" + $scope.oldSize);
            if ($scope.newSize > $scope.oldSize) {
                 // TODO: get the new size difference and push into slides array
                 $scope.slides.push(data[data.length - 1].src);
                 $scope.oldSize = Object.keys(data).length;
                 console.log("updated");
            }
        }).then(function(r) {
            $timeout(poller, 10000);
        });     
    };

    poller();

    // TODO: find way to switch to newest slide inputed
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
        $scope.newSize += 1;
        $scope.slides.push(
            { "src": "http://omquin.pythonanywhere.com/mediafiles/100141.mp4" }
        );
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