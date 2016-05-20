

(function(BEERFEST_ADMIN, $, undefined){

    var BA_EVENT_URL = 'http://www.beeradvocate.com/micro/beer/';

    BEERFEST_ADMIN.beerObj = {};

    BEERFEST_ADMIN.getBeers = function(){

        var brewery;

        function getBeerInfo(beerData, url, brewery){
            return $.get('ajax/proxy.php', {url: 'http://www.beeradvocate.com' + url}, function(data) {
                var ba_score = $('.BAscore_big.ba-score', data).text();

                beerData.ba_score = ba_score;

                BEERFEST_ADMIN.beerObj[brewery]["beers"].push(beerData);
            });
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

                $('#ba-content table tr', data).each(function(index, $tr){

                    if($('h6', $tr).length > 0){
                        brewery = BEERFEST.encode( $('h6', $tr).text() );
                        BEERFEST_ADMIN.beerObj[brewery] = {
                            "beers":[]
                        };
                    } else {
                        var beerName  = $('td', $tr).eq(0).text(),
                            beerStyle = $('td', $tr).eq(1).text(),
                            beerAbv   = $('td', $tr).eq(2).text(),
                            beerScore = $('td', $tr).eq(3).text();

                        if( BEERFEST_ADMIN.beerObj[brewery]){
                            BEERFEST_ADMIN.beerObj[brewery]["beers"].push({
                                "name"     : beerName,
                                "style"    : beerStyle,
                                "abv"      : beerAbv,
                                "ba_score" : beerScore
                            });    
                        }
                    }
                });

                console.log(BEERFEST_ADMIN.beerObj);
            },
            error   : function( jqXHR, textStatus, error ){
                console.error("The page was not loaded");
                console.log(error);
            }
        }).done(function(){
            console.log("ajax is done");
        });
    }


    $(document).ready(function(){
        // BEERFEST_ADMIN.getBeers();

    });

})(window.BEERFEST_ADMIN = window.BEERFEST_ADMIN || {}, jQuery);
