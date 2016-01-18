

;(function(BEERFEST, $, undefined){

    BEERFEST.name = "ebf-2016";

    // -------------------------------
    // globals
    //

    var uid;


    // -------------------------------
    // angular
    //

    var app = angular.module('beerfest', ['firebase']);

    var BEERFEST_DATA = new Firebase("https://braican-beerfest.firebaseio.com");

    app.controller( 'BeerfestController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){
        // loaded
        $scope.loaded = false;

        $scope.drawerActive = false;

        // the current app view
        //  - all-beers
        //  - hads
        //  - wishlist
        $scope.appView = 'all-beers';


        $scope.currentUser = null;


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


    app.controller( 'AuthController', ['$scope', '$firebaseAuth', function( $scope, $firebaseAuth ){

        var auth = $firebaseAuth( BEERFEST_DATA );

        $scope.ctrlError = null;


        var authData = auth.$getAuth();


        if (authData) {
          console.log("Logged in as:", authData.uid);
          $scope.$parent.currentUser = authData;
        }

        /**
         * sign in
         */
        $scope.login = function(){

            auth.$authWithPassword({
                email    : $scope.email,
                password : $scope.password
            }).then( function( user ){
                $scope.$parent.currentUser = user;
            }, function( error ){
                console.log( error );
                $scope.ctrlError = error;
            });
        }

    } ]); // AuthController


    app.controller( 'BeerlistController', ['$firebaseObject', '$scope', '$timeout', function( $firebaseObject, $scope, $timeout ){
        
        // an object of all the current user's beers
        $scope.userHads = getUserHads();

        // an object of all the user's wishlisted beers
        $scope.userWishlist = getUserWishlist();

        // the beer data, from firebase
        $scope.beerData = $firebaseObject( BEERFEST_DATA );

        // lets load the data in
        $scope.beerData.$loaded().then(function(){
            $scope.$parent.loaded = true;

            // get the specific beerfest data into a variable so we
            //  can get it easier in the template.
            $scope.beerlist = $scope.beerData.beerfests[BEERFEST.name].beerlist;

        }).catch(function(error){
            console.error("Error: " + error);
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
        $scope.beerRating = function( beer, brewery ){
            var hadslist = $scope.userHads,
                beerName = BEERFEST.encode( beer.name );

            if( hadslist[brewery] === undefined || hadslist[brewery].beers[beerName] === undefined ){
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

            $scope.saveData();

            $timeout(function(){
                hadslist[brewery].beers[beerName].isRating = false;

                $scope.saveData();
            }, 600);
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

            if( hadslist[brewery] === undefined || hadslist[brewery].beers[beerName] === undefined ){
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

            if( wishlist[brewery] !== undefined && wishlist[brewery].beers[beerName] !== undefined ){
                classes += ' wishlisted';
            }
            if( hadslist[brewery] !== undefined && hadslist[brewery].beers[beerName] !== undefined ){
                classes += ' had';

                if( hadslist[brewery].beers[beerName].isRating ){
                    classes += ' prompt-rating';
                }
            }

            return classes;
        }


        /**
         * save the data, either to localStorage or to firebase
         */
        $scope.saveData = function(){
            var hads     = $scope.userHads,
                wishlist = $scope.userWishlist;

            localStorage.userHads = JSON.stringify( hads );
            localStorage.userWishlist = JSON.stringify( wishlist );
            
        }



        // -------------------------------
        // getters
        //

        /**
         * gets the user's hads
         * @return object
         */
        function getUserHads(){
            if( localStorage.userHads ){
                return JSON.parse( localStorage.userHads );
            }

            return {};
        }


        /**
         * gets the user's wishlist
         * @return object
         */
        function getUserWishlist(){
            if( localStorage.userWishlist ){
                return JSON.parse( localStorage.userWishlist );
            }

            return {};
        }
        
    }]); // BeerlistController


    app.controller( 'AllBeersController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){
        $scope.view = 'all';
    }]);
    app.controller( 'HadsController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){
        $scope.beerlist = $scope.userHads;
    }]);
    app.controller( 'WishlistController', ['$firebaseObject', '$scope', function( $firebaseObject, $scope ){
        $scope.beerlist = $scope.userWishlist;
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
        var loginData = BEERFEST_DATA.getAuth();

        adjustAppLayout();

        if( loginData ){

        }
    });



})(window.BEERFEST = window.BEERFEST || {}, jQuery);



//
// BEERFEST - namespace
//
;(function(BEERFEST, $, undefined$){

    

    // // svg stuff
    // var svgColor  = '#cccccc',
    //     starSvg   = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="28" viewBox="0 0 26 28"><path d="M26 10.109q0 0.344-0.406 0.75l-5.672 5.531 1.344 7.812q0.016 0.109 0.016 0.313 0 0.328-0.164 0.555t-0.477 0.227q-0.297 0-0.625-0.187l-7.016-3.687-7.016 3.687q-0.344 0.187-0.625 0.187-0.328 0-0.492-0.227t-0.164-0.555q0-0.094 0.031-0.313l1.344-7.812-5.688-5.531q-0.391-0.422-0.391-0.75 0-0.578 0.875-0.719l7.844-1.141 3.516-7.109q0.297-0.641 0.766-0.641t0.766 0.641l3.516 7.109 7.844 1.141q0.875 0.141 0.875 0.719z" fill="' + svgColor + '"></path></svg>',
    //     checkSvg  = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 28 28"><path d="M26.109 8.844q0 0.625-0.438 1.062l-13.438 13.438q-0.438 0.438-1.062 0.438t-1.062-0.438l-7.781-7.781q-0.438-0.438-0.438-1.062t0.438-1.062l2.125-2.125q0.438-0.438 1.062-0.438t1.062 0.438l4.594 4.609 10.25-10.266q0.438-0.438 1.062-0.438t1.062 0.438l2.125 2.125q0.438 0.437 0.438 1.062z" fill="' + svgColor + '"></path></svg>',
    //     removeSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 28 28"><path d="M17.953 17.531q0-0.406-0.297-0.703l-2.828-2.828 2.828-2.828q0.297-0.297 0.297-0.703 0-0.422-0.297-0.719l-1.406-1.406q-0.297-0.297-0.719-0.297-0.406 0-0.703 0.297l-2.828 2.828-2.828-2.828q-0.297-0.297-0.703-0.297-0.422 0-0.719 0.297l-1.406 1.406q-0.297 0.297-0.297 0.719 0 0.406 0.297 0.703l2.828 2.828-2.828 2.828q-0.297 0.297-0.297 0.703 0 0.422 0.297 0.719l1.406 1.406q0.297 0.297 0.719 0.297 0.406 0 0.703-0.297l2.828-2.828 2.828 2.828q0.297 0.297 0.703 0.297 0.422 0 0.719-0.297l1.406-1.406q0.297-0.297 0.297-0.719zM24 14q0 3.266-1.609 6.023t-4.367 4.367-6.023 1.609-6.023-1.609-4.367-4.367-1.609-6.023 1.609-6.023 4.367-4.367 6.023-1.609 6.023 1.609 4.367 4.367 1.609 6.023z" fill="' + svgColor + '"></path></svg>';

    // // firebase data
    // var beerfest_data = new Firebase("https://braican-beerfest.firebaseio.com/"),
    //     FIREBASE_DATA,
    //     BREWERY_LIST,
    //     USER_EMAIL,
    //     uid,
    //     headerHeight;




    // /* --------------------------------------------
    //  * --util
    //  * -------------------------------------------- */
    
    // /**
    //  * ajaxError
    //  *
    //  * console some stuff if we error out
    //  */
    // function ajaxError( jqxhr, textStatus, error ) {
    //     console.log( "Request Failed: " + error );
    //     console.log(textStatus);
    // }


    // /**
    //  * beerfest_user_data 
    //  * 
    //  * get the user data from firebase
    //  */
    // function beerfest_user_data(){
    //     if(uid){
    //         return beerfest_data.child('users/' + uid + '/fests/' + BEERFEST.name);
    //     } else {
    //         return false;
    //     }
        
    // }

    // /**
    //  * getUrlParam
    //  *
    //  * Utility function to snag a query string value when passed the parameter
    //  */
    // function getUrlParam(name) {
    //     var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    //     if (!results) {
    //         return 0;
    //     }
    //     return results[1] || 0;
    // }
    



    // /* --------------------------------------------
    //  * --rendering
    //  * -------------------------------------------- */

    // /**
    //  * renderBeers
    //  *
    //  * render the markup for the list of beers
    //  * @param data: the data to render
    //  */
    // function renderBeers(data){
    //     var beerdata    = data.val(),
    //         navArray    = [],
    //         getUserData = beerfest_user_data(),
    //         userData,
    //         currentLetter;

    //     $('#beerlist .beer-list').empty();

    //     $('.loader').removeClass('hidden');

    //     if(getUserData){
    //         getUserData.once('value', function(snapshot){
    //             userData = snapshot.val();
    //             addTheBeers();
    //         });
    //     } else {
    //         addTheBeers();
    //     }

    //     FIREBASE_DATA = beerdata;

    //     BREWERY_LIST = $.map(beerdata, function(beers, brewery){
    //         return brewery;
    //     });


    //     function addTheBeers(){
            
    //         $.each(beerdata, function(brewery, breweryData){

    //             var markup      = '<li class="brewery" data-brewery="' + brewery + '"><div class="brewery-header"><span class="breweryname">' + decodeURIComponent(brewery) + '</span><span class="expand">+</span><span class="collapse">-</span></div><ul class="beers">',
    //                 firstLetter = brewery.toLowerCase().charAt(0).match(/[a-z]/i) ? brewery.toLowerCase().charAt(0) : "#";

    //             if(firstLetter !== currentLetter && navArray.indexOf(firstLetter) === -1 ){
    //                 navArray.push(firstLetter);
    //             }

    //             $.each(breweryData.beers, function(index, beerObj){
    //                 var beer        = beerObj.name,
    //                     encodedBeer = BEERFEST.encodeValue(beer),
    //                     beerUnique  = brewery + '_' + encodedBeer,
    //                     rating      = getBeerRating(userData, beerUnique),
    //                     isWishlist  = getIsWishList(userData, beerUnique) ? ' wishlist' : '',
    //                     isRated     = rating ? ' rate-it' : '';

    //                 markup += '<li class="beer' + isRated + isWishlist + '" data-beer="' + encodedBeer + '"><div class="beerwrapper">' +
    //                             '<div class="beer-util"><ul>' +
    //                                 '<li class="rate">' + checkSvg + '</li>' +
    //                                 '<li class="wishlist">' + starSvg + '</li>' +
    //                             '</ul></div>' +
    //                             '<div class="beer-rating">' + getRatingDropdownMarkup(rating) + '</div>' +
    //                             '<div class="beer-info">' +
    //                                 '<div class="beer-name">' + beer + '</div>' +
    //                                 '<div class="beer-extra flex-item">';

    //                 if(beerObj.style){
    //                     markup += '<div class="beer-style">' + beerObj.style + '</div>';
    //                 }
    //                 if(beerObj.abv){
    //                     markup += '<div class="beer-abv"><em>ABV:</em><br> ' + beerObj.abv + '</div>';
    //                 }
    //                 if(beerObj.ba_score){
    //                     markup += '<div class="beer-score"><em>BA Score:</em><br> ' + beerObj.ba_score + '</div>';
    //                 }
    //                 if(beerObj.addedBy){
    //                     markup += '<div class="beer-adder"><em>Added by:</em> ' + beerObj.addedBy + '</div>';
    //                 }

    //                 markup +=       '</div>' +
    //                             '</div>' +
    //                           '</div></li>'
    //             });
    //             markup += '</ul></li>';
    //             $('#beerlist .beer-list').append(markup);
    //         });

    //         $('.loader').addClass('hidden');

    //         $.each(navArray, function(index, character){
    //             $('#scrollit').append('<li data-char="' + character.toUpperCase() + '">' + character.toUpperCase() + '</li>');
    //         });
    //     }
    // }


    // /**
    //  * getIsWishList 
    //  * 
    //  * check to see if the given beer is on the wishlist
    //  * @param beer (string)
    //  */
    // function getIsWishList(userData, beer){
    //     if(userData){
    //         return userData.wishlist && userData.wishlist[beer] > -1;
    //     } else {
    //         return localStorage.getItem(beer + '_wishlist');
    //     }
    // }


    // /**
    //  * getBeerRating 
    //  * 
    //  * get the beer rating
    //  * @param name paramter description
    //  */
    // function getBeerRating(userData, beer){
    //     if(userData){
    //         return userData.hads ? userData.hads[beer] : false;
    //     } else {
    //         return localStorage.getItem(beer);
    //     }
    // }


    // /**
    //  * getRatingDropdownMarkup 
    //  * 
    //  * util function that returns the markup for the ratings dropdown
    //  * @param rating: if a rating has already been chosen, select that one
    //  */
    // function getRatingDropdownMarkup(rating){
    //     var possibleRatings = [1, 2, 3, 4, 5],
    //         markup          = '<span data-value="-1">' + removeSvg + '</span>';

    //     $.each(possibleRatings, function(i, r){
    //         var isSelected = rating >= r ? ' selected' : '';
    //         markup += '<span class="star' + isSelected + '" data-value="' + r + '">' + starSvg + '</span>';
    //     });

    //     return markup;
    // }

    // /**
    //  * renderGlobal 
    //  * 
    //  * reset to the global list
    //  */
    // function renderGlobal(){
    //     $('#beerlist').removeClass('brewery-open');
    //     $('#beerlist .brewery').removeClass('inactive active');
    //     $('#beerlist .beers').removeClass('active');
    // }


    // /**
    //  * renderHads 
    //  * 
    //  * render the user's hads
    //  */
    // function renderHads(){
    //     $('#beerlist .brewery').each(function(i, brewery){
    //         var $brewery = $(brewery).removeClass('inactive'),
    //             numHads  = $brewery.find('.beer').filter(function(){
    //                 return $(this).hasClass('rate-it');
    //             }).length;

    //         if(numHads == 0){
    //             $brewery.addClass('inactive');
    //         }
    //     });
    // }



    // /**
    //  * renderWishlist 
    //  * 
    //  * render the user's wishlist
    //  */
    // function renderWishlist(){
    //     $('#beerlist .brewery').each(function(i, brewery){
    //         var $brewery = $(brewery).removeClass('inactive'),
    //             numHads  = $brewery.find('.beer').filter(function(){
    //                 return ($(this).hasClass('wishlist') && !$(this).hasClass('rate-it') );
    //             }).length;

    //         if(numHads == 0){
    //             $brewery.addClass('inactive');
    //         }
    //     });
    // }



    // /**
    //  * renderMore 
    //  * 
    //  * render the more content
    //  */
    // function renderMore(){
    
    // }




    // /* --------------------------------------------
    //  * --UX
    //  * -------------------------------------------- */


    // /**
    //  * promptSpecialUser 
    //  * 
    //  * does some things for the user
    //  */
    // function promptSpecialUser(){
    //     if(!uid){
    //         $('.not-special').after('<p class="special-user-register"><a href="#" class="user-register">Register</a></p>').remove();
    //     }
    // }



    // /**
    //  * beerfestNav 
    //  * 
    //  * navigation clicks router
    //  * @param event (click event)
    //  */
    // function beerfestNav(event){
    //     var $t     = $(this),
    //         list   = $t.data('list'),
    //         title  = $t.data('title'),
    //         module = $t.data('module');

    //     $t.addClass('active').siblings('.active').removeClass('active');
    //     $('#' + module).addClass('active').siblings('.active').removeClass('active');

    //     $('#app-header h2').text(title);

    //     $('body').removeClass('menu-open hads wishlist global more search search-for-brewery search-for-beer').addClass(list);

    //     $('.more-element.active').removeClass('active');

    //     $('#input-search').val('');

    //     if(list == 'hads'){
    //         renderHads();
    //     } else if(list =='wishlist'){
    //         renderWishlist();
    //     } else if(list == 'global'){
    //         renderGlobal();
    //     } else if(list == 'more'){
    //         renderMore();
    //     } else if(list == 'search'){
    //         $('body').addClass( 'search-for-' + $('.search-nav li.active').data('search') );
    //         $('.brewery.active').removeClass('active');
    //     }
    // }



    // /**
    //  * scrollToLetter
    //  *
    //  * scroll the page to the selected letter
    //  * @param event: the object from the click
    //  */
    // function scrollToLetter(event){
    //     event.preventDefault();

    //     var $t     = $(this),
    //         letter = $t.addClass('selected').data('char').toLowerCase();

    //     setTimeout(function(){
    //         $t.removeClass('selected');
    //     }, 200);

    //     if(letter == "#"){
    //         $('#app').animate({
    //             scrollTop: 0
    //         });
    //     } else {
    //         $('#beerlist .beer-list .brewery:visible').each(function(i, e){
    //             var breweryname = $(e).data('brewery').toLowerCase();

    //             if(letter == breweryname.charAt(0).toLowerCase()){
    //                 $('#app').animate({
    //                     scrollTop: $(e).position().top - headerHeight - 16
    //                 });
    //                 return false;
    //             }
    //         });    
    //     }
        
    // }


    // /**
    //  * engageOverlayLogin 
    //  * 
    //  * do the mobile menu
    //  * @param event: the object from the click
    //  */
    // function engageOverlayLogin(event){
    //     event.preventDefault();
    //     $('body').toggleClass('menu-open');
    // }





    // /* --------------------------------------------
    //  * --beer interactions
    //  * -------------------------------------------- */

    // /**
    //  * clearAllClicks 
    //  * 
    //  * clear all the click
    //  * @param event: the object from the click
    //  */
    // function clearAllClicks(event){
    //     if(!$(event.target).hasClass('rate-new-beer')){
    //         $('.beer').removeClass('highlighted');
    //     }
    // }   


    // /**
    //  * openBeerlist 
    //  * 
    //  * toggles the opening/closing of a beer list
    //  */
    // function openBeerlist(event){
    //     event.preventDefault();

    //     var $brewery = $(this).closest('.brewery').toggleClass('active');
            
    //     $brewery.siblings().removeClass('active');

    //     if($('.brewery.active').length == 0){
    //         $('#beerlist').removeClass('brewery-open');
    //     } else {
    //         $('#beerlist').addClass('brewery-open');
    //     }

    //     $('#app').animate({
    //         scrollTop: $brewery.position().top - headerHeight - 8
    //     });
    // }

    

    // /**
    //  * toggleWishlist 
    //  * 
    //  * add the current beer to the wishlist
    //  * @param event: the object from the click
    //  */
    // function toggleWishlist(event){
    //     event.preventDefault();
        
    //     var $t         = $(this),
    //         brewery    = $t.closest('.brewery').data('brewery');
    //         beer       = $t.closest('.beer').toggleClass('wishlist').data('beer'),
    //         beerUnique = brewery + '_' + beer;

    //     if(uid){
    //         var wishlist = beerfest_user_data().child('wishlist/' + beerUnique);
    //         if($t.closest('.beer').hasClass('wishlist')){
    //             wishlist.set(true);
    //         } else {
    //             wishlist.remove();
    //         }
    //     } else {
    //         if(localStorage.getItem(beerUnique + '_wishlist')){
    //             localStorage.removeItem(beerUnique + '_wishlist');
    //         } else {
    //             localStorage.setItem(beerUnique + '_wishlist', true);
    //         }
    //     }
    // }


    // /**
    //  * toggleRateBeer 
    //  * 
    //  * toggle the visibility of the rating module
    //  * @param event: the object from the click
    //  */
    // function toggleRateBeer(event){
    //     event.preventDefault();

    //     var $beer      = $(this).closest('.beer'),
    //         brewery    = $beer.closest('.brewery').data('brewery'),
    //         beer       = $beer.data('beer'),
    //         uniqueBeer = brewery + '_' + beer,
    //         hads       = uid ? beerfest_user_data().child('hads/' + uniqueBeer) : false;

    //     $beer.toggleClass('rate-it');

    //     if(hads){
    //         hads.set("done");
    //     } else {
    //         localStorage.setItem(uniqueBeer, 0); 
    //     }
    // }



    // /**
    //  * rateBeer 
    //  * 
    //  * click on one of the ratings
    //  * @param event: the object from the click
    //  */
    // function rateBeer(event){
    //     event.preventDefault();
    //     event.stopPropagation();

    //     var $t         = $(this),
    //         $parent    = $t.closest('.beer').removeClass('highlighted'),
    //         brewery    = $t.closest('.brewery').data('brewery'),
    //         beer       = $parent.data('beer'),
    //         rating     = $t.data('value'),
    //         uniqueBeer = brewery + '_' + beer,
    //         hads       = uid ? beerfest_user_data().child('hads/' + uniqueBeer) : false;

    //     if(rating === -1){
    //         $t.siblings('.star').removeClass('selected');
    //         $parent.removeClass('rate-it');
    //         if(hads){
    //             hads.remove();
    //         } else {
    //             localStorage.removeItem(uniqueBeer);    
    //         }
            
    //     } else {
    //         $t.addClass('selected').siblings('.star').removeClass('selected').filter(function(){
    //             return $(this).index() < $t.index();
    //         }).addClass('selected');

    //         if(hads){
    //             hads.set(rating);
    //         } else {
    //             localStorage.setItem(uniqueBeer, rating);
    //         }
    //     }
    // }


    // // -------------------------------
    // // --search
    // //

    // /**
    //  * changeSearchParams 
    //  * 
    //  * switch between searching for a beer or a brewery
    //  * @param event
    //  */
    // function changeSearchParams(event){
    //     event.preventDefault();

    //     var placeholder = $(this).data('placeholder'),
    //         searchable  = $(this).data('search');

    //     $(this).addClass('active').siblings().removeClass('active');
    //     $('#input-search').attr('placeholder', placeholder).data('search', searchable);
    //     $('body').removeClass('search-for-brewery search-for-beer').addClass('search-for-' + searchable);

    //     $('#input-search').trigger('keyup');
    // }


    // /**
    //  * searchForBeer 
    //  * 
    //  * search for beer by typing in the input
    //  * @param event
    //  */
    // function searchForBeer(event){
    //     event.preventDefault();

    //     var searchable = $(this).data('search');
    //         query      = $(this).val().toLowerCase();

    //     if(query){
    //         $('.input-container').addClass('active');
    //         $('#beerlist .brewery').each(function(i, brewery){
    //             var $brewery = $(brewery).removeClass('active');

    //             if(searchable == 'beer'){
    //                 $('.beer', brewery).each(function(ii, beer){
    //                     var $beer    = $(beer).removeClass('active'),
    //                         beername = $('.beer-name', beer).text().toLowerCase();

    //                     if(beername.indexOf(query) > -1){
    //                         $brewery.addClass('active');
    //                         $beer.addClass('active');
    //                     }
    //                 });    
    //             } else {
    //                 var brewery = $('.breweryname', $brewery).text().toLowerCase();

    //                 if(brewery.indexOf(query) > -1){
    //                     $brewery.addClass('active');
    //                 }
    //             }
    //         });
    //     } else {
    //         $('.input-container').removeClass('active');
    //         $('#beerlist .brewery, #beerlist .beer').removeClass('active');
    //     }
    // }

    // /**
    //  * clearSearchInput 
    //  * 
    //  * clear the search textfield
    //  * @param event
    //  */
    // function clearSearchInput(event){
    //     event.preventDefault();

    //     $(this).siblings().find('input').val('').trigger('keyup');
    // }




    // // -------------------------------
    // // --more
    // //


    // /**
    //  * openMoreContent 
    //  * 
    //  * description
    //  * @param event
    //  */
    // function openMoreContent(event){
    //     event.preventDefault();
    //     $('.message-center').remove();
    //     $(this).closest('.more-element').toggleClass('active').siblings('.active').removeClass('active');
    // }



    // /**
    //  * focusAddNewBeer 
    //  * 
    //  * on focus of the input to add a new beer
    //  * @param event
    //  */
    // function focusAddNewBeer(event){
    //     $('.message-center').remove();
    // }



    // /**
    //  * getBreweries 
    //  * 
    //  * on input, get all breweries that match the input
    //  * @param event
    //  */
    // function getBreweries(event){
    //     var input          = BEERFEST.encodeValue( $(this).val() ).toLowerCase(),
    //         checkBreweries = BREWERY_LIST.filter(inputInList),
    //         $chooseList    = $('#brewery-choose-list').empty();

    //     if(input){
    //         $(this).siblings('.list-holder').addClass('active');
    //     } else {
    //         $(this).siblings('.list-holder').removeClass('active');
    //     }

    //     if(checkBreweries){
    //         $.each(checkBreweries, function() {
    //             $chooseList.append('<li data-val="' + this + '">' + BEERFEST.decodeValue(this) + '</li>');
    //         });
            
    //     }

    //     $chooseList.append('<li data-val="other">+ Add Brewery</li>');


    //     /**
    //      * inputInList 
    //      * 
    //      * filter function to test if an array item includes the input from the textbox
    //      * @param el : the element in the array
    //      */
    //     function inputInList(el){
    //         return el.toLowerCase().indexOf(input) > -1;
    //     }
    // }


    // /**
    //  * chooseBrewery 
    //  * 
    //  * choose the brewery that makes the beer you're adding
    //  * @param event
    //  */
    // function chooseBrewery(event){
    //     event.preventDefault();
    //     var brewery = $(this).data('val');

    //     if(brewery == 'other'){
    //         brewery = $('#input-choose-brewery').val();
    //     }

    //     $('.chosen-brewery').text( BEERFEST.decodeValue(brewery) );
    //     $('.add-new-beer').addClass('brewery-chosen').data('new-brewery', brewery);
    //     $('#input-choose-brewery').val('');
    //     $('.list-holder.active').removeClass('active');
    // }

    // /**
    //  * changeBrewery 
    //  * 
    //  * change the brewery
    //  * @param event
    //  */
    // function changeBrewery(event){
    //     event.preventDefault();
    //     $('.chosen-brewery').text('');
    //     $('.add-new-beer').removeClass('brewery-chosen').removeData('new-brewery');
    // }


    // /**
    //  * addNewBeer 
    //  * 
    //  * check if the beer exists, if not, add it
    //  * @param event
    //  */
    // function addNewBeer(event){
    //     event.preventDefault();

    //     var brewery    = $(this).data('new-brewery'),
    //         beer       = $('#input-choose-beer', this).val(),
    //         addedBy    = '',
    //         beerObj    = {
    //             name: beer
    //         },
    //         newBrewery = false,
    //         dupeStatus = checkIfDupe();

    //     $('#input-choose-beer').val('');

    //     if(USER_EMAIL){
    //         beerObj.addedBy = USER_EMAIL;
    //         addedBy = '<div class="beer-extra flex-item"><div class="beer-adder"><em>Added by:</em> ' + USER_EMAIL + '</div></div>';
    //     }

    //     $('.message-center').remove();

    //     if(!dupeStatus){

    //         beerfest_data.child('beerfests/' + BEERFEST.name + '/beerlist/' + brewery + '/beers').push(beerObj, function(){

    //             var beerMarkup = '<li class="beer" data-beer="' + BEERFEST.encodeValue(beer) + '">' +
    //                                 '<div class="beerwrapper">' +
    //                                     '<div class="beer-util"><ul>' +
    //                                         '<li class="rate">' + checkSvg + '</li>' +
    //                                         '<li class="wishlist">' + starSvg + '</li>' +
    //                                     '</ul></div>' +
    //                                     '<div class="beer-rating">' + getRatingDropdownMarkup(0) + '</div>' +
    //                                     '<div class="beer-info flex-item">' +
    //                                         '<div class="beer-name">' + beer + '</div>' + addedBy +
    //                                     '</div>' +
    //                                 '</div>' +
    //                             '</li>';
                
    //             $('.add-new-beer')
    //                 .removeClass('brewery-chosen')
    //                 .prepend('<div class="message-center">You have successfully added ' + beer + ' by ' + BEERFEST.decodeValue(brewery) + '. <br>' +
    //                             '<a href="#" class="rate-new-beer button" data-beer="' + BEERFEST.encodeValue(beer) + '" data-brewery="' + brewery + '">Rate it</a></div>');

    //             if(newBrewery){
    //                 var brewerymarkup = '<li class="brewery" data-brewery="' + brewery + '">' +
    //                                         '<div class="brewery-header">' +
    //                                             '<span class="breweryname">' + BEERFEST.decodeValue(brewery) + '</span>' +
    //                                             '<span class="expand">+</span><span class="collapse">-</span>' +
    //                                         '</div>' +
    //                                         '<ul class="beers">' + beerMarkup + '</ul>' +
    //                                     '</li>';
    //                 $('#beerlist .beer-list').append(brewerymarkup);
    //             } else{
    //                 $('li.brewery[data-brewery="' + brewery + '"] .beers').append(beerMarkup);
    //             }

                


    //         });
    //     } else {
    //         $('.add-new-beer').removeClass('brewery-chosen').prepend('<div class="message-center">That beer already exists.</div>');
    //         setTimeout(function(){
    //             $('.successful-add').slideUp(function(){
    //                 $(this).remove();
    //             });
    //         }, 4000);
    //     }

        
    //     /**
    //      * checkIfDupe 
    //      * 
    //      * check to see if the input beer is a duplicate
    //      */
    //     function checkIfDupe(){
    //         if(FIREBASE_DATA[brewery] && FIREBASE_DATA[brewery].beers){
    //             var isDupe = false,
    //                 index  = 0;
                
    //             $.each(FIREBASE_DATA[brewery].beers, function(i, beerObj) {
    //                 if(beerObj.name == beer){
    //                     isDupe = true;
    //                 }
    //                 index = i;
    //             });

    //             FIREBASE_DATA[brewery].beers[index + 1] = {
    //                 name: beer
    //             };
                
    //             return isDupe;
    //         } else {
    //             newBrewery = true;
    //             brewery = BEERFEST.encodeValue(brewery);
    //             FIREBASE_DATA[brewery] = {
    //                 beers: [{
    //                     name: beer
    //                 }]
    //             };
    //             return false;
    //         }
    //     }
    // }



    // /**
    //  * rateNewBeer 
    //  * 
    //  * rate the newly added beer by loading up the global list and oening the new beer
    //  * @param name paramter description
    //  */
    // function rateNewBeer(name){
    //     var beer        = $(this).data('beer'),
    //         brewery     = $(this).data('brewery'),
    //         $breweryDiv = $('.brewery[data-brewery="' + brewery + '"]'),
    //         $beerDiv    = $('.beer[data-beer="' + beer + '"]', $breweryDiv);

    //     $('.message-center').remove();

    //     $('.util-nav li[data-list="global"]').trigger('click');
    //     $('.brewery-header', $breweryDiv).trigger('click');

    //     $('.rate', $beerDiv).trigger('click');
    //     $beerDiv.addClass('highlighted');

    //     $('#app').animate({
    //         scrollTop: $beerDiv.position().top - headerHeight - 8
    //     });
    // }


    // /**
    //  * getRandomBeer 
    //  * 
    //  * choose a beer at random
    //  * @param event
    //  */
    // function getRandomBeer(event){
    //     event.preventDefault();

    //     var randomBrewery    = pickRandomProperty(FIREBASE_DATA),
    //         beerArray        = FIREBASE_DATA[randomBrewery].beers
    //         randomBeer       = beerArray[Math.floor(Math.random() * beerArray.length)],
    //         randomBeerMarkup = 'Head over to ' + BEERFEST.decodeValue(randomBrewery) + ' and try their ' + randomBeer.name,
    //         $random          = $('.random-result');

        
    //     $random.addClass('transition load-in').find('.new').html(randomBeerMarkup);

    //     setTimeout(function(){
    //         $random.removeClass('transition load-in').find('.old').html(randomBeerMarkup);
    //     }, 200);
    // }


    // /**
    //  * pickRandomProperty 
    //  * 
    //  * pick a property from an object at random
    //  * @param obj - the object form which to grab a rando
    //  */
    // function pickRandomProperty(obj){
    //     var result,
    //         count = 0;
    //     for (var prop in obj){
    //         if (Math.random() < 1/++count){
    //            result = prop;
    //         }
    //     }
    //     return result;
    // }



    // // -------------------------------
    // // --LOGIN / REGISTER
    // //

    // /**
    //  * submitLoginOrRegister 
    //  * 
    //  * submit the form to prompt the login OR the register
    //  */
    // function submitLoginOrRegister(event){
    //     event.preventDefault();

    //     var $t       = $(this),
    //         email    = $('input[name="user_email"]', this).val(),
    //         password = $('input[name="user_password"]', this).val();

    //     $t.addClass('loading');

        
    //     if($t.hasClass('is-register-form')){
    //         doRegister($t, email, password);
    //     } else {
    //         doLogin($t, email, password);
    //     }
    // }


    // /**
    //  * doLogin 
    //  * 
    //  * do the login
    //  * @params $form, email, password
    //  */
    // function doLogin($form, email, password){
    //     beerfest_data.authWithPassword({
    //         email    : email,
    //         password : password
    //     }, function(error, authData) {
    //         $form.removeClass('loading');
    //         if (error) {
    //             console.log("Login Failed!", error);
    //             $form.find('.error').remove();
    //             $('h2', $form).after('<div class="error">' + error.message + '</div>');
    //             $('input[name="user_password"]', $form).val('');
    //         } else {
    //             console.log("Authenticated successfully with payload:", authData);
                
    //             uid = authData.uid;
    //             $('body').removeClass('menu-open');

    //             showWelcome(authData.password.email);
                
    //             BEERFEST.getBeerList();

    //             $('.util-nav li[data-list="global"]').trigger('click');
    //             $('h2, button', $form).text("Log In");

    //             setTimeout(function(){
    //                 $('body').removeClass('anonymous').addClass('logged-in');
    //                 $('.error', $form).remove();
    //                 $('input', $form).val('');
    //             }, 400);
                
    //         }
    //     });
    // }


    // /**
    //  * doRegister 
    //  * 
    //  * do the register
    //  * @params $form, email, password
    //  */
    // function doRegister($form, email, password){
    //     beerfest_data.createUser({
    //         email    : email,
    //         password : password
    //     }, function(error, userData) {
    //         $form.removeClass('loading');
    //         if (error) {
    //             console.log("Error creating user:", error);
    //             $form.find('.error').remove();
    //             $('h2', $form).after('<div class="error">' + error.message + '</div>');
    //             $('input[name="user_password"]', $form).val('');
    //         } else {
    //             console.log("Successfully created user account with uid:", userData.uid);
                
    //             $form.removeClass('is-register-form').trigger('submit');

    //         }
    //     });
    // }



    // /**
    //  * showWelcome 
    //  * 
    //  * display the welcome message and display the user's email so they know they're logged in
    //  * @param email (string) the user's email
    //  */
    // function showWelcome(email){
    //     $('#user-info').text('Welcome, ' + email);
    //     $('.user-email').text(email);
    // }


    // /**
    //  * promptUserRegister 
    //  * 
    //  * show the registration form
    //  * @param event
    //  */
    // function promptUserRegister(event){
    //     event.preventDefault();

    //     var $form      = $('#login-form').toggleClass('is-register-form'),
    //         formText   = $form.hasClass('is-register-form') ? 'Register' : 'Log In',
    //         buttonText = $form.hasClass('is-register-form') ? 'Log In' : 'Register';

    //     $('.user-register').text(buttonText);

    //     $form.css({
    //         'transform': 'translateX(120%)'
    //     });

    //     setTimeout(function(){
    //         $('h2, button', $form).text(formText);
    //         $form.css({
    //             'transform': 'translateX(0)'
    //         });
    //     }, 400);
    // }



    // // =========================

    // /**
    //  * BEERFEST.clearData 
    //  * 
    //  * clear all markings and remove all the cookies
    //  * @param event: object from the click
    //  */
    // BEERFEST.clearData = function(event){
    //     if(event)
    //         event.preventDefault();

    //     // localStorage.clear();
    //     $('#beerlist .beer').removeClass('rate-it wishlist');  
    // }


    // /**
    //  * BEERFEST.logout 
    //  * 
    //  * log out of the app
    //  */
    // BEERFEST.logout = function(event){
    //     if(event){
    //         event.preventDefault();
    //         engageOverlayLogin(event);
    //     }

    //     beerfest_data.unauth();
        
    //     uid = null;

    //     $('body').removeClass('menu-open');

    //     $('.loader').removeClass('hidden');
    //     $('.user-email').text('');

    //     BEERFEST.getBeerList();

    //     setTimeout(function(){
    //         $('body').addClass('anonymous').removeClass('logged-in');
    //         $('#user-info').html('Not logged in<br><small>You can still save data on your device.</small>');
    //         promptSpecialUser();
    //     }, 400);
    // }


    // BEERFEST.init = function(festName){

    //     var isSpecialUser = getUrlParam('sp-user');

    //     if(isSpecialUser){
    //         promptSpecialUser();
    //     }

    //     $(document).on('click', clearAllClicks);

        

    //     // -------------------------------
    //     // navigation
    //     //
    //     $('.app-banner .util-nav ul li').on('click', beerfestNav);
    //     $('.menu-trigger').on('click', engageOverlayLogin);

    //     // $('#clearall').on('click', BEERFEST.clearData);
    //     $('#firebase-logout a').on('click', BEERFEST.logout);

    //     $('#scrollit').on('click', 'li', scrollToLetter);


    //     // -------------------------------
    //     // beerlist stuff
    //     //
    //     $('#beerlist').on('click', '.brewery-header', openBeerlist);
        
    //     $('#beerlist').on('click', '.beer-util .wishlist', toggleWishlist);
    //     $('#beerlist').on('click', '.beer-util .rate', toggleRateBeer);

    //     $('#beerlist').on('click', '.beer-rating span', rateBeer);


    //     // -------------------------------
    //     // search
    //     //

    //     $('.search-nav li').on('click', changeSearchParams);

    //     $('#input-search').on('keyup', searchForBeer);

    //     $('.clear-input').on('click', clearSearchInput);


    //     // -------------------------------
    //     // authentication
    //     //

    //     $('#login-form').on('submit', submitLoginOrRegister);

    //     $('.authentication').on('click', '.user-register', promptUserRegister);

    //     // -------------------------------
    //     // more
    //     //
    //     $('#more-content .more-element .option').on('click', openMoreContent);

        
    //     // add new beer
    //     $('#input-choose-brewery').on('keyup', getBreweries);
    //     $('#input-choose-brewery').on('focus', focusAddNewBeer);
    //     $('.choose-brewery').on('click', '.choose-list li', chooseBrewery);
    //     $('.add-new-beer').on('submit', addNewBeer);
    //     $('.change-brewery').on('click', changeBrewery);
    //     $('.add-new-beer').on('click', '.rate-new-beer', rateNewBeer);

    //     // random
    //     $('#spin-the-wheel').on('click', getRandomBeer);
    // }



    // BEERFEST.getBeers = function(){
    //     console.log(FIREBASE_DATA);
    // }





    // /**
    //  * BEERFEST.getBeerList
    //  *
    //  * go out to Firebase and grab the beer list for this year, and
    //  *  then render the list on the app
    //  */
    // BEERFEST.getBeerList = function(){
    //     $('#beerlist .beer-list, #scrollit').empty();
    //     beerfest_data.child('beerfests/' + BEERFEST.name + '/beerlist').once("value", renderBeers);
    // };


    // $(document).ready(function(){

    //     var loginData = beerfest_data.getAuth(),
    //         windowH   = $(window).height();

    //     headerHeight = $('#banner').outerHeight();

    

    //     if(loginData){
    //         $('body').addClass('logged-in');
            
    //         uid = loginData.uid;
    //         USER_EMAIL = loginData.password.email;

    //         showWelcome(loginData.password.email);

    //         console.log("logged in");
    //         console.log("current user = " + uid);
    //     } else {
    //         $('body').addClass('anonymous');
    //     }

    //     // initialize the drinking! 
    //     BEERFEST.init();

    //     BEERFEST.getBeerList();

    //     betterHeader();

    //     $('#login-overlay').css({
    //         'top' : '-' + windowH + 'px'
    //     });
    // });



})(window.BEERFEST = window.BEERFEST || {}, jQuery);


(function(BEERFEST, $, undefined){


    BEERFEST.encode = function(string){
        return encodeURIComponent(string).replace(/\./g, '%2E');
    };

    BEERFEST.decode = function(string){
        return decodeURIComponent(string.replace('%2E', '.'));
    };

})(window.BEERFEST = window.BEERFEST || {}, jQuery);