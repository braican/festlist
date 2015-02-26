
(function(BEERFEST, $, undefined){


    BEERFEST.encodeValue = function(string){
        return encodeURIComponent(string).replace(/\./g, '%2E');
    };

    BEERFEST.decodeValue = function(string){
        return decodeURIComponent(string.replace('%2E', '.'));
    };

})(window.BEERFEST = window.BEERFEST || {}, jQuery);