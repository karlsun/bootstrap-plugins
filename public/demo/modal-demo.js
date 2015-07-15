(function($){
    $("#btnDefault").click(function(){
        $("<div>默认</div>").bsModal({
            onHide:function(){
                $(this).bsModal("destroy");
            }
        });
    });

    $("#btnCustomButtons").click(function(){
        $("<div>自定义按钮</div>").bsModal({
            onHide:function(){
                $(this).bsModal("destroy");
            },
            buttons:[
                {
                    text:"关闭",
                    onClick:function(){
                        $(this).bsModal("hide");
                    }
                },
                {
                    text:"确认",
                    status : [
                        {
                            state : "loading",
                            text : "loading..."
                        }
                    ],
                    className:"btn-primary",
                    onClick:function(e, $button){
                        $button.button("loading");
                        setTimeout(function(){
                            $button.button("reset");
                        }, 2000);
                    }
                }
            ]
        });
    });
})(jQuery);