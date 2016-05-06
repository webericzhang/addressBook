<div class="list-table">
	<label><a href="#" ng-click="sortType='firstName'; sortReverse=!sortReverse">
				First Name
				<span ng-show="sortType==='firstName' && !sortReverse" class="fa fa-caret-down"></span>
                <span ng-show="sortType==='firstName' && sortReverse" class="fa fa-caret-up"></span>
	</a></label>
	<label><a href="#" ng-click="sortType='lastName'; sortReverse=!sortReverse">
	            Last Name
	            <span ng-show="sortType==='lastName' && !sortReverse" class="fa fa-caret-down"></span>
                <span ng-show="sortType==='lastName' && sortReverse" class="fa fa-caret-up"></span>
	</a></label>
	<label><a href="#" ng-click="sortType='telephone'; sortReverse=!sortReverse">
                Telephone
    	        <span ng-show="sortType==='telephone' && !sortReverse" class="fa fa-caret-down"></span>
                <span ng-show="sortType==='telephone' && sortReverse" class="fa fa-caret-up"></span>
    </a></label>
    <table>
		<tr ng-repeat = "oContact in aList | orderBy : sortType : sortReverse | filter : search" ng-click="selOneline($event, $index, oContact)" ng-style="oSel" ng-class-odd="'odd'"  ng-class-even="'even'">
        	<td>{{oContact.firstName}}</td>
        	<td>{{oContact.lastName}}</td>
			<td>{{oContact.telephone}}</td>
    	</tr>
	</table>
	<input type="text" ng-model="search" placeholder="search" class="search">
</div>
