
//
// BEERFEST - namespace
//
(function(BEERFEST, $){

    BEERFEST.name = "ebf-2015";


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

        var navArray = [],
            currentLetter;

        $.each(data, function(brewery, breweryData){
            var markup      = '<li data-brewery="' + brewery + '"><span class="breweryname">' + brewery + '</span><ul class="beers">',
                firstLetter = brewery.charAt(0).match(/[a-z]/i) ? brewery.charAt(0) : "#";

            if(firstLetter !== currentLetter && navArray.indexOf(firstLetter) === -1 ){
                navArray.push(firstLetter);
            }

            $.each(breweryData.beers, function(index, beerObj){
                var beer          = beerObj.name,
                    rating        = localStorage.getItem(beer),
                    isChecked     = rating ? ' checked' : '',
                    displayRating = rating ? rating : '+';

                markup += '<li class="flex-item' + isChecked + '" data-beer="' + beer + '">' +
                            '<div class="beer-util">' +
                                '<div class="beer-had"><input type="checkbox"' + isChecked + '><label>' + displayRating + '</label></div>' +
                            '</div>' +
                            '<div class="beer-info flex-item">' +
                                '<div class="beer-name">' + beer + '</div>' +
                                '<div class="beer-extra flex-item">' +
                                    '<div class="beer-style">' + beerObj.style + '</div>' +
                                    '<div class="beer-abv"><em>ABV:</em> ' + beerObj.abv + '</div>' +
                                    '<div class="beer-score"><em>BA Score:</em> ' + beerObj.ba_score + '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="beer-rating">' + getRatingDropdownMarkup(rating) + '</div>' +
                          '</li>'
            });
            markup += '</ul></li>';
            $('#beerlist').append(markup);
        });

        $.each(navArray, function(index, character){
            $('#scrollit').append('<li data-char="' + character + '">' + character + '</li>');
        });
    }


    /**
     * getRatingDropdownMarkup 
     * 
     * util function that returns the markup for the ratings dropdown
     * @param rating: if a rating has already been chosen, select that one
     */
    function getRatingDropdownMarkup(rating){
        var possibleRatings = [1, 2, 3, 4, 5],
            starSvg         = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 190 181" enable-background="new 0 0 190 181" xml:space="preserve"><g><path fill="#FFFFFF" d="M90.6,11.1c2.4-4.9,6.4-4.9,8.9,0L119,50.8c2.4,4.9,8.9,9.6,14.3,10.4l43.8,6.4c5.4,0.8,6.7,4.6,2.7,8.4l-31.7,30.9c-3.9,3.8-6.4,11.4-5.5,16.8l7.5,43.6c0.9,5.4-2.3,7.8-7.2,5.2l-39.2-20.6c-4.9-2.6-12.8-2.6-17.7,0L47,172.5c-4.9,2.6-8.1,0.2-7.2-5.2l7.5-43.6c0.9-5.4-1.5-13-5.5-16.8L10.2,76c-3.9-3.8-2.7-7.6,2.7-8.4l43.8-6.4c5.4-0.8,11.9-5.5,14.3-10.4L90.6,11.1z"/></g></svg>';
            markup          = '<span data-value="-1"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60" enable-background="new 0 0 60 60" xml:space="preserve"><g><path fill="#999999" d="M30,5c13.8,0,25,11.2,25,25S43.8,55,30,55S5,43.8,5,30S16.2,5,30,5 M30,0C13.4,0,0,13.4,0,30s13.4,30,30,30s30-13.4,30-30S46.6,0,30,0L30,0z"/></g><line fill="none" stroke="#999999" stroke-width="5" stroke-miterlimit="10" x1="9.5" y1="9.5" x2="51" y2="51"/></svg></span>';

        $.each(possibleRatings, function(i, r){
            var isSelected = rating >= r ? ' selected' : '';
            markup += '<span class="star' + isSelected + '" data-value="' + r + '">' + starSvg + '</span>';
        });

        return markup;
    }



    /* --------------------------------------------
     * --UX
     * -------------------------------------------- */

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
        }, 300);

        if(letter == "#"){
            $('body, html, #app-main').animate({
                'scrollTop': 0
            });
        } else {
            $('#beerlist > li').each(function(i, e){
                var breweryname = $(e).data('brewery').toLowerCase();
                if(letter == breweryname.charAt(0).toLowerCase()){
                    $('body, html, #app-main').animate({
                        'scrollTop': $(e).offset().top
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
     * triggerBeerCheck 
     * 
     * upon clicking anywhere on the beer name checks it off
     * @param event: the object from the click
     */
    function triggerBeerCheck(event){
        event.preventDefault();

        $(this).closest('li').addClass('rate-it');
    }


    /**
     * rateBeer 
     * 
     * click on one of the ratings
     * @param event: the object from the click
     */
    function rateBeer(event){
        event.preventDefault();

        var $t       = $(this),
            $parent  = $t.closest('li'),
            rating   = $t.data('value'),
            beername = $parent.data('beer');

        if(rating === -1){
            $('.beer-had label', $parent).text('+');
            $parent.removeClass('checked');
            localStorage.removeItem(beername);
        } else {
            $('.beer-had label', $parent).text(rating);
            $t.addClass('selected').siblings('.star').removeClass('selected').filter(function(){
                return $(this).index() < $t.index();
            }).addClass('selected');

            $parent.addClass('checked');
            localStorage.setItem(beername, rating);
        }

        setTimeout(function(){
            $parent.removeClass('rate-it');
        }, 100);
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

        localStorage.clear();
        $('input[type="checkbox"]').removeProp('checked');
        $('#beerlist li li').removeClass('checked');  
    }


    BEERFEST.init = function(festName){

        //
        // get the beers
        //
        $.getJSON('data/' + festName + '.json')
            .done(renderBeers)
            .fail(ajaxError);


        $('#beerlist').on('click', '.beers > li', triggerBeerCheck);
        $('#beerlist').on('click', '.beer-rating span', rateBeer);

        $('.menu-trigger').on('click', engageMobileMenu);

        $('#clearall').on('click', BEERFEST.clearData);

        $('#scrollit').on('click', 'li', scrollToLetter);
    }

    $(document).ready(function(){
        // initialize the drinking! 
        BEERFEST.init(BEERFEST.name);
    });

})(window.BEERFEST = window.BEERFEST || {}, jQuery, undefined);

