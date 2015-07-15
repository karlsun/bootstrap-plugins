;(function($){
    'use strict';

    $.widget("dl.bsContextMenu",{
        options:{
            width:400,
            menus:[],
            onShow:function(){},
            onHide:function(){}
        },
        _create: function(){
            this.options.contexMenuEle = $(this._createTemplate());
            $(document.body).append(this.options.contexMenuEle);
            this._buildElements(this.options.contexMenuEle,this.options.menus,true);
            this._eventBind();
        },
        _createTemplate: function(){
            var htmlStr = "<div class='dropdown clearfix bootstrap-contextmenu'style='display:none; position: absolute'>"
                +"</div>";
            return htmlStr;
        },
        _buildElements: function(htmlStr,menus,flag) {
            var dropdownMenu =  $("<ul aria-labelledby='dropdownMenu' role='menu' class='dropdown-menu'></ul>");
            var self = this;
            flag = flag != undefined ? flag: true;

            if (flag == true) dropdownMenu.show();

            for (var i in menus) {
                var menuitem = $($.dlFormat('<li id="{0}"></li>',i));
                switch (typeof menus[i]) {
                    case 'object':
                        if (menus[i].text != undefined) {
                            if (menus[i].text == '---') {
                                menuitem.addClass('divider');
                            } else {
                                var h = $('<a href="#" tabindex="-1"></a>');
                                if (typeof menus[i].icon == 'string') {
                                    menuitem.append(h.append(' <i class="' + menus[i].icon + '"></i> ').append(menus[i].text));
                                } else {
                                    h = $('<a href="#" tabindex="-1">' + menus[i].text + '</a>');
                                    menuitem.append(h);
                                }
                                if (typeof menus[i].click == 'function') {
                                    h.bind('mousedown', {
                                            key: i,
                                            target: self.element,
                                            callback: menus[i].click
                                        },
                                        function(e) {
                                            if (!$(this).parent().hasClass('disabled')) {
                                                e.data.callback(e.data.target, $(this).parent());
                                            }
                                        })
                                }
                                if (menus[i].disabled != undefined && menus[i].disabled == true) {
                                    menuitem.addClass('disabled');
                                }
                                if (typeof menus[i].children == 'object') {
                                    if (!menuitem.hasClass('disabled')) {
                                        menuitem.addClass('dropdown-submenu');
                                        this._buildElements(menuitem, menus[i].children, false);
                                    }
                                }
                                if (menuitem.hasClass('disabled')) {
                                    menuitem.children('a').children('i').hide();
                                }
                            }
                        }
                        break;
                    case 'string':
                        if (menus[i] == '---') {
                            menuitem.addClass('divider');
                        } else {
                            menuitem.append($($.dlFormat('<a href="#" tabindex="-1">{0}</a>',menus[i])));
                        }
                        break;
                }
                dropdownMenu.append(menuitem);
            }
            htmlStr.append(dropdownMenu)
        },
        _eventBind: function() {
            var self = this;
            var contextMenu = this.options.contexMenuEle;
            self.element.bind("contextmenu",
                function(e) {
                    e.preventDefault();
                });

            self.element.mousedown(function(e) {
                contextMenu.hide();
            });

            self.element.bind("contextmenu",
                function(e) {
                    e.preventDefault();
                });

            $(document).mousedown(function(e) {
                contextMenu.hide();
            });

            self.element.mousedown(function(e) {
                $('.bootstrap-contextmenu').hide();
                var b = e;
                e.stopPropagation();
                $(this).mouseup(function(e) {
                    e.stopPropagation();
                    $(this).unbind('mouseup');
                    if (b.button == 2) {
                        if(!self.options.onShow || self.options.onShow.call(self.element))
                        {
                            var d = {},
                                x, y;

                            if (window.innerHeight) {
                                d.pageYOffset = window.pageYOffset;
                                d.pageXOffset = window.pageXOffset;
                                d.innerHeight = window.innerHeight;
                                d.innerWidth = window.innerWidth;
                            } else if (document.documentElement && document.documentElement.clientHeight) {
                                d.pageYOffset = document.documentElement.scrollTop;
                                d.pageXOffset = document.documentElement.scrollLeft;
                                d.innerHeight = document.documentElement.clientHeight;
                                d.innerWidth = document.documentElement.clientWidth
                            } else if (document.body) {
                                d.pageYOffset = document.body.scrollTop;
                                d.pageXOffset = document.body.scrollLeft;
                                d.innerHeight = document.body.clientHeight;
                                d.innerWidth = document.body.clientWidth
                            }
                            (e.pageX) ? x = e.pageX: x = e.clientX; (e.pageY) ? y = e.pageY: y = e.clientY;
                            var a = $("#x-context-" + self.element.attr('id')).height();
                            if (y + a > $(document).height()) {
                                contextMenu.css({
                                    top: y - a,
                                    left: x
                                }).fadeIn(20)
                            } else {
                                contextMenu.css({
                                    top: y,
                                    left: x
                                }).fadeIn(20)
                            }
                        }
                    }
                })
            })
        },
        destroy:function(){
            this.options.contexMenuEle.remove();
        },
        disabled:function(id,status){
            var flag = (status == true)?"disabled":"enabled";
            if(status){
                $("#"+id).addClass("disabled");
            }else{
                $("#"+id).removeClass("disabled");
            }
        }
    });
})(jQuery);