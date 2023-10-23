
var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'home.html',
			controller: 'TaskController'
		})
		.when('/tasks', {
			templateUrl: 'viewTasks.html',
			controller: 'TaskController'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

mainApp.controller('TaskController', function($scope) {
	$scope.lastIndex = 0;
	const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
	$scope.tasks = localTasks.map((item) => {
		item.id = $scope.lastIndex;
		$scope.lastIndex++;
		return item;
	});
	
	$scope.newTask = {};
	$scope.clickedTask = {};
	$scope.taskIdToModify = 0;
	$scope.message = "Click on the hyper link to view and search tasks.";
	$scope.success = '';
	$scope.orderBy = 'title';
	$scope.orderType = 'asc';

	// console.log('tasks1:', $scope.tasks);

	$scope.saveTask = function(){
		if(!$scope.validateTask($scope.newTask)){
			$scope.error = 'All fields required!';
			$scope.success = '';
			$scope.newTask = {};
		}else{
			$scope.newTask.id = $scope.lastIndex;
			$scope.lastIndex++;
			$scope.tasks.push($scope.newTask);
			window.localStorage['tasks'] = angular.toJson($scope.tasks);
			$scope.newTask = {};
			$scope.success = "Task added Successful";
			$scope.error = '';
			$scope.sortTasks();
		}
	};

	$scope.selectTask = function(task){
		$scope.taskIdToModify = task.id;
		$scope.clickedTask = angular.copy(task);
	};

	$scope.updateTask = function(){	
		$scope.tasks[$scope.taskIdToModify] = $scope.clickedTask;
		$scope.clickedTask = {};
		$scope.taskIdToModify = 0;
		localStorage.setItem('tasks', JSON.stringify($scope.tasks));
		$scope.sortTasks();
	};

	$scope.deleteTask = function(){
		$scope.tasks = $scope.tasks.filter(function( obj ) {
			return obj.id !== $scope.taskIdToModify;
		});
		localStorage.setItem('tasks', JSON.stringify($scope.tasks));
	};

	$scope.validateTask = function(task){
		if((!task.title || task.title === '') || (!task.description || task.description === '') || (!task.taskDate || task.taskDate === '')){
			return false;
		}
		return true;
	}

	$scope.sortTasks = function(){
		$scope.tasks = _.orderBy($scope.tasks, [$scope.orderBy],[$scope.orderType]);
	}

	$scope.sortTasks();
});