(function($){

    $("#container").bsBoard({
        maxColumn:1,
        onAppend:function($panel){

        }
    });

    $("#container").bsBoard("add",{
        title:"示例",
        className:"panel-primary",
        content:"<div class='well'>controls:'collapse,remove'</div>只有面板缩放和移除面板控制",
        controls:"nothing",
        size:1
    });

    $("#container").bsBoard("add",{
        title:"示例",
        content:"<div class='well'>controls:'default' 或 controls:undefined</div>默认全部面板控制",
        controls:"default",
        size:1,
        menus:[
            {
                icon:"fa-trophy",
                label:"一个有很长Label的menu",
                onClick:function($menu, $panel){
                    $.bsMessage({content:"是把描述丢Label上了么，o(︶︿︶)o 唉"});
                }
            },
            {
                label:"新建",
                onClick:function($menu, $panel){
                    $.bsMessage({content:"正常点的被点击了"});
                }
            }
        ]
    });

})(jQuery);
