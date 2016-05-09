var app = angular.module('myApp', []);
app.factory('DataFactory', ['$http', '$q', function ($http, $q) {
    var data = {
        flag: [false, false, false, false],
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
    return data;
}])
app.controller('contactCtrl', ['$scope', function ($scope) {
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
                $scope.oContact = {
                    firstName: '',
                    lastName: '',
                    telephone: ''
                };
            },
            replace: true,
            templateUrl: './contact.tpl',
            link: function (scope) {
                scope.$watch('oContact', function () {
                    if (scope.oContact.firstName.length + scope.oContact.lastName.length + scope.oContact.telephone.length !== 0) {
                        DataFactory.flag[0] = true;
                    }
                    else {
                        DataFactory.flag[0] = false;
                    }

                    if ((scope.oContact.firstName.length + scope.oContact.lastName.length + scope.oContact.telephone.length !== 0 && DataFactory.flag[2])
                        || (DataFactory.flag[1])) {
                        DataFactory.aData.unshift(scope.oContact);
                        DataFactory.flag[1] = false;
                        DataFactory.flag[2] = false;
                        DataFactory.flag[3] = false;
                    }
                    else if (scope.oContact.firstName.length + scope.oContact.lastName.length + scope.oContact.telephone.length === 0
                        && !DataFactory.flag[1] && !DataFactory.flag[2] && !DataFactory.flag[3]) {
                        DataFactory.aData.shift(scope.oContact);
                        DataFactory.flag[2] = true;
                    }
                }, true);
                scope.toList = function () {
                    if (scope.oContact.firstName.length !== 0 && scope.oContact.lastName.length !== 0 && scope.oContact.telephone.length !== 0
                        && !DataFactory.flag[1] && !DataFactory.flag[3]) {
                        DataFactory.aData.shift(scope.oContact);
                        DataFactory.aData.unshift({
                            firstName: scope.oContact.firstName,
                            lastName: scope.oContact.lastName,
                            telephone: scope.oContact.telephone
                        });
                        DataFactory.flag[2] = true;
                        DataFactory.flag[3] = true;
                        scope.oContact.firstName = '';
                        scope.oContact.lastName = '';
                        scope.oContact.telephone = '';
                    }
                }
            }
        }
    }])

app.controller('listCtrl', ['$scope', function ($scope) {
}])
    .directive('contactList', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: './list.tpl',
            link: function (scope) {
                scope.selOneline = function (evt, ind, item) {
                    var i = angular.element(document.querySelectorAll('tr')[ind]);
                    i.addClass('test');

                    if (confirm("Delete the selected item?")) {
                        scope.aList.splice(scope.aList.indexOf(item), 1);
                    }
                    else {
                        i.removeClass('test');
                    }
                }
            }
        }
    })
    //.directive('btnGroup', function () {
    //    return {
    //        restrict: 'E',
    //        controller: ['$scope', 'DataFactory', function ($scope, DataFactory) {
    //            $scope.aList = DataFactory.aData;
    //            $scope.loadList = function (evt) {
    //                if (DataFactory.flag[0]) {
    //                    alert('please clear the input!');
    //                }
    //                else {
    //                    DataFactory.flag[1] = true;
    //                    DataFactory.loadData().then(function (result) {
    //                        angular.element(evt.target).attr('disabled', "true").css('backgroundColor', 'grey');
    //                        angular.forEach(result.contacts, function (val) {
    //                            $scope.aList.push(val);
    //                        });
    //                    }, function (error) {
    //                        alert(error);
    //                    });
    //                }
    //            };
    //            $scope.saveList = function () {
    //                alert('not finish yet');
    //            }
    //        }],
    //        replace: true,
    //        templateUrl: 'buttons.tpl'
    //    }
    //})

    .directive('btnGroup', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: ['$scope', 'DataFactory', function ($scope, DataFactory) {
                $scope.aList = DataFactory.aData;
                this.loadList = function (evt) {
                    if (DataFactory.flag[0]) {
                        alert('please clear the input!');
                    }
                    else {
                        DataFactory.flag[1] = true;
                        DataFactory.loadData().then(function (result) {
                            //angular.element(evt.target).attr('disabled', "true").css('backgroundColor', 'grey');
                            angular.element(evt.target).attr('disabled', "true").css('backgroundColor', 'grey');
                            angular.forEach(result.contacts, function (val) {
                                $scope.aList.push(val);
                            });
                        }, function (error) {
                            alert(error);
                        });
                    }
                };
                this.saveList = function () {
                    alert('not finish yet');
                }
            }],
            controllerAs: 'btnCtrl',
            templateUrl: 'buttons.tpl'
        }
    })
    .directive('loadBtn', function () {
        return {
            restrict: 'E',
            require:'^btnGroup',
            replace: true,
            template: '<button>Load</button>',
            link: function (scope, element, attrs, btnCtrl) {
                element.on('click', btnCtrl.loadList);
            }
        }
    })
    .directive('saveBtn', function () {
        return {
            restrict: 'E',
            require:'^btnGroup',
            replace: true,
            template: '<button>Save</button>',
            link: function (scope, element, attrs, btnCtrl) {
                element.on('click', btnCtrl.saveList);
            }
        }
    })