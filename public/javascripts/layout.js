(function($){
    var menus = [
        {
            text:"Grid",
            icon:"fa fa-table fa-lg",
            children:[
                {
                    text:"Default",
                    url:"/plugin/grid",
                    icon:"fa fa-table"
                }
            ]
        },
        {
            text:"Modal",
            icon:"fa fa-square-o fa-lg",
            url:"/plugin/modal"
        },
        {
            text:"Board",
            icon:"fa fa-gears fa-lg",
            url:"/plugin/board"
        },
        {
            text:"SelectorPlugins",
            icon:"fa fa-user fa-lg",
            children:[
                {
                    text:"Selector",
                    icon:"fa fa-user fa-lg",
                    url:"/plugin/selector"
                },
                {
                    text:"RichDropDown",
                    icon:"fa fa-search fa-lg",
                    url:"/plugin/richDropDown"
                },
                {
                    text:"RightFromLeft",
                    icon:"fa fa-columns fa-lg",
                    url:"/plugin/rightfromleft"
                }
            ]
        },
        {
            text:"TimeLine",
            icon:"fa fa-arrows-h fa-lg",
            url:"/plugin/timeline"
        },
        {
            text:"ContextMenu",
            icon:"fa fa-columns fa-lg",
            url:"/plugin/contextmenu"
        },
        {
            text:"Form",
            icon:"fa fa-check-square-o fa-lg",
            url:"/plugin/form"
        },
        {
            text:"ProgressBar",
            icon:"fa fa-rocket fa-lg",
            url:"/plugin/progressBar"
        }
    ];

    $("nav").bsNav({
        fixed:false,
        logoMenu:{
            text:"Home",
            icon:"fa fa-twitter fa-lg",
            url:"/"
        },
        menus : menus,
        rightMenus : [menus[0]],
        onClick:function(menu){
            if(menu.url){
                location.href = menu.url;
            }
        }
    });
})(jQuery);