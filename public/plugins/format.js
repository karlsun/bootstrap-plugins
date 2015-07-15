(function($){

    if(!$.dlFormat){
        $.dlFormat = function(){
            var args = arguments,
                source = args[0];
            return source.replace(/\{(\d+)\}/g, function (m, i) {
                return args[parseInt(i)+1];
            });
        }
    }

})(jQuery);
