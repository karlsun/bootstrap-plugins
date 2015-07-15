;(function($){

    var defaultOptions = {
        content : "",
        className : "alert-info"
    },
        BSMESSAGE_ID = "bsMessage-container",
        bsMessage = {
            timers:[],
            getContainer:function(){
                var $container = $("#" + BSMESSAGE_ID);
                if($container.size() == 0){
                    $container = $($.dlFormat("<div id='{0}' class='bsMessage'></div>", BSMESSAGE_ID));
                    $(document.body).append($container);
                    $container.css({
                        position:"absolute",
                        top:6,
                        right:6
                    });
                }
                return $container;
            },
            appendMsg:function(opts){
                var $alert = $("<div class='alert "+ opts.className +" fade in clearfix' style='z-index:2000;'><div class='content' style='min-width:150px;float:right;margin-right:6px;'>"+ opts.content + "</div></div>"),
                    $close = $("<button type='button' class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</button>"),
                    timer;
                bsMessage.getContainer().append($alert);
                $close.insertBefore($alert.find(".content"));
                $alert.alert();
                function setTimer(){
                    timer = setTimeout(function(){
                        try{
                            $alert.fadeOut(800,function(){
                                $(this).remove();
                            });
                        }catch(e){

                        }
                    },3000);
                }

                $close.on("click",function(){
                    window.clearTimeout(timer);
                });
                $alert.hover(
                    function(){
                        window.clearTimeout(timer);
                    },
                    function(){
                        setTimer();
                    }
                );
                setTimer();
            },
            clear:function(){
                bsMessage.getContainer().empty();
            }
        };

    $.bsMessage = function(options){
        if(typeof options == "string"){
            switch (options){
                case "clear":
                    bsMessage.clear();
                    break;
            }
        }else{
            var opts = $.extend({},defaultOptions,options);
            bsMessage.appendMsg(opts);
        }
    }

})(jQuery);