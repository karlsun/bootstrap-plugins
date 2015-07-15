(function ($) {
    'use strict';

    var identity = 0;

    $.widget("dl.bsNav", {
        options: {
            fixed:true,
            logoMenu:{},
            menus:[],
            rightMenus:[],
            className: "navbar-default",
            onClick: function (menu) {
            }
        },
        _create: function () {
            this._createNav();
            this.options.menusID = $.dlFormat("bsNav-menus-{0}",identity++);
            this._createFirstMenu(this.options.logoMenu);
            this._createMenusCollapse();
            this._createMenus(this.options.menus);
            if(this.options.rightMenus)this._createMenus(this.options.rightMenus,true);
        },
        _createNav: function () {
            this.element.addClass($.dlFormat(
                                        "navbar {0} {1}",
                                        this.options.className,
                                        this.options.fixed ? "navbar-fixed-top":""
                                    ));
            this.element.attr({role:"navigation"});
            this.options.container = this.element;
        },
        _createFirstMenu: function (menu) {
            var $header = $("<div class='navbar-header'>" +
                $.dlFormat("<button type='button' class='navbar-toggle' data-toggle='collapse' data-target='#{0}'>", this.options.menusID) +
                "<span class='sr-only'>Toggle navigation</span>" +
                "<span class='icon-bar'></span>" +
                "<span class='icon-bar'></span>" +
                "<span class='icon-bar'></span>" +
                "</button>" +
                $.dlFormat(
                        "<a class='navbar-brand' href='javascript:void(0);'>{0}{1}</a>",
                        menu.icon ? $.dlFormat("<i class='{0}'></i> ",menu.icon) : "",
                        menu.text
                ) +
                "</div>"),
                self = this;
            this.options.container.append($header);
            $("a.navbar-brand",$header).click(function(){
                self._onClick(menu);
            });
        },
        _createMenusCollapse:function(){
            var $collapse = $($.dlFormat("<div class='collapse navbar-collapse' id='{0}'></div>", this.options.menusID));
            this.options.container.append($collapse);
        },
        _createMenus: function (menus,isRight) {
            var $menus = $($.dlFormat("<ul class='nav navbar-nav {0}'></ul>",isRight ? "navbar-right" : "")),
                self = this;
            $(".navbar-collapse",this.options.container).append($menus);
            $.each(menus,function(index,menu){
                $menus.append(self._createMenu(menu,isRight));
            });
        },
        _createMenu: function (menu,isRight) {
            var $menu = $($.dlFormat(
                                "<li class='{0} {1}'><a href='javascript:void(0);' {2} {3}>{4}{5}{6}</a></li>",
                                menu.active ? "active" : "",
                                menu.children && menu.children.length > 0 ? "dropdown" : "",
                                menu.children && menu.children.length > 0 ? "class='dropdown-toggle' data-toggle='dropdown'" : "",
                                menu.id ? $.dlFormat("id='bsNav-{0}'", menu.id) : "",
                                menu.icon ? $.dlFormat("<i class='{0}'></i> ",menu.icon) : "",
                                menu.text,
                                menu.children && menu.children.length > 0 ? "<b class='caret'></b>" : ""
                            )
                        ),
                self = this;
            $menu.click(function () {
//                if(!isRight){
//                    $menu.parent().find(".active").removeClass("active");
//                    $menu.addClass("active");
//                }
                self._onClick(menu);
            });
            if(menu.children && menu.children.length > 0){
                $menu.append(this._createSubMenus(menu));
            }
            return $menu
        },
        _onClick: function (menu) {
            this.options.onClick(menu);
        },
        _createSubMenus:function(parentMenu){
            var $subMenus = $("<ul class='dropdown-menu'></ul>"),
                self = this;
            $.each(parentMenu.children,function(index,menu){
                $subMenus.append(self._createSubMenu(menu));
            });
            return $subMenus;
        },
        _createSubMenu: function (menu) {
            var $menu = $($.dlFormat(
                                    "<li><a href='javascript:void(0);' {0}>{1}{2}</a></li>",
                                    menu.id ? $.dlFormat("id='bsNav-{0}'", menu.id) : "",
                                    menu.icon ? $.dlFormat("<i class='{0}'></i> ",menu.icon) : "",
                                    menu.text
                                )
                        ),
                self = this;
            $menu.click(function(){
                self._onClick(menu);
            });
            return $menu;
        }
    });
})(jQuery);