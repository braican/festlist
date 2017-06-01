

(function(BEERFEST_ADMIN, $, undefined){

    var BA_EVENT_URL = 'https://www.beeradvocate.com/micro/beer/';

    BEERFEST_ADMIN.beerObj = {};

    BEERFEST_ADMIN.getBeers = function(){

        var _BREWERY;

        function getBeerScore( url ){

            var p = new Promise( function( resolve, reject ){

                $.get('ajax/proxy.php', {url: 'https://www.beeradvocate.com' + url}, function(data) {
                    var ba_score = $('.ba-ravg', data).text();
                    resolve( ba_score );
                });

            });

            return p;
        }

        $.ajax({
            'type'    : 'GET',
            'dataType': 'html',
            'url'     : 'ajax/proxy.php',
            'data'    : {
                url: BA_EVENT_URL
            }, 
            success   : function(data) {

                console.log("The page was loaded");

                $('#ba-content > span > div > div', data).each(function(){

                    var $div   = $(this),
                        tClass = $div.attr('class');

                    if( tClass === 'brewer' ){

                        _BREWERY = BEERFEST.encode( $('a', $div).text() );

                        BEERFEST_ADMIN.beerObj[ _BREWERY ] = {
                            "beers": []
                        }


                    } else {
                        var beerName  = $('.col-1', $div).text(),
                            beerStyle = $('.col-2', $div).text(),
                            beerAbv   = $('.col-3', $div).text(),

                            beerLink  = $('.col-1 a', $div).attr('href');

                        addBeerToBrewery( _BREWERY, beerLink, {
                            name     : beerName,
                            style    : beerStyle,
                            abv      : beerAbv,
                        } );
                    }

                });
            },
            error   : function( jqXHR, textStatus, error ){
                console.error("The page was not loaded");
                console.log(error);
            }
        }).done(function(){
            console.log("ajax is done");
        });



        /**
         * Adds the beer to the brewery object
         *
         * @param string brewery  The brewery
         * @param string beerLink URL to the BA page for this beer
         * @param object beerData Data on the beer
         */
        function addBeerToBrewery( brewery, beerLink, beerData ){

            getBeerScore( beerLink ).then(function( score ){
                beerData.ba_score = score;

                BEERFEST_ADMIN.beerObj[brewery].beers.push( beerData );

                console.log( "added " + brewery + ' ' + beerData.name );
            });
        }
    }


    $(document).ready(function(){
        // BEERFEST_ADMIN.getBeers();

    });

})(window.BEERFEST_ADMIN = window.BEERFEST_ADMIN || {}, jQuery);
