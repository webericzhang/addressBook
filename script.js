var app = angular.module('myApp', []);
app.factory('DataFactory', ['$http', '$q', function ($http, $q) {
    var oData = {
        bStopLoad: false,
        bLoad: false,
        bFlag: true,
        bConfirm: false,
        aData: [],
        loadData: function () {
            return $q(function (resolve, reject) {
                $http.get('./contactList.json').then(function (resp) {
                    var result = resp.data;
                    if (result.success) {
                        resolve(result);
                    }
                    else {
                        reject('failed!');
                    }
                }, function (resp) {
                    alert('Get failed');
                });
            })
        }
    };
    return oData;
}])
app.controller('contactCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {
    $scope.oContact = {
        firstName: '',
        lastName: '',
        telephone: ''
    };
    $scope.$watch('oContact', function () {
        if ($scope.oContact.firstName.length + $scope.oContact.lastName.length + $scope.oContact.telephone.length !== 0) {
            DataFactory.bStopLoad = true;
        }
        else {
            DataFactory.bStopLoad = false;
        }

        if (($scope.oContact.firstName.length + $scope.oContact.lastName.length + $scope.oContact.telephone.length !== 0 && !DataFactory.aData.bFlag)
            || (DataFactory.bLoad)) {
            DataFactory.aData.unshift($scope.oContact);
            DataFactory.aData.bFlag = true;
            DataFactory.bLoad = false;
            DataFactory.aData.bConfirm = false;
        }
        else if ($scope.oContact.firstName.length + $scope.oContact.lastName.length + $scope.oContact.telephone.length === 0 && DataFactory.aData.bFlag && !DataFactory.aData.bConfirm && !DataFactory.bLoad) {
            DataFactory.aData.shift($scope.oContact);
            DataFactory.aData.bFlag = false;
        }
    }, true);
}])
    .directive('addContact', ['DataFactory', function (DataFactory) {
        return {
            restrict: 'E',
            controller: function ($scope) {
                $scope.oErr = {
                    'display': 'inline-block',
                    'color': 'indianred',
                    'margin-left': '100px',
                    'margin-bottom': '10px',
                };
                $scope.toList = function () {
                    if ($scope.oContact.firstName.length !== 0 && $scope.oContact.lastName.length !== 0 && $scope.oContact.telephone.length !== 0 && !DataFactory.aData.bConfirm && !DataFactory.bLoad) {
                        DataFactory.aData.shift($scope.oContact);
                        DataFactory.aData.unshift({
                            firstName: $scope.oContact.firstName,
                            lastName: $scope.oContact.lastName,
                            telephone: $scope.oContact.telephone
                        });
                        DataFactory.aData.bFlag = false;
                        DataFactory.aData.bConfirm = true;
                        $scope.oContact.firstName = '';
                        $scope.oContact.lastName = '';
                        $scope.oContact.telephone = '';
                    }
                }
            },
            replace: true,
            templateUrl: './contact.tpl'
        }
    }])

app.controller('listCtrl', ['$scope', '$http', 'DataFactory', function ($scope, $http, DataFactory) {
    $scope.aList = DataFactory.aData;
}])
    .directive('contactList', function () {
        return {
            controller: function ($scope) {
                $scope.selOneline = function (evt, ind, item) {
                    var i = angular.element(document.querySelectorAll('tr')[ind]);
                    i.addClass('test');

                    if (confirm("Delete the selected item?")) {
                        $scope.aList.splice($scope.aList.indexOf(item), 1);
                    }
                    else {
                        i.removeClass('test');
                    }
                }
            },
            restrict: 'E',
            replace: true,
            templateUrl: './list.tpl'
        }
    })
    .directive('btnGroup', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: ['$scope', 'DataFactory', function ($scope, DataFactory) {
                $scope.loadList = function (evt) {
                    if (DataFactory.bStopLoad) {
                        alert('please clear the input!');
                    }
                    else {
                        DataFactory.bLoad = true;
                        DataFactory.loadData().then(function (result) {
                            angular.element(evt.target).attr('disabled', "true").css('backgroundColor', 'grey');
                            angular.forEach(result.contacts, function (val) {
                                $scope.aList.push(val);
                            });
                        }, function (error) {
                            alert(error);
                        });
                    }
                };
                $scope.saveList = function () {
                    alert('not finish yet');
                }
            }],
            templateUrl: 'buttons.tpl'
        }
    })