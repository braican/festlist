
//
// BEERFEST - namespace
//
(function(BEERFEST, $, undefined$){

    BEERFEST.name = "ebf-2015";

    // svg stuff
    var svgColor  = '#cccccc',
        starSvg   = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="28" viewBox="0 0 26 28"><path d="M26 10.109q0 0.344-0.406 0.75l-5.672 5.531 1.344 7.812q0.016 0.109 0.016 0.313 0 0.328-0.164 0.555t-0.477 0.227q-0.297 0-0.625-0.187l-7.016-3.687-7.016 3.687q-0.344 0.187-0.625 0.187-0.328 0-0.492-0.227t-0.164-0.555q0-0.094 0.031-0.313l1.344-7.812-5.688-5.531q-0.391-0.422-0.391-0.75 0-0.578 0.875-0.719l7.844-1.141 3.516-7.109q0.297-0.641 0.766-0.641t0.766 0.641l3.516 7.109 7.844 1.141q0.875 0.141 0.875 0.719z" fill="' + svgColor + '"></path></svg>',
        checkSvg  = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 28 28"><path d="M26.109 8.844q0 0.625-0.438 1.062l-13.438 13.438q-0.438 0.438-1.062 0.438t-1.062-0.438l-7.781-7.781q-0.438-0.438-0.438-1.062t0.438-1.062l2.125-2.125q0.438-0.438 1.062-0.438t1.062 0.438l4.594 4.609 10.25-10.266q0.438-0.438 1.062-0.438t1.062 0.438l2.125 2.125q0.438 0.437 0.438 1.062z" fill="' + svgColor + '"></path></svg>',
        removeSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 28 28"><path d="M17.953 17.531q0-0.406-0.297-0.703l-2.828-2.828 2.828-2.828q0.297-0.297 0.297-0.703 0-0.422-0.297-0.719l-1.406-1.406q-0.297-0.297-0.719-0.297-0.406 0-0.703 0.297l-2.828 2.828-2.828-2.828q-0.297-0.297-0.703-0.297-0.422 0-0.719 0.297l-1.406 1.406q-0.297 0.297-0.297 0.719 0 0.406 0.297 0.703l2.828 2.828-2.828 2.828q-0.297 0.297-0.297 0.703 0 0.422 0.297 0.719l1.406 1.406q0.297 0.297 0.719 0.297 0.406 0 0.703-0.297l2.828-2.828 2.828 2.828q0.297 0.297 0.703 0.297 0.422 0 0.719-0.297l1.406-1.406q0.297-0.297 0.297-0.719zM24 14q0 3.266-1.609 6.023t-4.367 4.367-6.023 1.609-6.023-1.609-4.367-4.367-1.609-6.023 1.609-6.023 4.367-4.367 6.023-1.609 6.023 1.609 4.367 4.367 1.609 6.023z" fill="' + svgColor + '"></path></svg>';

    // firebase data
    var beerfest_data = new Firebase("https://braican-beerfest.firebaseio.com/"),
        uid,
        headerHeight;




    /* --------------------------------------------
     * --util
     * -------------------------------------------- */
    
    /**
     * ajaxError
     *
     * console some stuff if we error out
     */
    function ajaxError( jqxhr, textStatus, error ) {
        console.log( "Request Failed: " + error );
        console.log(textStatus);
    }


    /**
     * beerfest_user_data 
     * 
     * get the user data from firebase
     */
    function beerfest_user_data(){
        if(uid){
            return beerfest_data.child('users/' + uid + '/fests/' + BEERFEST.name);
        } else {
            return false;
        }
        
    }

    /**
     * getUrlParam
     *
     * Utility function to snag a query string value when passed the parameter
     */
    function getUrlParam(name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) {
            return 0;
        }
        return results[1] || 0;
    }
    



    /* --------------------------------------------
     * --rendering
     * -------------------------------------------- */

    /**
     * renderBeers
     *
     * render the markup for the list of beers
     * @param data: the data to render
     */
    function renderBeers(data){
        var beerdata    = data.val(),
            navArray    = [],
            getUserData = beerfest_user_data(),
            userData,
            currentLetter;

        $('.loader').removeClass('hidden');

        if(getUserData){
            getUserData.once('value', function(snapshot){
                userData = snapshot.val();
                addTheBeers();
            });
        } else {
            addTheBeers();
        }


        function addTheBeers(){
            
            $.each(beerdata, function(brewery, breweryData){

                var markup      = '<li class="brewery" data-brewery="' + brewery + '"><div class="brewery-header"><span class="breweryname">' + decodeURIComponent(brewery) + '</span><span class="expand">+</span><span class="collapse">-</span></div><ul class="beers">',
                    firstLetter = brewery.charAt(0).match(/[a-z]/i) ? brewery.charAt(0) : "#";

                if(firstLetter !== currentLetter && navArray.indexOf(firstLetter) === -1 ){
                    navArray.push(firstLetter);
                }

                $.each(breweryData.beers, function(index, beerObj){
                    var beer        = beerObj.name,
                        encodedBeer = BEERFEST.encodeValue(beer),
                        beerUnique  = brewery + '_' + encodedBeer,
                        rating      = getBeerRating(userData, beerUnique),
                        isWishlist  = getIsWishList(userData, beerUnique) ? ' wishlist' : '',
                        isRated     = rating ? ' rate-it' : '';

                    markup += '<li class="beer' + isRated + isWishlist + '" data-beer="' + encodedBeer + '"><div class="beerwrapper">' +
                                '<div class="beer-util"><ul>' +
                                    '<li class="rate">' + checkSvg + '</li>' +
                                    '<li class="wishlist">' + starSvg + '</li>' +
                                '</ul></div>' +
                                '<div class="beer-rating">' + getRatingDropdownMarkup(rating) + '</div>' +
                                '<div class="beer-info flex-item">' +
                                    '<div class="beer-name">' + beer + '</div>' +
                                    '<div class="beer-extra flex-item">' +
                                        '<div class="beer-style">' + beerObj.style + '</div>' +
                                        '<div class="beer-abv"><em>ABV:</em><br> ' + beerObj.abv + '</div>' +
                                        '<div class="beer-score"><em>BA Score:</em><br> ' + beerObj.ba_score + '</div>' +
                                    '</div>' +
                                '</div>' +
                              '</div></li>'
                });
                markup += '</ul></li>';
                $('#beerlist .beer-list').append(markup);
            });

            $('.loader').addClass('hidden');

            $.each(navArray, function(index, character){
                $('#scrollit').append('<li data-char="' + character + '">' + character + '</li>');
            });
        }
    }


    /**
     * getIsWishList 
     * 
     * check to see if the given beer is on the wishlist
     * @param beer (string)
     */
    function getIsWishList(userData, beer){
        if(userData){
            return userData.wishlist && userData.wishlist[beer] > -1;
        } else {
            return localStorage.getItem(beer + '_wishlist');
        }
    }


    /**
     * getBeerRating 
     * 
     * get the beer rating
     * @param name paramter description
     */
    function getBeerRating(userData, beer){
        if(userData){
            return userData.hads ? userData.hads[beer] : false;
        } else {
            return localStorage.getItem(beer);
        }
    }


    /**
     * getRatingDropdownMarkup 
     * 
     * util function that returns the markup for the ratings dropdown
     * @param rating: if a rating has already been chosen, select that one
     */
    function getRatingDropdownMarkup(rating){
        var possibleRatings = [1, 2, 3, 4, 5],
            markup          = '<span data-value="-1">' + removeSvg + '</span>';

        $.each(possibleRatings, function(i, r){
            var isSelected = rating >= r ? ' selected' : '';
            markup += '<span class="star' + isSelected + '" data-value="' + r + '">' + starSvg + '</span>';
        });

        return markup;
    }


    /**
     * adjustAppLayout 
     * 
     * adjust the app layout based on the header size and stuff like that
     */
    function adjustAppLayout(){
        $('#side-banner').css('top', headerHeight + 'px');
        $('#app-main, #drawer').css('paddingTop', headerHeight + 'px');
    }



    /**
     * renderGlobal 
     * 
     * reset to the global list
     */
    function renderGlobal(){
        $('#beerlist .brewery').removeClass('inactive');
    }


    /**
     * renderHads 
     * 
     * render the user's hads
     */
    function renderHads(){
        $('#beerlist .brewery').each(function(i, brewery){
            var $brewery = $(brewery).removeClass('inactive'),
                numHads  = $brewery.find('.beer').filter(function(){
                    return $(this).hasClass('rate-it');
                }).length;

            if(numHads == 0){
                $brewery.addClass('inactive');
            }
        });
    }



    /**
     * renderWishlist 
     * 
     * render the user's wishlist
     */
    function renderWishlist(){
        $('#beerlist .brewery').each(function(i, brewery){
            var $brewery = $(brewery).removeClass('inactive'),
                numHads  = $brewery.find('.beer').filter(function(){
                    return ($(this).hasClass('wishlist') && !$(this).hasClass('rate-it') );
                }).length;

            if(numHads == 0){
                $brewery.addClass('inactive');
            }
        });
    }



    /**
     * renderMore 
     * 
     * render the more content
     */
    function renderMore(){
    
    }




    /* --------------------------------------------
     * --UX
     * -------------------------------------------- */


    /**
     * promptSpecialUser 
     * 
     * does some things for the user
     */
    function promptSpecialUser(){
        if(!uid){
            $('.not-special').after('<p class="special-user-register"><a href="#" class="user-register">Register</a></p>').remove();
        }
    }



    /**
     * beerfestNav 
     * 
     * navigation clicks router
     * @param event (click event)
     */
    function beerfestNav(event){
        var $t     = $(this),
            list   = $t.data('list'),
            title  = $t.data('title'),
            module = $t.data('module');

        $t.addClass('active').siblings('.active').removeClass('active');
        $('#' + module).addClass('active').siblings('.active').removeClass('active');

        $('#app-header h2').text(title);

        $('body').removeClass('hads wishlist global more').addClass(list);

        if(list == 'hads'){
            renderHads();
        } else if(list =='wishlist'){
            renderWishlist();
        } else if(list == 'global'){
            renderGlobal();
        } else if(list == 'more'){
            renderMore();
        }
    }



    /**
     * scrollToLetter
     *
     * scroll the page to the selected letter
     * @param event: the object from the click
     */
    function scrollToLetter(event){
        event.preventDefault();

        var $t     = $(this),
            letter = $t.addClass('selected').data('char').toLowerCase();

        setTimeout(function(){
            $t.removeClass('selected');
        }, 200);

        if(letter == "#"){
            $('body, html, #app-main').animate({
                'scrollTop': 0
            });
        } else {
            $('#beerlist ul > li').each(function(i, e){
                var breweryname = $(e).data('brewery').toLowerCase();
                if(letter == breweryname.charAt(0).toLowerCase()){
                    $('body, html, #app-main').animate({
                        'scrollTop': $(e).offset().top - headerHeight - 8
                    });
                    return false;
                }
            });    
        }
        
    }


    /**
     * engageMobileMenu 
     * 
     * do the mobile menu
     * @param event: the object from the click
     */
    function engageMobileMenu(event){
        event.preventDefault();
        $('body').toggleClass('menu-open');
    }





    /* --------------------------------------------
     * --beer interactions
     * -------------------------------------------- */

    /**
     * clearAllClicks 
     * 
     * clear all the click
     * @param event: the object from the click
     */
    function clearAllClicks(event){
    }   


    /**
     * openBeerlist 
     * 
     * toggles the opening/closing of a beer list
     */
    function openBeerlist(event){
        event.preventDefault();

        var $brewery = $(this).closest('.brewery').toggleClass('active');
            
        $brewery.siblings().removeClass('active');

        if($('.brewery.active').length == 0){
            $('#beerlist').removeClass('brewery-open');
        } else {
            $('#beerlist').addClass('brewery-open');
        }

        $('html,body').animate({
            scrollTop: $brewery.offset().top - headerHeight - 8
        });
    }

    

    /**
     * toggleWishlist 
     * 
     * add the current beer to the wishlist
     * @param event: the object from the click
     */
    function toggleWishlist(event){
        event.preventDefault();
        
        var $t         = $(this),
            brewery    = $t.closest('.brewery').data('brewery');
            beer       = $t.closest('.beer').toggleClass('wishlist').data('beer'),
            beerUnique = brewery + '_' + beer;

        if(uid){
            var wishlist = beerfest_user_data().child('wishlist/' + beerUnique);
            if($t.closest('.beer').hasClass('wishlist')){
                wishlist.set(true);
            } else {
                wishlist.remove();
            }
        } else {
            if(localStorage.getItem(beerUnique + '_wishlist')){
                localStorage.removeItem(beerUnique + '_wishlist');
            } else {
                localStorage.setItem(beerUnique + '_wishlist', true);
            }
        }
    }


    /**
     * toggleRateBeer 
     * 
     * toggle the visibility of the rating module
     * @param event: the object from the click
     */
    function toggleRateBeer(event){
        event.preventDefault();

        $(this).closest('.beer').toggleClass('rate-it');
    }



    /**
     * rateBeer 
     * 
     * click on one of the ratings
     * @param event: the object from the click
     */
    function rateBeer(event){
        event.preventDefault();
        event.stopPropagation();

        var $t         = $(this),
            $parent    = $t.closest('.beer'),
            brewery    = $t.closest('.brewery').data('brewery'),
            beer       = $parent.data('beer'),
            rating     = $t.data('value'),
            uniqueBeer = brewery + '_' + beer,
            hads       = uid ? beerfest_user_data().child('hads/' + uniqueBeer) : false;

        if(rating === -1){
            $t.siblings('.star').removeClass('selected');
            $parent.removeClass('rate-it');
            if(hads){
                hads.remove();
            } else {
                localStorage.removeItem(uniqueBeer);    
            }
            
        } else {
            $t.addClass('selected').siblings('.star').removeClass('selected').filter(function(){
                return $(this).index() < $t.index();
            }).addClass('selected');

            if(hads){
                hads.set(rating);
            } else {
                localStorage.setItem(uniqueBeer, rating); 
            }
        }
    }





    // -------------------------------
    // --LOGIN / REGISTER
    //

    /**
     * submitLoginOrRegister 
     * 
     * submit the form to prompt the login OR the register
     */
    function submitLoginOrRegister(event){
        event.preventDefault();

        var $t       = $(this),
            email    = $('input[name="user_email"]', this).val(),
            password = $('input[name="user_password"]', this).val();

        $t.addClass('loading');

        if($t.hasClass('is-register-form')){
            doRegister($t, email, password);
        } else {
            doLogin($t, email, password);
        }
    }


    /**
     * doLogin 
     * 
     * do the login
     * @params $form, email, password
     */
    function doLogin($form, email, password){
        beerfest_data.authWithPassword({
            email    : email,
            password : password
        }, function(error, authData) {
            $form.removeClass('loading');
            if (error) {
                console.log("Login Failed!", error);
                $form.find('.error').remove();
                $('h2', $form).after('<div class="error">' + error.message + '</div>');
                $('input[name="user_password"]', $form).val('');
            } else {
                console.log("Authenticated successfully with payload:", authData);
                
                uid = authData.uid;
                $('body').removeClass('anonymous menu-open').addClass('logged-in');
                $('.secondary-slide').removeClass('reveal-login');

                showWelcome(authData.password.email);
                
                BEERFEST.getBeerList();

                $('.util-nav li[data-list="global"]').trigger('click');

                $('input', $form).val('');
                $('h2, button', $form).text("Log In");
                $('.error', $form).remove();
            }
        });
    }


    /**
     * doRegister 
     * 
     * do the register
     * @params $form, email, password
     */
    function doRegister($form, email, password){
        beerfest_data.createUser({
            email    : email,
            password : password
        }, function(error, userData) {
            $form.removeClass('loading');
            if (error) {
                console.log("Error creating user:", error);
                $form.find('.error').remove();
                $('h2', $form).after('<div class="error">' + error.message + '</div>');
                $('input[name="user_password"]', $form).val('');
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                
                $form.removeClass('is-register-form').trigger('submit');

            }
        });
    }



    /**
     * showWelcome 
     * 
     * display the welcome message and display the user's email so they know they're logged in
     * @param email (string) the user's email
     */
    function showWelcome(email){
        $('#user-info').text('Welcome, ' + email);
        $('.user-email').text(email);
    }


    /**
     * promptUserRegister 
     * 
     * show the registration form
     * @param event
     */
    function promptUserRegister(event){
        event.preventDefault();

        var $form      = $('#login-form').toggleClass('is-register-form'),
            formText   = $form.hasClass('is-register-form') ? 'Register' : 'Log In',
            buttonText = $form.hasClass('is-register-form') ? 'Log In' : 'Register';

        $('.user-register').text(buttonText);

        $form.css({
            'transform': 'translateX(120%)'
        });

        setTimeout(function(){
            $('h2, button', $form).text(formText);
            $form.css({
                'transform': 'translateX(0)'
            });
        }, 400);
    }



    // =========================

    /**
     * BEERFEST.clearData 
     * 
     * clear all markings and remove all the cookies
     * @param event: object from the click
     */
    BEERFEST.clearData = function(event){
        if(event)
            event.preventDefault();

        // localStorage.clear();
        $('#beerlist .beer').removeClass('rate-it wishlist');  
    }


    /**
     * BEERFEST.logout 
     * 
     * log out of the app
     */
    BEERFEST.logout = function(event){
        if(event){
            event.preventDefault();
            engageMobileMenu(event);
        }

        beerfest_data.unauth();
        
        uid = null;
        $('body').addClass('anonymous').removeClass('logged-in menu-open');
        $('#user-info').html('Not logged in<br><small>You can still save data on your device.</small>');
        $('.user-email').text('');
        promptSpecialUser();
        BEERFEST.getBeerList();
    }


    BEERFEST.init = function(festName){

        var isSpecialUser = getUrlParam('sp-user');

        if(isSpecialUser){
            promptSpecialUser();
        }

        $(document).on('click', clearAllClicks);

        

        // -------------------------------
        // navigation
        //
        $('.app-banner .util-nav ul li').on('click', beerfestNav);
        $('.menu-trigger').on('click', engageMobileMenu);

        // $('#clearall').on('click', BEERFEST.clearData);
        $('#firebase-logout a').on('click', BEERFEST.logout);

        $('#scrollit').on('click', 'li', scrollToLetter);


        // -------------------------------
        // beerlist stuff
        //
        $('#beerlist').on('click', '.brewery-header', openBeerlist);
        
        $('#beerlist').on('click', '.beer-util .wishlist', toggleWishlist);
        $('#beerlist').on('click', '.beer-util .rate', toggleRateBeer);

        $('#beerlist').on('click', '.beer-rating span', rateBeer);


        // -------------------------------
        // authentication
        //

        $('#login-form').on('submit', submitLoginOrRegister);

        $('.authentication').on('click', '.user-register', promptUserRegister);
    }



    /**
     * BEERFEST.getBeerList
     *
     * go out to Firebase and grab the beer list for this year, and
     *  then render the list on the app
     */
    BEERFEST.getBeerList = function(){
        $('#beerlist ul, #scrollit').empty();
        beerfest_data.child('beerfests/' + BEERFEST.name + '/beerlist').once("value", renderBeers);
    };


    $(document).ready(function(){

        var loginData = beerfest_data.getAuth();

        headerHeight = $('#banner').outerHeight();

        adjustAppLayout();

        if(loginData){
            $('body').addClass('logged-in');
            
            uid = loginData.uid;

            showWelcome(loginData.password.email);

            console.log("logged in");
            console.log("current user = " + uid);
        } else {
            $('body').addClass('anonymous');
        }

        // initialize the drinking! 
        BEERFEST.init();

        BEERFEST.getBeerList();
    });

})(window.BEERFEST = window.BEERFEST || {}, jQuery);

