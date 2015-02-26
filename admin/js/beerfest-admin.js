
(function(BEERFEST_ADMIN, $, undefined){

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
                url: "http://www.beeradvocate.com/ebf/beer/"
            }, 
            success   : function(data) {
                $('#baContent table tr', data).each(function(index, $tr){

                    if($('h6', $tr).length > 0){
                        // brewery = encodeURIComponent( $('h6', $tr).text().replace('Co.', 'Company') );
                        brewery = BEERFEST.encodeValue( $('h6', $tr).text() );
                        BEERFEST_ADMIN.beerObj[brewery] = {
                            "beers":[]
                        };
                    } else {
                        var beerUrl = $('a', $tr).filter(function(){
                            return this.href.indexOf('/beer/profile/') > -1;
                        }).attr('href');

                        if(beerUrl){
                            var beerName  = $('td', $tr).eq(0).text(),
                                beerStyle = $('td', $tr).eq(1).text(),
                                beerAbv   = $('td', $tr).eq(2).text();

                            getBeerInfo({
                                "name" : beerName,
                                "style": beerStyle,
                                "abv"  : beerAbv
                            }, beerUrl, brewery).done(function(){
                                console.log("done");
                            });
                        }
                    }
                });
            }
        }).done(function(){
            console.log("ajax is done");
        });
    }


    $(document).ready(function(){
        // BEERFEST_ADMIN.getBeers();

    });

})(window.BEERFEST_ADMIN = window.BEERFEST_ADMIN || {}, jQuery);
