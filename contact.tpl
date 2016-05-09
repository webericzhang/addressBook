<form name="ctForm">
    First Name &nbsp&nbsp <input type="text" name="fn" autocomplete="off" ng-model="oContact.firstName"
                                 ng-class="{err: ctForm.fn.$invalid}" maxlength="8" ng-pattern="/^[a-zA-Z]*$/"
                                 placeholder="firstname"><br>

    <div ng-show="ctForm.fn.$error.pattern" ng-style="oErr">Please input the letters!</div>
    <br>
    Last Name &nbsp&nbsp <input type="text" name="ln" autocomplete="off" ng-model="oContact.lastName"
                                ng-class="{err: ctForm.ln.$invalid}"
                                maxlength="8" ng-pattern="/^[a-zA-Z]*$/" placeholder="lastname"><br>

    <div ng-show="ctForm.ln.$error.pattern" ng-style="oErr">Please input the letters!</div>
    <br>
    Telephone &nbsp&nbsp&nbsp <input type="tel" name="tel" autocomplete="off" ng-model="oContact.telephone"
                                     ng-class="{err: ctForm.tel.$invalid}" maxlength="10" ng-pattern="/^[0-9]*$/"
                                     placeholder="telephone"><br>

    <div ng-show="ctForm.tel.$error.pattern" ng-style="oErr">Please input the number!</div>
    <br>
    <button type="button" ng-click="toList()">Confirm</button>
</form>