var app = angular.module('myApp', []);
app.factory('DataFactory', function () {
    var oData = {bStopLoad: false, bLoad: false, aData: []};
    return oData;
});
app.controller('contactCtrl', ['$scope', '$http', 'DataFactory', function ($scope, $http, DataFactory) {
    $scope.oContact = {
        firstName: '',
        lastName: '',
        telephone: ''
    };
    var bFlag = true,
        bConfirm = false,
        sFn = '',
        sLn = '',
        sTel = '';

    $scope.$watch('oContact', function () {
        sFn = $scope.oContact.firstName;
        sLn = $scope.oContact.lastName;
        sTel = $scope.oContact.telephone;

        if (sFn.length + sLn.length + sTel.length !== 0) {
            DataFactory.bStopLoad = true;
        }
        else {
            DataFactory.bStopLoad = false;
        }

        if ((sFn.length + sLn.length + sTel.length !== 0 && !bFlag)
            || (DataFactory.bLoad)) {
            DataFactory.aData.unshift($scope.oContact);
            bFlag = true;
            DataFactory.bLoad = false;
            bConfirm = false;
        }
        else if (sFn.length + sLn.length + sTel.length === 0 && bFlag && !bConfirm && !DataFactory.bLoad) {
            DataFactory.aData.shift($scope.oContact);
            bFlag = false;
        }
    }, true);
    $scope.toList = function () {
        if (sFn.length !== 0 && sLn.length !== 0 && sTel.length !== 0 && !bConfirm && !DataFactory.bLoad) {
            DataFactory.aData.shift($scope.oContact);
            DataFactory.aData.unshift({firstName: sFn, lastName: sLn, telephone: sTel});
            bFlag = false;
            bConfirm = true;
            $scope.$apply(function () {
                $scope.oContact.firstName = $scope.oContact.lastName = $scope.oContact.telephone = '';
            });
        }
    }
}])
    .directive('addContact', function () {
        return {
            restrict: 'E',
            controller: function ($scope) {
                $scope.oErr = {
                    'display': 'inline-block',
                    'color': 'indianred',
                    'margin-left': '100px',
                    'margin-bottom': '10px',
                }
            },
            //   controllerAs :
            replace: true,
            template: '<form name="ctForm">',
            compile: function (iElem, iAttrs) {
                iElem.append('First Name &nbsp&nbsp <input type="text" name="fn" ng-model="oContact.firstName" ng-class="{err: ctForm.fn.$invalid}" maxlength="8" ng-pattern="/^[a-zA-Z]*$/" placeholder="firstname"><br>')
                    .append('<div ng-show="ctForm.fn.$error.pattern" ng-style="oErr">Please input the letters!</div><br>')
                    .append('Last Name &nbsp&nbsp <input type="text" name="ln" ng-model="oContact.lastName" ng-class="{err: ctForm.ln.$invalid}" maxlength="8" ng-pattern="/^[a-zA-Z]*$/" placeholder="lastname"><br>')
                    .append('<div ng-show="ctForm.ln.$error.pattern" ng-style="oErr">Please input the letters!</div><br>')
                    .append('Telephone &nbsp&nbsp&nbsp <input type="tel" name="tel" ng-model="oContact.telephone" ng-class="{err: ctForm.tel.$invalid}" maxlength="10" ng-pattern="/^[0-9]*$/" placeholder="telephone"><br>')
                    .append('<div ng-show="ctForm.tel.$error.pattern" ng-style="oErr">Please input the number!</div><br>')
                    .append('<to-list></to-list>')
            }
        }
    })
    .directive('toList', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<button type="button">Confirm</button>',
            link: function (scope, iElem, iAttrs) {
                iElem.on('click', scope.toList);
            }
        }
    });

app.controller('listCtrl', ['$scope', '$http', 'DataFactory', function ($scope, $http, DataFactory) {
    $scope.aList = DataFactory.aData;
}])
    .directive('contactList', function () {
        return {
            controller: function ($scope) {
                $scope.selOneline = function (evt, ind, item) {
                    if (angular.isObject(item)) {
                        var i = angular.element(document.querySelectorAll('tr')[ind]);
                        i.addClass('test');

                        var bRes = confirm("Delete the selected item?");
                        console.log(bRes);
                        if (bRes === true) {
                            $scope.aList.splice($scope.aList.indexOf(item), 1);
                        }
                        else {
                            i.removeClass('test');
                        }
                    }
                    evt.stopPropagation();
                }
            },
            restrict: 'E',
            replace: true,
            templateUrl: './list.tpl',
            link: function (scope, iElem, iAttrs) {
                iElem.on('click', scope.selOneline);
            }
        }
    })
    .directive('btnGroup', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: ['$scope', 'DataFactory', '$http', function ($scope, DataFactory, $http) {
                $scope.loadList = function (evt) {
                    if (DataFactory.bStopLoad) {
                        alert('please clear the input!');
                    }
                    else {
                        DataFactory.bLoad = true;
                        $http.get('./contactList.json').then(function (resp) {
                            var result = resp.data;
                            if (result.success) {
                                angular.element(evt.target).attr('disabled',"true").css('backgroundColor','grey');
                                angular.forEach(result.contacts, function (val) {
                                    $scope.aList.push(val);
                                });
                            }
                            else {
                                alert('failed');
                            }
                        }, function (resp) {
                            alert('Get failed');
                        });
                    }
                };
                $scope.saveList = function () {
                    alert('not finish yet');
                }
            }],
            template: '<div class="btn-group">',
            compile: function (iElem, iAttrs) {
                iElem.append('<button ng-click="loadList($event)">Load</button>');
                iElem.append('<button ng-click="saveList()">Save</button>')
            }
        }
    });