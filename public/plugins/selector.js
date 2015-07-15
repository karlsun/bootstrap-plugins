(function($){

    $.widget("dl.bsSelector",{
        options:{
            width:300,
            minHeight:200,
            data:null,
            sources:null,
            cacheEnabled:true,
            maxRow:10,
            minLength:1,
            cache:{},
            selected:{},
            delay:500,
            sortable : false,
            types:{
                user:{
                    className:"label label-success",
                    icon:"fa fa-user",
                    text:"用户"
                },
                role:{
                    className:"label label-warning",
                    icon:"fa fa-users",
                    text:"角色"
                }
            },
            onSearch:null,
            onSelect:function(data){},
            onRemove:function(data){},
            onExists:function(data){}
        },
        _create:function(){
            this.element.addClass("bsSelector");
            this._createSelectedPanel();
            this._createSelectPanel();
            var self = this;
            $(document).on("click",function(e){
                if(!$(e.target).hasClass("selector-select-item")){
                    self._hideSelectPanel();
                }
            });
            if(this.options.data){
                $.each(this.options.data,function(index, item){
                    self._appendSelected(item);
                });
            }
        },
        _createSelectedPanel:function(){
            var $selectedPanel = $("<ul class='clearfix selector-selected'><li class='selected-input'><input type='text' /></li></ul>");
            $selectedPanel.css({
                width:this.options.width,
                "min-height":this.options.minHeight
            });
            this.element.append($selectedPanel);
            if(this.options.sortable){
                $selectedPanel.sortable({items:".selected-item",placeholder: "sortable-placeholder"})
            }
            var self = this,
                opts = this.options,
                timer;
            this.options.selectedInput = $selectedPanel.find(".selected-input");
            this.options.selectedInput.find("input").on("keydown",function(e){
                if(e.keyCode == 13){
                    var $item = opts.selectPanelList.find(".item-focus");
                    if($item.size()>0){
                        self._onSelectItem($item);
                    }
                    e.preventDefault();
                    return false;
                }else if(e.keyCode == 8){
                    if(opts.selectedInput.find("input").val().length == 0){
                        var items = opts.selectedPanel.find("li.selected-item");
                        if(items.size() > 0){
                            var lastItem = items.eq(items.size() - 1);
                            self._removeSelectedItem(lastItem);
                        }
                        e.preventDefault();
                        return false;
                    }
                }else if(e.keyCode == 38 || e.keyCode == 40){
                    var prevIndex = opts.currentSelectedIndex,
                        targetIndex = prevIndex,
                        items = opts.selectPanelList.children(),
                        maxIndex = items.size() - 1;
                    if(e.keyCode == 38){
                        if(targetIndex > 0) targetIndex--;
                    }else if(e.keyCode == 40){
                        if(targetIndex < maxIndex) targetIndex++;
                    }
                    if(targetIndex != prevIndex){
                        items.eq(prevIndex).removeClass("item-focus");
                        items.eq(targetIndex).addClass("item-focus");
                        opts.currentSelectedIndex = targetIndex;
                    }
                    e.preventDefault();
                    return false;
                }
            }).on("keyup",function(){
                if(timer != null){
                    window.clearTimeout(timer);
                }
                if(opts.selectedInput.find("input").val().length >= opts.minLength){
                    timer = setTimeout(function(){
                        self._search();
                    },opts.delay);
                }else{
                    self._hideSelectPanel();
                }
            });
            this.options.selectedPanel = $selectedPanel;
            $selectedPanel.on("click",function(){
                self.options.selectedInput.find("input").focus();
            });
        },
        _createSelectPanel:function(){
            var $selectPanel = $("<div class='selector-select'><ul class='list-unstyled selector-select-list'></ul></div>");
            this.options.selectedPanel.append($selectPanel);
            this.options.selectPanel = $selectPanel;
            this.options.selectPanelList = $selectPanel.find("ul");
        },
        _search:function(){
            var key = this.options.selectedInput.find("input").val(),
                self = this;
            if(this.options.cacheEnabled && self.options.cache[key]){
                self._refreshSelectPanel(self.options.cache[key]);
                self._showSelectPanel();
                return;
            }
            if(this.options.onSearch){
                this.options.onSearch(key,function(data){
                    if(data && data.length > 0){
                        self.options.cache[key] = data;
                        self._refreshSelectPanel(data);
                        self._showSelectPanel();
                    }else{
                        self._hideSelectPanel();
                    }
                });
            }else if(this.options.sources && this.options.sources.length > 0){
                var reg = eval("/.*" + self._replaceKey(key) + ".*/"),
                    data = [];
                $.each(this.options.sources,function(index, item){
                    if(item.name.match(reg)){
                        data.push(item);
                        if(data.length >= self.options.maxRow){
                            return false;
                        }
                    }
                });
                if(data && data.length > 0){
                    this.options.cache[key] = data;
                    this._refreshSelectPanel(data);
                    this._showSelectPanel();
                }else{
                    this._hideSelectPanel();
                }
            }
        },
        _replaceKey:function(key){
            var keyWords = [".","*","+","?","^","$","[","]","{","}","(",")"],
                after = key;
            $.each(keyWords,function(index, keyWord){
                after = after.replace(eval("/\\"+keyWord+"/"),"\\"+keyWord);
            });
            return after;
        },
        _showSelectPanel:function(){
            var inputPosition = this.options.selectedInput.position(),
                inputHeight = this.options.selectedInput.outerHeight();
            this.options.selectPanel.css({
                left : inputPosition.left,
                top : inputPosition.top + inputHeight
            }).show();
        },
        _hideSelectPanel:function(){
            this.options.selectPanel.hide();
            this.options.selectPanelList.empty();
            this.options.currentSelectedIndex = -1;
        },
        _refreshSelectPanel:function(sources){
            var self = this;
            this.options.selectPanelList.empty();
            this.options.currentSelectedIndex = -1;
            $.each(sources,function(index, item){
                var typeText = self.options.types[item.type].text;
                self.options.selectPanelList.append($.dlFormat("<li data-index='{0}' class='clearfix selector-select-item'>{1} - {2}</li>",index,item.name,typeText));
            });
            var children = this.options.selectPanelList.children().hover(
                function(){
                    $(this).addClass("item-hover");
                },
                function(){
                    $(this).removeClass("item-hover");
                }
            ).on("click",function(){
                    self._onSelectItem($(this));
                });
            if(children.size() > 0){
                this.options.currentSelectedIndex = 0;
                children.eq(0).addClass("item-focus");
            }
        },
        _getDataKey:function(data){
            return $.dlFormat("{0}.{1}",data.type,data.id);
        },
        _onSelectItem:function($item){
            var key = this.options.selectedInput.find("input").val(),
                index = parseInt($item.attr("data-index")),
                data = this.options.cache[key][index];
            this._appendSelected(data);
        },
        _removeSelectedItem:function($item){
            delete this.options.selected[$item.attr("data-key")];
            $item.remove();
        },
        _appendSelected:function(data){
            var type = this.options.types[data.type],
                key = this._getDataKey(data),
                self = this;
            if(!this._hasItem(key)){
                var appendItem = $($.dlFormat("<li class='{0} selected-item' data-key='{1}'><i class='{2}'></i> {3} ",type.className,key,type.icon,data.name)+
                    "<button type='button' class='selected-item-remove' aria-hidden='true'></button>"+
                    "</li>");
                appendItem.insertBefore(this.options.selectedInput);
                this.options.selected[$.dlFormat("{0}.{1}",data.type,data.id)] = data;
                this._hideSelectPanel();
                this.options.selectedInput.find("input").val("").focus();
                appendItem.hover(
                    function(){
                        $(this).find("button.selected-item-remove").addClass("close").html("&times;");
                    },
                    function(){
                        $(this).find("button.selected-item-remove").removeClass("close").html("");
                    }
                );
                appendItem.find("button.selected-item-remove").on("click",function(){
                    self._removeSelectedItem($(this).parent());
                });
            }else{
                this.options.onExists(data);
            }
        },
        _hasItem:function(key){
            return typeof this.options.selected[key] != "undefined";
        },
        /*
         * {id:"", name:"", type:""}
         * */
        add:function(data){
            this._appendSelected(data);
        },
        getSelected:function(){
            var selected = [];
            var _selected_items = this.options.selectedPanel.find("li.selected-item");
            $.each(_selected_items, function(n, ele){
                var _key = $(ele).attr("data-key");
                selected.push(this.options.selected[_key]);
            }.bind(this));
            return selected;
        },
        clearSelected:function(){
            this.options.selected = {};
            this.options.selectedPanel.find("li.selected-item").remove();
        },
        destroy:function(){
            // TODO destroy selector
        }
    });

})(jQuery);