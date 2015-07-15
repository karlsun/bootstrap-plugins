;(function ($) {
    'use strict';

    var ATTR_DATA_INDEX = "data-index",
        ATTR_PAGE_NO = "data-page";

    $.widget("dl.bsGrid", {
        options: {
            ajaxType: "POST",
            url: null,
            title: null,
            columns: [],
            data: [],
            paging: false,
            pageNo: 1,
            pageSize: 10,
            dataCount: 0,
            multi: false,
            hasCheckBox:false,
            sorting:null,
            pagingByOther:false,
            statusField:null,
            statusColor:{},
            emptyTemplate:null,
            sortable: false,
            onChangeVisible:function(column,columns){},
            onSelect: function (row, data) {
            },
            onUnSelect: function (row, data) {
            },
            onSelectAllAction: function(){

            },
            onPaging: function (pageNo) {
            },
            onSort: function (field, order, column) {
            },
            onMouseRightUp: null,
            onRowHoverIn:null,
            onRowHoverOut:null
        },
        _create: function () {
            if(this.options.title){
                this._setContainer();
            }
            var table = this._createTable()
                , head = this._createHead()
                , body = this._createBody()
                , control = this._createVisibleControl()
                , columnSelector = this._createColumnSelector();
            this.options.tbody = body;
            this.options.thead = head;
            this.options.table = table;
            this.options.control = control;
            this.options.columnSelector = columnSelector;
            var grid = $("<div class='bsGrid'></div>");
            this.element.append(grid);
            grid.append(control);
            grid.append(columnSelector);
            this._initColumnSelectorItems();
            var $tableContainer = $("<div class='bsGrid-table-container'></div>");
            grid.append($tableContainer.append(table));
            if(this.options.sortable){
                this.options.tbody.sortable();
            }
            grid.hover(
                function(){
                    control.show();
                },
                function(){
                    control.hide();
                }
            );
            table.append(head).append(body);
            if (this.options.paging) {
                this.options.pagination = this._createPagination();
                this.element.append(this.options.pagination);
                this._refreshPagination();
            }
            this._refreshHead();
            this._refreshBody();
        },
        _setContainer: function () {
            this.element.addClass("panel panel-primary");
            this.element.append($.dlFormat("<div class='panel-heading'>{0}</div>",this.options.title));
        },
        _createVisibleControl:function(){
            var control = $("<div class='bsGrid-control'><i class='fa fa-gear'></i></div>"),
                opts = this.options;
            control.on("click",function(){
                opts.columnSelector.show();
            });
            return control;
        },
        _createColumnSelector:function(){
            var selector = $("<div class='panel panel-default bgGrid-column-selector'>"+
                    "<div class='panel-heading'>自定义显示列</div>"+
                    "<div class='panel-body'><div class='btn-group-vertical bgGrid-column-list'></div></div>"+
                    "</div>"),
                opts = this.options;
            selector.hover(
                function(){},
                function(){
                    opts.columnSelector.hide();
                }
            );
            return selector;
        },
        _initColumnSelectorItems:function(){
            var $list = this.options.columnSelector.find(".bgGrid-column-list"),
                template = "<button type='button' class='btn btn-default column' title='{0}'>{1} {0}</button>",
                checkedTemplate = "<i class='fa fa-eye'></i>",
                unCheckedTemplate="<i class='fa'></i>",
                self = this;
            $.each(this.options.columns,function(index, column){
                var $columnBtn = $($.dlFormat(template,column.title,column.visible !== false ? checkedTemplate : unCheckedTemplate));
                $columnBtn.on("click",function(){
                    var $checkedEle = $(this).find("i");
                    if($checkedEle.hasClass("fa-eye")){
                        if($(this).parent().find(".fa-eye").size() > 1){
                            $checkedEle.removeClass("fa-eye");
                            self._setColumnVisible(column,false);
                        }
                    }else{
                        $checkedEle.addClass("fa-eye");
                        self._setColumnVisible(column,true);
                    }
                });
                $list.append($columnBtn);
            });
        },
        _setColumnVisible:function(column,visible){
            column.visible = visible;
            this._refreshHead();
            this._refreshBody();
            this.options.onChangeVisible(column,this.options.columns);
        },
        _createTable: function () {
            var table = $("<table class='table'></table>");
            return table;
        },
        _createHead: function () {
            var head = $("<thead></thead>");
            return head;
        },
        _createHeadColumns:function(head){
            var columns = [],
                self = this;
            if(this.options.multi && this.options.hasCheckBox){
                columns.push("<th style='width:30px;'><i class='bgGrid-checkbox bgGrid-checkbox-all'></i></th>")
            }else if(this.options.hasCheckBox){
                columns.push("<th style='width:30px;'></th>")
            }
            $.each(this.options.columns, function (index, column) {
                if(column.visible !== false){
                    columns.push($.dlFormat("<th style='width:{0};' class='grid-header-column'>{1}</th>",
                        column.width ? isNaN(column.width) ? column.width : column.width+"px" : "auto",
                        column.title
                    ));
                }
            });
            head.append($.dlFormat("<tr>{0}</tr>",columns.join("")));
            if(this.options.multi && this.options.hasCheckBox){
                head.find(".bgGrid-checkbox-all").on("click",function(){
                    var checked = !$(this).hasClass("bgGrid-checkbox-active");
                    var rowsCheckbox = self.options.tbody.find(".bgGrid-checkbox");
                    rowsCheckbox.removeClass("bgGrid-checkbox-active");
                    rowsCheckbox.parent().parent().removeClass("active");
                    if(checked){
                        $(this).addClass("bgGrid-checkbox-active");
                        rowsCheckbox.addClass("bgGrid-checkbox-active");
                        rowsCheckbox.parent().parent().addClass("active");
                    }else{
                        $(this).removeClass("bgGrid-checkbox-active");
                    }
                    self._onSelectAllAction();
                });
            }
        },
        _headSortInit: function (head) {
            var headColumns = head.find(".grid-header-column"),
                self = this, _sort_identity = 0;
            $.each(this.options.columns, function (index, column) {
                if (column.sortable && column.visible !== false) {
                    column._sort_index_ = index;
                    var sortIcon = "",
                        headColumn = headColumns.eq(_sort_identity++).css("cursor", "pointer");
                    if (typeof column.order != "undefined" && (!self.options.sorting || self.options.sorting._sort_index_ == column._sort_index_)) {
                        self.options.sorting = column;
                        if (column.order === "asc") {
                            sortIcon = "glyphicon-arrow-up";
                        } else if (column.order === "desc") {
                            sortIcon = "glyphicon-arrow-down";
                        }
                    }
                    headColumn.append($.dlFormat(" <div class='pull-right'><span class='glyphicon {0}'></span></div>",sortIcon));
                    headColumn.hover(
                        function () {
                            $(this).addClass("active");
                        }, function () {
                            $(this).removeClass("active");
                        }
                    );
                    headColumn.on("click", function () {
                        var sortIconEle = headColumn.find(".glyphicon");
                        column.order = typeof column.order == "undefined" || column.order == "desc" ? "asc" : "desc";
                        self.options.sorting = column;
                        head.find(".glyphicon").removeClass("glyphicon-arrow-down").removeClass("glyphicon-arrow-up");
                        if (column.order == "asc") {
                            sortIconEle.removeClass("glyphicon-arrow-down").addClass("glyphicon-arrow-up");
                        } else {
                            sortIconEle.removeClass("glyphicon-arrow-up").addClass("glyphicon-arrow-down");
                        }
                        self._onSort(column.field, column.order, column);
                    });
                }
            });
        },
        _createBody: function () {
            var body = $("<tbody></tbody>");
            return body;
        },
        _refreshHead:function(){
            this.options.thead.empty();
            this._createHeadColumns(this.options.thead);
            this._headSortInit(this.options.thead);
        },
        _refreshBody: function () {
            this.options.tbody.empty();
            this.element.find(".bsGrid-no-data").remove();
            if(this.options.multi && this.options.hasCheckBox){
                this.options.thead.find(".bgGrid-checkbox-all").removeClass("bgGrid-checkbox-active");
            }
            var dataRows = this._createDataRows();
            if(dataRows === ""){
                $($.dlFormat("<div class='bsGrid-no-data'>{0}</div>",this.options.emptyTemplate || "<i>No data exists.</i>")).insertAfter(this.options.tbody.parent());
            }else{
                this.options.tbody.append(dataRows);
                this._eventBind();
            }
        },
        _createDataRows: function () {
            var self = this
                , opts = this.options
                , datas = opts.data
                , dataRows = []
                , columns = opts.columns
                , showCount = opts.paging && !opts.url ? opts.pageSize : datas.length
                , startIndex = opts.url || opts.pagingByOther ? 0 : opts.paging ? (opts.pageNo - 1) * opts.pageSize : 0;
            for (var i = startIndex; i < startIndex + showCount; i++) {
                if (i >= datas.length)break;
                var data = datas[i];
                dataRows.push($.dlFormat(
                    "<tr data-index='{0}' {1}>",
                    i,
                    opts.statusField ? $.dlFormat("style='background-color:{0};'",opts.statusColor[data[opts.statusField]]) : ""
                ));
                if(this.options.hasCheckBox){
                    dataRows.push("<td><i class='bgGrid-checkbox'></i></td>");
                }
                $.each(columns, function (index, column) {
                    if(column.visible !== false){
                        dataRows.push(self._createDataCell(data, column));
                    }
                });
                dataRows.push("</tr>");
            }
            return dataRows.join("");
        },
        _createDataCell: function (data, column) {
            var cellContent = data[column.field] || "";
            if(column.format){
                return $.dlFormat("<td>{0}</td>",column.format(data,column));
            }else{
                return $.dlFormat("<td><div class='{0}' style='width:{1};' title='{2}'>{3}</div></td>",
                    column.width ? "bsGrid-cell" : "",
                    column.width ? isNaN(column.width) ? column.width : column.width+"px" : "auto",
                        typeof cellContent == "string" ? cellContent.replace(/'/g,"‘") : cellContent,
                    cellContent
                );
            }
        },
        _createPagination: function () {
            var pagination = $("<div class='clearfix'><ul class='pagination pull-right' style='margin-left:12px;margin-right:12px;'></ul></div>")
            return pagination;
        },
        _createPaginationItems: function () {
            var items = []
                , maxShowPage = 10
                , opts = this.options
                , maxPage = opts.maxPage = parseInt((opts.dataCount + opts.pageSize - 1) / opts.pageSize) || 1
                , pageNo = opts.pageNo = opts.pageNo < 1 || opts.pageNo > maxPage ? 1 : opts.pageNo
                , startPage = maxPage > maxShowPage ?  parseInt((pageNo - 1) / maxShowPage) * maxShowPage + 1 : 1
                , showPageLen = maxPage > maxShowPage ? maxShowPage : maxPage
                , i = 0;
            for (; i < showPageLen; i++) {
                items.push(this._createPaginationItem(i + startPage));
            }
            if(maxPage > maxShowPage){
                items.splice(0, 0, $.dlFormat(
                    "<li {0}='{1}'><a href='javascript:void(0);'>&lt;</a></li>",
                    ATTR_PAGE_NO,
                        startPage == 1 ? startPage : startPage - maxShowPage
                ));
                items.push($.dlFormat(
                    "<li {0}='{1}'><a href='javascript:void(0);'>&gt;</a></li>",
                    ATTR_PAGE_NO,
                        startPage + maxShowPage > maxPage ? maxPage : startPage + maxShowPage
                ));
            }
            return items.join("");
        },
        _createPaginationItem: function (pageNo) {
            var isCurrent = this.options.pageNo == pageNo;
            return $.dlFormat(
                "<li {0}='{1}' {2}><a href='javascript:void(0);'>{1}{3}</a></li>",
                ATTR_PAGE_NO,
                pageNo,
                isCurrent ? "class='active'" : "",
                isCurrent ? "<span class='sr-only'>(current)</span>" : ""
            );
        },
        _getPaginationList: function () {
            return $(".pagination", this.options.pagination);
        },
        _refreshPagination: function (pageNo, pageSize, dataCount) {
            var opts = this.options;
            opts.pageNo = pageNo || opts.pageNo;
            opts.pageSize = pageSize || opts.pageSize;
            opts.dataCount = typeof dataCount != "undefined" ? dataCount : opts.dataCount;
            this._getPaginationList().empty().append(this._createPaginationItems());
            this._paginationEventBind();
        },
        _paginationEventBind: function () {
            var self = this;
            this._getPaginationList().children().click(function () {
                var pageNo = parseInt($(this).attr(ATTR_PAGE_NO));
                self._onPaging(pageNo);
            })
        },
        _eventBind: function () {
            var self = this;
            this.options.tbody.children().click(function () {
                var $tr = $(this),
                    $checkbox = $tr.find(".bgGrid-checkbox");
                if ($tr.hasClass("active")) {
                    $tr.removeClass("active");
                    $checkbox.removeClass("bgGrid-checkbox-active");
                    self._onUnSelect($tr);
                    return;
                }
                if (!self.options.multi) {
                    var activeRow = $("tr.active", self.options.tbody);
                    if (activeRow.size() > 0) {
                        activeRow.removeClass("active");
                        activeRow.find(".bgGrid-checkbox").removeClass("bgGrid-checkbox-active");
                        self._onUnSelect(activeRow);
                    }
                }
                $tr.addClass("active");
                $checkbox.addClass("bgGrid-checkbox-active");
                self._onSelect($tr);
            }).on("mouseup",function(e){
                if(e.button == 2){
                    self._onMouseRightUp(e,$(this));
                };
            }).hover(
                function(e){
                    self._onRowHoverIn(e,$(this));
                },
                function(e){
                    self._onRowHoverOut(e,$(this));
                }
            );
        },
        _onRowHoverIn:function(e,$row){
            var data = this.options.data[parseInt($row.attr(ATTR_DATA_INDEX))];
            if(this.options.onRowHoverIn)this.options.onRowHoverIn.call(this.element,e,data, $row);
        },
        _onRowHoverOut:function(e,$row){
            var data = this.options.data[parseInt($row.attr(ATTR_DATA_INDEX))];
            if(this.options.onRowHoverOut)this.options.onRowHoverOut.call(this.element,e,data, $row);
        },
        _onMouseRightUp:function(e,$row){
            var data = this.options.data[parseInt($row.attr(ATTR_DATA_INDEX))];
            if(this.options.onMouseRightUp)this.options.onMouseRightUp.call(this.element,data, $row);
        },
        _loadRemoteData: function (callback) {
            var pModel = {
                    pageNo:this.options.pageNo,
                    pageSize:this.options.pageSize,
                    sort:this.options.sorting,
                    condition:this.options.condition
                },
                opts = this.options;
            $.ajax({
                type: this.options.ajaxType,
                url: this.options.url,
                data: pModel,
                dataType: "json",
                beforeSend: function () {
                    // TODO 加载数据提示显示
                },
                complete: function () {
                    // TODO 加载数据提示关闭
                },
                success: function (pageModel) {
                    opts.pageNo = pageModel.pageNo || opts.pageNo;
                    opts.pageSize = pageModel.pageSize || opts.pageSize;
                    opts.dataCount = pageModel.dataCount || opts.dataCount;
                    opts.data = pageModel.data;
                    callback();
                },
                error: function () {
                    // TODO 处理异常
                }
            });
        },
        _onSort: function (field, order, column) {
            if (!this.options.url) {
                // TODO 页面排序
            }
            this.options.onSort(field, order, column);
        },
        _onPaging: function (pageNo) {
            this.options.onPaging(pageNo);
            if(this.options.pagingByOther == false){
                if (this.options.url) {
                    this.options.pageNo = pageNo;
                    this._loadRemoteData(function(){
                        this._refreshPagination();
                        this._refreshBody();
                    });
                }else{
                    this._refreshPagination(pageNo);
                    this._refreshBody();
                }
            }
        },
        _onSelectAllAction : function(){
            this.options.onSelectAllAction();
        },
        _onSelect: function (row) {
            this.options.onSelect(row, this.options.data[+row.attr(ATTR_DATA_INDEX)]);
        },
        _onUnSelect: function (row) {
            this.options.onUnSelect(row, this.options.data[+row.attr(ATTR_DATA_INDEX)]);
        },
        getCurrentPageData:function(){
            var _rows = this.options.tbody.find(">tr");
            var _datas = [];
            $.each(_rows, function(n, ele){
                var _index = +$(ele).attr(ATTR_DATA_INDEX);
                _datas.push(this.options.data[_index]);
            }.bind(this));
            return _datas;
        },
        getData : function(dataIndex){
            return this.options.data[+dataIndex];
        },
        getSelected: function () {
            var activeRow = $("tr.active", this.options.tbody)
                , selectedData = []
                , self = this;
            $.each(activeRow, function (index, row) {
                selectedData.push(self.options.data[parseInt($(row).attr(ATTR_DATA_INDEX))]);
            });
            return selectedData;
        },
        getSelectedRowIndex: function () {
            var activeRow = $("tr.active", this.options.tbody)
                , selectedData = [];
            $.each(activeRow, function (index, row) {
                selectedData.push(parseInt($(row).attr(ATTR_DATA_INDEX)));
            });
            return selectedData;
        },
        getSelectedRow: function () {
            return $("tr.active", this.options.tbody);
        },
        setSelected: function (rowIndex) {
            var $tr = $($.dlFormat("tr[{0}='{1}']",ATTR_DATA_INDEX,rowIndex), this.options.tbody)
                ,$checkbox = $tr.find(".bgGrid-checkbox");
            if (!this.options.multi) {
                var activeRow = $("tr.active", this.options.tbody);
                if(activeRow.size() > 0){
                    activeRow.find(".bgGrid-checkbox").removeClass("bgGrid-checkbox-active");
                    activeRow.removeClass("active");
                }
            }
            $tr.addClass("active");
            $checkbox.addClass("bgGrid-checkbox-active");
        },
        toggleSelected : function(rowIndex){
            var $tr = $($.dlFormat("tr[{0}='{1}']",ATTR_DATA_INDEX,rowIndex), this.options.tbody);
            if($tr.hasClass("active")){
                $tr.find(".bgGrid-checkbox").removeClass("bgGrid-checkbox-active");
                $tr.removeClass("active");
            }else{
                this.setSelected(rowIndex);
            }
        },
        selectedAll: function(){
            $.each(this.options.data, function(n, item){
                this.setSelected(n);
            }.bind(this));
        },
        setPageSize: function (pageSize) {
            this._refreshPagination(this.options.pageNo, pageSize);
            this._refreshBody();
        },
        load: function (pageModel) {
            this.options.data = pageModel.data;
            if (this.options.paging) {
                pageModel.dataCount = pageModel.dataCount || this.options.data.length;
                this._refreshPagination(pageModel.pageNo, pageModel.pageSize, pageModel.dataCount);
            }
            this._refreshBody();
        },
        destroy: function () {
            this.element.empty();
        }
    });

})(jQuery);