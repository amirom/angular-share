var app = angular.module('app', ['angular-carousel-3d', 'ui.bootstrap']);

// app.config(['$routeProvider', function($routeProvider) {
//     $routeProvider
//         .when('/', {
//             templateUrl: 'index.html'
//         })
//         .otherwise({
//             redirectTo: '/'
//         });
//     }
// ]);

app.factory('factory', function($http) {
	var factory = {};

	factory.getMedia = function() {
		return $http.get('/media')
			.error(function (data, status) {
				console.log('Error', data);
			});
	}

    factory.postMedia = function(stuff) {
        return $http.post('/email', stuff)
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

app.controller('main', function($scope, $sce, $timeout, $interval, $uibModal, factory) {
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
        });    
    };

    $interval(poller, 10000);

    // TODO: find way to switch to newest slide inputed
	$scope.options = {
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 0,
            width: 450,
            height: 440,
            space: 300,
            autoRotationSpeed: 100000
        };

    $scope.open = function (index) {
        var modalInstance = $uibModal.open({
            templateUrl: '/modalView.html',
            controller: 'ModalController',
            resolve: {
                slideData: function() {
                    return $scope.slides[index];
                }
            }
        });
    };

    $scope.clicked = function(index) {
        // $scope.newSize += 1;
        // $scope.slides.push(
        //     { "src": "http://omquin.pythonanywhere.com/mediafiles/100141.mp4" }
        // );
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

app.controller('ModalController', ['$scope', '$uibModalInstance', 'slideData', 'factory',
    function($scope, $uibModalInstance, slideData, factory){
        
    $scope.email = '';

    $scope.send = function() {
        // do some email validation here

        var dataSend = {
            email: $scope.email,
            path: slideData.src,
            id: slideData.id
        };

        factory.postMedia(dataSend)
            .success(function (data, status) {
                console.log(data);
            });
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}]);
