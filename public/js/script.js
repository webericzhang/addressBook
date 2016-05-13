var app = angular.module('myApp', []);
app.factory('DataFactory', ['$http', '$q', function ($http, $q) {
    var data;
    data = {
        flag: [false, false, false, false],
        aData: [],
        loadData: function () {
            return $q(function (resolve, reject) {
                $http.get('json/contactlist.json').then(function (resp) {
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
        },
        saveData: function () {
            var that = this;
            return $q(function (resolve, reject) {
                $http.post('contactlist.html', {
                    success: true,
                    totalCount: that.aData.length,
                    contacts: that.aData
                })
                    .then(function (resp) {
                        resolve();
                    }, function (resp) {
                        alert('POST failed');
                    });
            })
        }
    };
    return data;
}])
app.directive('addContact', ['DataFactory', '$timeout', function (DataFactory, $timeout) {
    return {
        restrict: 'E',
        controller: function ($scope) {
            $scope.display = false;
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
        templateUrl: 'template/contact.tpl',
        link: function (scope) {
            scope.$watch('oContact', function () {
                DataFactory.flag[0] = (scope.oContact.firstName.length + scope.oContact.lastName.length + scope.oContact.telephone.length !== 0) ? true : false;
                if ((scope.oContact.firstName.length + scope.oContact.lastName.length + scope.oContact.telephone.length !== 0 && DataFactory.flag[2])
                    || (DataFactory.flag[1])) {
                    DataFactory.aData.unshift(scope.oContact);
                    DataFactory.flag[1] = DataFactory.flag[2] = DataFactory.flag[3] = false;
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
                    scope.oContact.firstName = scope.oContact.lastName = scope.oContact.telephone = '';
                    scope.display = true;
                    var timer = $timeout(function () {
                        scope.display = false;
                    }, 1000).finally($timeout.cancel(timer));
                }
            }
        }
    }
}])

app.directive('contactList', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'template/list.tpl',
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
app.directive('btnGroup', function () {
    return {
        restrict: 'E',
        replace: true,
        controller: ['$scope', '$timeout', 'DataFactory', function ($scope, $timeout, DataFactory) {
            var isLoad = false;
            $scope.aList = DataFactory.aData;
            this.loadList = function (evt) {
                if (DataFactory.flag[0]) {
                    alert('please clear the input!');
                } else {
                    DataFactory.flag[1] = true;
                    DataFactory.loadData().then(function (result) {
                    console.log(result);
                        console.log(result.contacts);
                        isLoad = true;
                        angular.element(evt.target).attr('disabled', "true").css('backgroundColor', 'grey');
                        angular.forEach(result.contacts, function (val) {
                            console.log(val);
                            $scope.aList.push(val);
                        });
                    }, function (error) {
                        alert(error);
                    });
                }
            };
            this.saveList = function () {
                if(!isLoad){
                    alert('Please load first!')
                }
                else if (DataFactory.flag[0]) {
                    alert('Please clear the input!');
                } else {
                    DataFactory.saveData().then(function () {
                        $scope.disp = true;
                        var timer = $timeout(function () {
                            $scope.disp = false;
                        }, 1000).finally($timeout.cancel(timer));
                    });
                }
            }
        }],
        controllerAs: 'btnCtrl',
        templateUrl: 'template/buttons.tpl'
    }
})
    .directive('loadBtn', function () {
        return {
            restrict: 'E',
            require: '^btnGroup',
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
            require: '^btnGroup',
            replace: true,
            template: '<button>Save</button>',
            link: function (scope, element, attrs, btnCtrl) {
                element.on('click', btnCtrl.saveList);
            }
        }
    })