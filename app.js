angular.module('user', ['restangular', 'ngRoute']).
	config(function ($routeProvider, RestangularProvider) {
		$routeProvider.
			when('/', {
				controller: ListCtrl,
				templateUrl: 'users.list.html'
			}).
			when('/edit/:userId', {
				controller: EditCtrl,
				templateUrl: 'users.detail.html',
				resolve: {
					user: function (Restangular, $route) {
						return Restangular.one('users', $route.current.params.userId).get();
					}
				}
			}).
			when('/new', {
				controller: CreateCtrl,
				templateUrl: 'users.detail.html',
				resolve: {
					user: function (Restangular) {
						return Restangular.one('users').getList().$object;
					}
				}
			}).
			when('/statistic', {
				controller: StatisticCtrl,
				templateUrl: 'users.stat.html',
				resolve: {
					user: function (Restangular, $route) {
						return Restangular.one('users', $route.current.params.userId).get();
					}
				}
			}).
			otherwise({redirectTo: '/'});

		RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/mydatabase/collections');
		RestangularProvider.setDefaultRequestParams({ apiKey: 'lhFHpAnS_taEW1yMTiLQzBc8YikUpX44' })
		RestangularProvider.setRestangularFields({
			id: '_id'
		});

		RestangularProvider.setRequestInterceptor(function (elem, operation, what) {

			if (operation === 'put') {
				elem._id = undefined;
				return elem;
			}
			return elem;
		})
	});


function ListCtrl($scope, Restangular) {
	$scope.users = Restangular.all("users").getList().$object;
}


function CreateCtrl($scope, $location, Restangular) {

	$scope.save = function () {
		Restangular.all('users').post($scope.user).then(function (user) {
			$location.path('/list');
		});
	}
}
function StatisticCtrl($scope,Restangular) {
	$scope.users = Restangular.allUrl('googlers', 'https://api.mongolab.com/api/1/databases/mydatabase/collections/users?apiKey=lhFHpAnS_taEW1yMTiLQzBc8YikUpX44').getList();
}

function EditCtrl($scope, $location, Restangular, user) {

	var original = user;
	$scope.user = Restangular.copy(original);

	$scope.isClean = function () {
		return angular.equals(original, $scope.user);
	}

	$scope.destroy = function () {
		original.remove().then(function () {
			$location.path('/list');
		});
	};

	$scope.save = function () {
		$scope.user.put().then(function () {
			$location.path('/');
		});
	};
}
