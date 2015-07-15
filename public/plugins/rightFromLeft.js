
(function($){

    var ITEM_DATA_KEY = "__rightFormLeft_Data__";

    $.widget("dl.bsRightFromLeft",{
        options:{
            leftData:[],
            rightData:[],
            width:200,
            height:240,
            onSelect:function(){},
            onRemove:function(){}
        },
        _create:function(){
            this._createContainer();
            this._createLeft();
            this._createMid();
            this._createRight();
        },
        _createContainer:function(){
            var $container = $("<form class='form-inline bsRightFromLeft' role='form'>"+
                                    "<div class='form-group'></div>"+
                                    "<div class='form-group' style='margin-left:6px;margin-right:6px;'></div>"+
                                    "<div class='form-group'></div>"+
                                "</form>");
            this.element.append($container);
            var groups = $container.find(".form-group");
            this.options.container = $container;
            this.options.leftEle = groups.eq(0);
            this.options.midEle = groups.eq(1);
            this.options.rightEle = groups.eq(2);
        },
        _createSelect:function(title, partEleName, selectEleName, data){
            var $part = $($.dlFormat("<div>{0}</div><select multiple class='form-control'></select>", title));
            this.options[partEleName].append($part);
            this.options[selectEleName] = $part.eq(1);
            $part.eq(1).css({
                width:this.options.width,
                height:this.options.height
            });
            this._refreshItems(this.options[selectEleName], data);
        },
        _createLeft:function(){
            this._createSelect(
                "可选",
                "leftEle",
                "leftSelectEle",
                this.options.leftData
            );
        },
        _createRight:function(){
            this._createSelect(
                "已选",
                "rightEle",
                "rightSelectEle",
                this.options.rightData
            );
        },
        _addItem : function($selectEle, data){
            var _$item = $($.dlFormat(
                "<option value='{0}' title='{1}'>{1}</option>",
                data.value,
                data.label
            ));
            _$item.data(ITEM_DATA_KEY, data);
            $selectEle.append(_$item);
        },
        _addLeftItem:function(data){
            this._addItem(this.options.leftSelectEle, data);
        },
        _removeItem : function($selectEle, item){
            $selectEle.find($.dlFormat("option[value='{0}']",item.value)).remove();
        },
        _clearItems : function($selectEle){
            $selectEle.empty();
        },
        _clearLeftItems:function(){
            this._clearItems(this.options.leftSelectEle);
        },
        _refreshItems:function($selectEle, datas){
            this._clearItems($selectEle);
            $.each(datas,function(index, item){
                this._addItem($selectEle, item);
            }.bind(this));
        },
        _refreshLeftItems : function(datas){
            this._refreshItems(this.options.leftSelectEle, datas);
        },
        _refreshRightItems:function(datas){
            this._refreshItems(this.options.rightSelectEle, datas);
        },
        _getSelectedItems : function($selectEle){
            var $selected = $selectEle.find("option:selected"),
                selected = [];
            $.each($selected,function(index, item){
                var $item = $(item);
                selected.push($item.data(ITEM_DATA_KEY));
            });
            return selected;
        },
        _removeLeftItem:function(item){
            this._removeItem(this.options.leftSelectEle, item);
        },
        _getLeftSelectedItems:function(){
            return this._getSelectedItems(this.options.leftSelectEle);
        },
        _getItems: function($selectEle){
            var _$items = $selectEle.find("option"),
                _items = [];
            $.each(_$items,function(index, item){
                var $item = $(item);
                _items.push($item.data(ITEM_DATA_KEY));
            });
            return _items;
        },
        _getLeftItems:function(){
            return this._getItems(this.options.leftSelectEle);
        },
        _addRightItem:function(data){
            this._addItem(this.options.rightSelectEle, data);
        },
        _clearRightItems:function(){
            this._clearItems(this.options.rightSelectEle);
        },
        _removeRightItem:function(item){
            this._removeItem(this.options.rightSelectEle, item);
        },
        _getRightSelectedItems:function(){
            return this._getSelectedItems(this.options.rightSelectEle);
        },
        _getRightItems:function(){
            return this._getItems(this.options.rightSelectEle);
        },
        _hasItem:function(item, targetDatas){
            var has = false;
            $.each(targetDatas,function(index, targetData){
                if(targetData.value == item.value){
                    has = true;
                    return false;
                }
            })
            return has;
        },
        _createMid:function(){
            var $mid = $("<div class='btn-group-vertical'></div>"),
                $doubleRight = $("<button type='button' class='btn btn-default'><i class='fa fa-angle-double-right'></i></button>"),
                $right = $("<button type='button' class='btn btn-default'><i class='fa fa-angle-right'></i></button>"),
                $left = $("<button type='button' class='btn btn-default'><i class='fa fa-angle-left'></i></button>"),
                $doubleLeft = $("<button type='button' class='btn btn-default'><i class='fa fa-angle-double-left'></i></button>"),
                self = this;
            this.options.midEle.append($mid);
            $mid.append($doubleRight);
            $mid.append($right);
            $mid.append($left);
            $mid.append($doubleLeft);
            $doubleRight.on("click",function(){
                var items = self._getLeftItems(),
                    rightItems = self._getRightItems();
                $.each(items,function(index, item){
                    if(!self._hasItem(item, rightItems)){
                        self._removeLeftItem(item);
                        self._addRightItem(item);
                    }
                });
            });
            $right.on("click",function(){
                var items = self._getLeftSelectedItems(),
                    rightItems = self._getRightItems();
                $.each(items,function(index, item){
                    if(!self._hasItem(item, rightItems)){
                        self._removeLeftItem(item);
                        self._addRightItem(item);
                    }
                });
            });
            $left.on("click",function(){
                var items = self._getRightSelectedItems(),
                    leftItems = self._getLeftItems();
                $.each(items,function(index, item){
                    self._removeRightItem(item);
                    if(!self._hasItem(item, leftItems)){
                        self._addLeftItem(item);
                    }
                });
            });
            $doubleLeft.on("click",function(){
                var items = self._getRightItems(),
                    leftItems = self._getLeftItems();
                $.each(items,function(index, item){
                    self._removeRightItem(item);
                    if(!self._hasItem(item, leftItems)){
                        self._addLeftItem(item);
                    }
                });
            });
        },
        /*
        *  [{label:"",value:""}]
        * */
        setLeftData:function(datas){
            this._refreshLeftItems(datas);
        },
        /*
         *  [{label:"",value:""}]
         * */
        setRightData:function(datas){
            this._refreshRightItems(datas);
        },
        getLeftData:function(){
            return this._getLeftItems();
        },
        getRightData:function(){
            return this._getRightItems();
        },
        getLeftSelected:function(){
            return this._getLeftSelectedItems();
        },
        getRightSelected:function(){
            return this._getRightSelectedItems();
        },
        destroy:function(){
            this.options.container.empty().remove();
        }
    });

})(jQuery);