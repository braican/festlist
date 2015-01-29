
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

        $.each(data, function(brewery, breweryData){
            var markup = '<li data-brewery="' + brewery + '"><span class="breweryname">' + brewery + '</span><ul class="beers">';

            $.each(breweryData.beers, function(index, beerObj){
                var beer         = beerObj.name,
                    rating       = $.cookie(beer),
                    input        = rating ? '<input type="checkbox" checked>' : '<input type="checkbox">',
                    checkedClass = rating ? ' class="checked"' : '';

                markup += '<li data-beer="' + beer + '"' + checkedClass + '>' +
                            '<div class="beer-util">' +
                                '<div class="beer-had">' + input + '</div>' +
                                '<div class="beer-rating">' + getRatingDropdownMarkup(rating) + '</div>' +
                            '</div>' +
                            '<div class="beer-info">' +
                                '<div class="beer-name">' + beer + '</div>' +
                                '<div class="beer-extra">' +
                                    '<div class="beer-style">' + beerObj.style + '</div>' +
                                    '<div class="beer-abv">ABV: ' + beerObj.abv + '</div>' +
                                    '<div class="beer-score">BA Score: ' + beerObj.ba_score + '</div>' +
                                '</div>' +
                            '</div>' +
                          '</li>'
            });
            markup += '</ul></li>';
            $('#beerlist').append(markup);
        }); 
    }


    /**
     * getRatingDropdownMarkup 
     * 
     * util function that returns the markup for the ratings dropdown
     * @param rating: if a rating has already been chosen, select that one
     */
    function getRatingDropdownMarkup(rating){
        var possibleRatings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, .5],
            markup = '<select>';

        $.each(possibleRatings, function(i, r){
            var isSelected = rating == r ? ' selected' : '';
            markup += '<option value="' + r + '"' + isSelected + '>' + r + '</option>';
        });

        markup += '</select>';

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
        var letter = $(this).attr('id');

        $('#beerlist > li').each(function(i, e){
            var breweryname = $(e).data('brewery');
            if(letter == breweryname.charAt(0).toLowerCase()){
                $('body, html').animate({
                    'scrollTop': $(e).offset().top
                });
                return false;
            }
        });
    }


    /**
     * deleteAllCookies 
     * 
     * remove all the cookies
     */
    function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos  = cookie.indexOf("=");
            var name   = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    /**
     * clearAllData 
     * 
     * clear all markings and remove all the cookies
     * @param event: object from the click
     */
    function clearAllData(event){
        event.preventDefault();
        deleteAllCookies();
        $('input[type="checkbox"]').removeProp('checked');
        $('li li').removeClass('checked');      
    }



    /* --------------------------------------------
     * --beer interactions
     * -------------------------------------------- */

    /**
     * saveBeerRating 
     * 
     * save the selected rating to a cookie
     * @param event: the object from the change event
     */
    function saveBeerRating(event){
        event.preventDefault();
        var beername = $(this).parents('li').data('beer'),
            rating   = $(this).val();
        
        if($.cookie(beername)){
            $.cookie(beername, rating);
        }
    }


    /**
     * checkOffBeer 
     * 
     * check or uncheck a beer
     * @param event: obj from the click
     */
    function checkOffBeer(event){
        event.preventDefault();
        var $t       = $(this),
            $parent  = $t.closest('li'),
            beername = $parent.data('beer'),
            rating   = $parent.find('select').val();

        if($t.prop('checked')){
            $.cookie(beername, rating);
        } else {
            $.removeCookie(beername);
        }
        $parent.toggleClass('checked');
    }


    /**
     * triggerBeerCheck 
     * 
     * upon clicking anywhere on the beer name checks it off
     * @param event: the object from the click
     */
    function triggerBeerCheck(event){
        event.preventDefault();
        $(this).closest('li').find('input[type="checkbox"]').prop("checked", function(i, val){
            return !val;
        }).trigger('change');                
    }


    // =========================

    BEERFEST.init = function(festName){
        //
        // set up cookies to expire after a year
        //
        $.cookie.defaults = {
            expires: 365
        }

        //
        // get the beers
        //
        $.getJSON('data/' + festName + '.json')
            .done(renderBeers)
            .fail(ajaxError);


        $('#beerlist').on('click', '.beer-name', triggerBeerCheck);
        $('#beerlist').on('change', 'input[type="checkbox"]', checkOffBeer);
        $('#beerlist').on('change', 'select', saveBeerRating);

        $('#clearall').on('click', clearAllData);

        $('#scrollit li').on('click', scrollToLetter);
    }

    $(document).ready(function(){
        // initialize the drinking! 
        BEERFEST.init(BEERFEST.name);
    });

})(window.BEERFEST = window.BEERFEST || {}, jQuery, undefined);

