
/* --- Made by justgoscha and licensed under MIT license --- */

(function(){

    if( typeof angular === 'undefined' ){
        return;
    }
    var app = angular.module('autocomplete', []);

    app.directive('autocomplete', function() {
      var index = -1;

      return {
        restrict: 'E',
        scope: {
          searchParam: '=ngModel',
          suggestions: '=data',
          onType: '=onType',
          onSelect: '=onSelect',
          autocompleteRequired: '='
        },
        controller: ['$scope', function($scope){
          // the index of the suggestions that's currently selected
          $scope.selectedIndex = -1;

          $scope.initLock = true;

          // set new index
          $scope.setIndex = function(i){
            $scope.selectedIndex = parseInt(i);
          };

          this.setIndex = function(i){
            $scope.setIndex(i);
            $scope.$apply();
          };

          $scope.getIndex = function(i){
            return $scope.selectedIndex;
          };

          // watches if the parameter filter should be changed
          var watching = true;

          // autocompleting drop down on/off
          $scope.completing = false;

          // starts autocompleting on typing in something
          $scope.$watch('searchParam', function(newValue, oldValue){

            if (oldValue === newValue || (!oldValue && $scope.initLock)) {
              return;
            }

            if(watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
              $scope.completing = true;
              $scope.searchFilter = $scope.searchParam;
              $scope.selectedIndex = -1;
            }

            // function thats passed to on-type attribute gets executed
            if($scope.onType)
              $scope.onType($scope.searchParam);
          });

          // for hovering over suggestions
          this.preSelect = function(suggestion){

            watching = false;

            // this line determines if it is shown
            // in the input field before it's selected:
            //$scope.searchParam = suggestion;

            $scope.$apply();
            watching = true;

          };

          $scope.preSelect = this.preSelect;

          this.preSelectOff = function(){
            watching = true;
          };

          $scope.preSelectOff = this.preSelectOff;

          // selecting a suggestion with RIGHT ARROW or ENTER
          $scope.select = function(suggestion){
            if(suggestion){
              $scope.searchParam = suggestion;
              $scope.searchFilter = suggestion;
              if($scope.onSelect)
                $scope.onSelect(suggestion);
            }
            watching = false;
            $scope.completing = false;
            setTimeout(function(){watching = true;},1000);
            $scope.setIndex(-1);
          };


        }],
        link: function(scope, element, attrs){

          setTimeout(function() {
            scope.initLock = false;
            scope.$apply();
          }, 250);

          var attr = '';

          // Default atts
          scope.attrs = {
            "placeholder": "start typing...",
            "class": "",
            "id": "",
            "inputclass": "",
            "inputid": ""
          };

          for (var a in attrs) {
            attr = a.replace('attr', '').toLowerCase();
            // add attribute overriding defaults
            // and preventing duplication
            if (a.indexOf('attr') === 0) {
              scope.attrs[attr] = attrs[a];
            }
          }

          if (attrs.clickActivation) {
            element[0].onclick = function(e){
              if(!scope.searchParam){
                setTimeout(function() {
                  scope.completing = true;
                  scope.$apply();
                }, 200);
              }
            };
          }

          var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

          document.addEventListener("keydown", function(e){
            var keycode = e.keyCode || e.which;

            switch (keycode){
              case key.esc:
                // disable suggestions on escape
                scope.select();
                scope.setIndex(-1);
                scope.$apply();
                e.preventDefault();
            }
          }, true);

          document.addEventListener("blur", function(e){
            // disable suggestions on blur
            // we do a timeout to prevent hiding it before a click event is registered
            setTimeout(function() {
              scope.select();
              scope.setIndex(-1);
              scope.$apply();
            }, 150);
          }, true);

          element[0].addEventListener("keydown",function (e){
            var keycode = e.keyCode || e.which;

            var l = angular.element(this).find('li').length;

            // this allows submitting forms by pressing Enter in the autocompleted field
            if(!scope.completing || l == 0) return;

            // implementation of the up and down movement in the list of suggestions
            switch (keycode){
              case key.up:

                index = scope.getIndex()-1;
                if(index<-1){
                  index = l-1;
                } else if (index >= l ){
                  index = -1;
                  scope.setIndex(index);
                  scope.preSelectOff();
                  break;
                }
                scope.setIndex(index);

                if(index!==-1)
                  scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                scope.$apply();

                break;
              case key.down:
                index = scope.getIndex()+1;
                if(index<-1){
                  index = l-1;
                } else if (index >= l ){
                  index = -1;
                  scope.setIndex(index);
                  scope.preSelectOff();
                  scope.$apply();
                  break;
                }
                scope.setIndex(index);

                if(index!==-1)
                  scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                break;
              case key.left:
                break;
              case key.right:
              case key.enter:
              case key.tab:

                index = scope.getIndex();
                // scope.preSelectOff();
                if(index !== -1) {
                  scope.select(angular.element(angular.element(this).find('li')[index]).text());
                  if(keycode == key.enter) {
                    e.preventDefault();
                  }
                } else {
                  if(keycode == key.enter) {
                    scope.select();
                  }
                }
                scope.setIndex(-1);
                scope.$apply();

                break;
              case key.esc:
                // disable suggestions on escape
                scope.select();
                scope.setIndex(-1);
                scope.$apply();
                e.preventDefault();
                break;
              default:
                return;
            }

          });
        },
        template: '\
            <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
              <input\
                type="text"\
                ng-model="searchParam"\
                placeholder="{{ attrs.placeholder }}"\
                class="{{ attrs.inputclass }}"\
                id="{{ attrs.inputid }}"\
                ng-required="{{ autocompleteRequired }}" />\
              <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">\
                <li\
                  suggestion\
                  ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"\
                  index="{{ $index }}"\
                  val="{{ suggestion }}"\
                  ng-class="{ active: ($index === selectedIndex) }"\
                  ng-click="select(suggestion)"\
                  ng-bind-html="suggestion | highlight:searchParam"></li>\
              </ul>\
            </div>'
      };
    });

    app.filter('highlight', ['$sce', function ($sce) {
      return function (input, searchParam) {
        if (typeof input === 'function') return '';
        if (searchParam) {
          var words = '(' +
                searchParam.split(/\ /).join(' |') + '|' +
                searchParam.split(/\ /).join('|') +
              ')',
              exp = new RegExp(words, 'gi');
          if (words.length) {
            input = input.replace(exp, "<span class=\"highlight\">$1</span>");
          }
        }
        return $sce.trustAsHtml(input);
      };
    }]);

    app.directive('suggestion', function(){
      return {
        restrict: 'A',
        require: '^autocomplete', // ^look for controller on parents element
        link: function(scope, element, attrs, autoCtrl){
          element.bind('mouseenter', function() {
            autoCtrl.preSelect(attrs.val);
            autoCtrl.setIndex(attrs.index);
          });

          element.bind('mouseleave', function() {
            autoCtrl.preSelectOff();
          });
        }
      };
    });
})();

;(function(BEERFEST, $, undefined){

    if( typeof angular === "undefined" ){
        return;
    }

    BEERFEST.name = "ebf-2016";

    // -------------------------------
    // globals
    //

    var uid;


    // -------------------------------
    // angular
    //

    var app = angular.module('beerfest', ['firebase', 'autocomplete']).run(function() {
        Origami.fastclick(document.body);
    });

    var BEERFEST_DATA = new Firebase("https://braican-beerfest.firebaseio.com");

    app.controller( 'BeerfestController', ['$firebaseObject', '$firebaseAuth', '$scope', function( $firebaseObject, $firebaseAuth, $scope ){
        
        // loaded
        $scope.loaded = false;

        // whether or not the right drawer is active
        $scope.drawerActive = false;

        // the current app view
        //  - all-beers
        //  - hads
        //  - wishlist
        $scope.appView = 'all-beers';


        // -------------------------------
        // auth stuff
        //

        // authenticate
        $scope.auth = $firebaseAuth( BEERFEST_DATA );

        // the user object
        $scope.currentUser = null;


        var authData = $scope.auth.$getAuth();

        if( authData ){
            console.log("Logged in");
            console.log(authData);

            $scope.currentUser = authData;
        }


        /**
         * get the classes for the app div
         */
        $scope.getAppClasses = function(){
            var classes = '';

            if( $scope.loaded === true )
                classes += ' appLoaded';

            if( $scope.drawerActive === true )
                classes += ' drawerActive';

            return classes;
        }

    } ]); // BeerfestController


    app.controller( 'AuthController', ['$scope', function( $scope ){

        $scope.ctrlError = null;

        $scope.loginText = "Log In";

        /**
         * sign in
         */
        $scope.login = function(){

            $scope.loginText = "Logging you in...";

            $scope.$parent.auth.$authWithPassword({
                email    : $scope.email,
                password : $scope.password
            }).then( function( user ){
                $scope.$parent.currentUser = user;

                $scope.loginText = "Log In";
            }, function( error ){

                console.error( error );

                $scope.loginText = "Log In";

                if( error.code && error.code === 'INVALID_PASSWORD'){
                    $scope.ctrlError = "That password is incorrect for that user.";
                } else if( error.code && error.code === 'INVALID_USER') {
                    $scope.ctrlError = "There is no account with that email address in the system.";
                } else {
                    $scope.ctrlError = "An unknown error occurred and you could not be logged in. Please try again later."
                }
                
            });
        }


        /**
         * log out
         */
        $scope.logout = function(){
            $scope.$parent.auth.$unauth();
            $scope.$parent.currentUser = null;
        }

    } ]); // AuthController


    app.controller( 'BeerlistController', ['$firebaseObject', '$scope', '$timeout', function( $firebaseObject, $scope, $timeout ){
        
        // an object of all the current user's beers
        $scope.userHads = null;

        // an object of all the user's wishlisted beers
        $scope.userWishlist = null;

        // the beer data, from firebase
        $scope.beerfestData = $firebaseObject( BEERFEST_DATA );

        // lets load the data in. once that's done, load the beer
        //  list and lets get the hads and wishlists
        $scope.beerfestData.$loaded().then(function(){
            console.log("load main");
            $scope.$parent.loaded = true;

            // get the specific beerfest data into a variable so we
            //  can get it easier in the template.
            $scope.beerlist = $scope.beerfestData.beerfests[BEERFEST.name].beerlist;

            $scope.userHads = getUserHads();
            $scope.userWishlist = getUserWishlist();

        }).catch(function(error){
            console.error("Error: " + error);
        });


        $scope.$parent.$watch('currentUser', function(){
            $scope.userHads = getUserHads();
            $scope.userWishlist = getUserWishlist();
        });

        /**
         * make the clicked brewery active or inactive, depending on
         *  the current state
         * @param event (object)
         *    - the event object from the click
         */
        $scope.toggleActiveBrewery = function( event ){
            $(event.target).closest('.brewery').toggleClass('active');
        }


        /**
         * wishlist a beer
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         */
        $scope.wishlistBeer = function( beer, brewery ){
            var wishlist = $scope.userWishlist,
                beerName = BEERFEST.encode( beer.name );

            // no beers from this brewery have been wishlisted
            if( wishlist[brewery] === undefined ){
                wishlist[brewery] = { beers: {} };
                wishlist[brewery].beers[beerName] = beer;
            }
            // at least one beer from this brewery has been wishlisted
            else {

                // this beer has not been wishlisted, so add it
                if( wishlist[brewery].beers[beerName] === undefined ){
                    wishlist[brewery].beers[beerName] = beer;
                }
                // this beer has been wishlisted, so remove it
                else {
                    delete wishlist[brewery].beers[beerName];

                    // if there are no more beers wishlisted for this
                    //  brewery, remove the brewery
                    if( Object.keys( wishlist[brewery].beers ).length === 0 ){
                        delete $scope.userWishlist[brewery];
                    }
                }
            }

            if( $scope.$parent.currentUser ){
                var uid = $scope.$parent.currentUser.uid;

                if( $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ] === undefined ){
                    $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ] = {};
                }
                $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ].wishlist = wishlist;
            }

            $scope.saveData();
        }


        /**
         * select a beer as "had"
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         */
        $scope.drinkBeer = function( beer, brewery ){

            var hadslist = $scope.userHads,
                beerName = BEERFEST.encode( beer.name );

            // no beers from this brewery have been had
            if( hadslist[brewery] === undefined ){
                hadslist[brewery] = { beers: {} };
                hadslist[brewery].beers[beerName] = beer;
                hadslist[brewery].beers[beerName].isRating = true;
                hadslist[brewery].beers[beerName].rating = 0;
            }
            // at least one beer from this brewery has been wishlisted
            else {

                // this beer has not been had, so add it
                if( hadslist[brewery].beers[beerName] === undefined ){
                    hadslist[brewery].beers[beerName] = beer;
                    hadslist[brewery].beers[beerName].isRating = true;
                    hadslist[brewery].beers[beerName].rating = 0;
                }
                // this beer has been had, so remove it
                else {
                    delete hadslist[brewery].beers[beerName];

                    // if there are no more beers had from this
                    //  brewery, remove the brewery
                    if( Object.keys( hadslist[brewery].beers ).length === 0 ){
                        delete hadslist[brewery];
                    }
                }
            }

            $scope.saveData();
        }


        /**
         * get the rating for the passed beer
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         */
        $scope.getBeerRating = function( beer, brewery ){
            var hadslist = $scope.userHads,
                beerName = BEERFEST.encode( beer.name );

            if( hadslist === undefined || hadslist[brewery] === undefined || hadslist[brewery].beers[beerName] === undefined ){
                return false;
            }

            return hadslist[brewery].beers[beerName].rating;
        }


        /**
         * rates the beer
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         * @param rating (number)
         *    - the rating for this beer
         */
        $scope.rateBeer = function( beer, brewery, rating ){
            var hadslist = $scope.userHads,
                beerName = BEERFEST.encode( beer.name );

            if( hadslist[brewery] === undefined || hadslist[brewery].beers[beerName] === undefined ){
                return false;
            }

            hadslist[brewery].beers[beerName].rating = rating;

            $timeout(function(){
                hadslist[brewery].beers[beerName].isRating = false;    
            }, 400);

            

            if( $scope.$parent.currentUser ){
                var uid = $scope.$parent.currentUser.uid;
                $scope.beerfestData.users[ uid  ].fests[ BEERFEST.name ].hads = hadslist;
            }

            $scope.saveData();
        }


        /**
         * open the rating stuff again
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         */
        $scope.openRating = function( beer, brewery ){
            var hadslist = $scope.userHads,
                beerName = BEERFEST.encode( beer.name );

            if( hadslist[brewery] === undefined || hadslist[brewery].beers[beerName] === undefined ){
                return false;
            }

            hadslist[brewery].beers[beerName].isRating = true;
        }


        /**
         * check to see if this rating star should be highligted
         *  based on the beer's rating
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         * @param rating (number)
         *    - the rating icon we're checking
         */
        $scope.getRatingClass = function( beer, brewery, rating ){
            var hadslist = $scope.userHads,
                beerName = BEERFEST.encode( beer.name );

            if( hadslist === undefined || hadslist[brewery] === undefined || hadslist[brewery].beers[beerName] === undefined ){
                return false;
            }

            var beerRating = hadslist[brewery].beers[beerName].rating;

            return rating <= beerRating ? "rated" : false;
        }





        /**
         * assign classes to this beer
         * @param beer (object)
         *    - the beer object
         * @param brewery (string)
         *    - an encoded string of the brewery
         */
        $scope.beerClasses = function( beer, brewery ){
            var classes  = "",
                wishlist = $scope.userWishlist,
                hadslist = $scope.userHads,
                beerName = BEERFEST.encode(beer.name);

            if( wishlist !== undefined && wishlist[brewery] !== undefined && wishlist[brewery].beers[beerName] !== undefined ){
                classes += ' wishlisted';
            }


            if( hadslist !== undefined && hadslist[brewery] !== undefined && hadslist[brewery].beers[beerName] !== undefined ){
                classes += ' had';

                if( hadslist[brewery].beers[beerName].isRating ){
                    classes += ' prompt-rating';
                }
            }

            return classes;
        }


        /**
         * save the data, either to localStorage or to firebase
         * @return a promise, indicating that the save is done
         */
        $scope.saveData = function(){
            var hads     = $scope.userHads,
                wishlist = $scope.userWishlist,
                df       = $.Deferred();

            if( $scope.$parent.currentUser ){
                $scope.beerfestData.$save().then(function(r){
                    r.key() === $scope.beerfestData.$id;
                    df.resolve("Saved to Firebase");
                }, function(error){
                    console.log("Error: " + error);
                });

            } else {
                localStorage.userHads = JSON.stringify( hads );
                localStorage.userWishlist = JSON.stringify( wishlist );
            }

            return df;
        }



        // -------------------------------
        // getters
        //

        /**
         * gets the user's hads
         * @return object
         */
        function getUserHads(){

            // if someone is logged in
            if( $scope.$parent.currentUser && $scope.beerfestData.users ){
                var uid = $scope.$parent.currentUser.uid;

                if( $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ] === undefined ){
                    $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ] = {
                        hads     : {},
                        wishlist : {}
                    }
                }

                if( $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ].hads ){
                    return $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ].hads;
                } else {
                    return {};
                }
                
            }

            // if they're not logged in, check if this device has any
            //  saved data
            else if( localStorage.userHads ){
                return JSON.parse( localStorage.userHads );
            }

            return {};
        }


        /**
         * gets the user's wishlist
         * @return object
         */
        function getUserWishlist(){

            if( $scope.$parent.currentUser && $scope.beerfestData.users ){
                var uid = $scope.$parent.currentUser.uid;

                if( $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ] === undefined ){
                    $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ] = {
                        hads     : {},
                        wishlist : {}
                    }
                }

                if( $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ].wishlist ){
                    return $scope.beerfestData.users[ uid ].fests[ BEERFEST.name ].wishlist;
                } else {
                    return {};
                }

            } else if( localStorage.userWishlist ){
                return JSON.parse( localStorage.userWishlist );
            }

            return {};
        }
        
    }]); // BeerlistController


    app.controller( 'AllBeersController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){
        
        $scope.view = 'all';


        /**
         * return false, since this is the master list and requires
         *  no user input
         */
        $scope.noBeers = function(){
            return false;
        }

    }]);

    app.controller( 'HadsController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){

        $scope.view = 'hads';

        $scope.beerlist = {};
        
        // when the parent scope loads, set the beerlist
        $scope.$parent.beerfestData.$loaded().then( setBeerlist );

        // if the current user changes, set the beerlist
        $scope.$parent.$parent.$watch('currentUser', setBeerlist);


        /**
         * sets the scoped beerlist var to the user hads
         */
        function setBeerlist(){
            $scope.beerlist = $scope.$parent.userHads;
        }


        /**
         * check to see if there are any beers, and return the
         *  default message
         */
        $scope.noBeers = function(){
            return Object.keys( $scope.beerlist ).length > 0 ? false : "You have not had any beers.";
        }

    }]);
    app.controller( 'WishlistController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){
        
        $scope.view = 'wishlist';

        $scope.beerlist = {};

        // when the parent scope loads, set the beerlist
        $scope.$parent.beerfestData.$loaded().then( setBeerlist );

        // if the current user changes, set the beerlist
        $scope.$parent.$parent.$watch('currentUser', setBeerlist);


        /**
         * sets the scoped beerlist var to the user hads
         */
        function setBeerlist(){
            $scope.beerlist = $scope.$parent.userWishlist;
        }


        /**
         * check to see if there are any beers, and return the
         *  default message
         */
        $scope.noBeers = function(){
            return $scope.beerlist && Object.keys( $scope.beerlist ).length > 0 ? false : "You have not wishlisted any beers.";
        }


    }]);


    app.controller( 'AddBeerController', ['$firebaseArray', '$scope', '$timeout', function( $firebaseArray, $scope, $timeout ){

        $scope.breweryList = [];

        $scope.breweryName = '';
        $scope.beerName = '';
        $scope.breweryBeers = false;

        $scope.submitText = "Add beer";

        $scope.message = '';

        // when the parent scope loads, set the beerlist
        $scope.$parent.beerfestData.$loaded().then( getBreweryList );


        /**
         * the brewery that has been chosen
         */
        $scope.chooseBrewery = function( brewery ){
            brewery = BEERFEST.encode( brewery );

            if( $scope.$parent.beerlist[brewery] === undefined ){
                return;
            }

            $scope.breweryBeers = $scope.$parent.beerlist[brewery].beers;
        }


        /**
         * when the user is typing into the brewery input, clear the beers
         */
        $scope.clearBeers = function( search ){
            if( search.length < 2 ){
                $scope.breweryBeers = false;    
            }
        }


        /**
         * add the beer
         */
        $scope.addBeer = function(){

            var brewery  = BEERFEST.encode( $scope.breweryName ),
                beerData = {
                    abv      : "-",
                    ba_score : "-",
                    name     : $scope.beerName,
                    style    : "-"
                };

            $scope.submitText = "Adding the new beer...";

            var ref = BEERFEST_DATA.child( 'beerfests/' + BEERFEST.name + '/beerlist/' + brewery + '/beers');

            var beers = $firebaseArray( ref );

            beers.$add( beerData ).then(function( ref ){
                var id = ref.key();
                console.log("added record with id " + id);
                beers.$indexFor(id); // returns location in the array

                if( $scope.$parent.beerlist[brewery] === undefined ){
                    $scope.$parent.beerlist[brewery] = {
                        beers: {}
                    };
                }

                if( Array.isArray( $scope.$parent.beerlist[brewery].beers ) ){
                    $scope.$parent.beerlist[brewery].beers.push( beerData );
                } else {
                    $scope.$parent.beerlist[brewery].beers[ id ] = beerData;
                }

                $scope.submitText = "Add beer";
                $scope.beerName = '';
                $scope.breweryName = '';
                $scope.breweryBeers = false;
                $scope.message = "Beer added";

                $timeout(function(){
                    $scope.message = '';
                }, 2000);
            });
        }


        /**
         * gets the breweries and returns an array of them
         */
        function getBreweryList(){
            angular.forEach( $scope.$parent.beerlist, function( beers, brewery ){
                $scope.breweryList.push( BEERFEST.decode( brewery) );
            });
        }
    }]);


    // -------------------------------
    // filters
    //

    /**
     * filter to decode a string
     */
    app.filter( 'decode', function(){
        return function( val ){
            return BEERFEST.decode(val);
        }
    });


    app.filter('toArray', function () {
      return function (obj, addKey) {
        if (!angular.isObject(obj)) return obj;
        if ( addKey === false ) {
          return Object.keys(obj).map(function(key) {
            return obj[key];
          });
        } else {
            return Object.keys(obj).map(function (key) {
                var value = obj[key];
                return angular.isObject(value) ?
                    Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
                    { $key: key, $value: value };
            });
        }
      };
    });



    // -------------------------------
    // directives
    //

    app.directive( "beerlist", function( $compile ){
        return {
            templateUrl: 'templates/beer-view.html'
        };
    });



    // -------------------------------
    // regular functions
    //

    /**
     * adjust the app layout based on the header size and stuff like that
     */
    function adjustAppLayout(){
        var headerHeight = $('.app-banner').height();
        $('.app-main, .app-drawer').css('paddingTop', headerHeight + 'px');
    }



    // -------------------------------
    // jQuery
    //

    $(document).ready(function(){
        adjustAppLayout();
    });



})(window.BEERFEST = window.BEERFEST || {}, jQuery);




(function(BEERFEST, $, undefined){


    BEERFEST.encode = function(string){
        if( string === undefined ){
            return "";
        }
        return encodeURIComponent(string).replace(/\./g, '%2E');
    };

    BEERFEST.decode = function(string){
        if( string === undefined ){
            return "";
        }
        return decodeURIComponent(string.replace('%2E', '.'));
    };

})(window.BEERFEST = window.BEERFEST || {}, jQuery);