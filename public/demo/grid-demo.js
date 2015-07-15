(function($){
    var callback = function(target,element){
        $(target).html('<span style="color:#61fdff">' +$(element).html() +'</span> menu is clicked, Target id: '+ $(target).attr('id'));
    };
    var menu = {};
    menu['back'] = {icon:'icon-arrow-left',text:'Back',click:callback};
    menu['forward'] = {icon:'icon-arrow-right',text:'Forward',click:callback};
    menu['view'] = {text:'View',click:callback};
    menu['sortby'] = {text:'Sort by',click:callback};
    menu['refresh'] = {icon:'icon-refresh',text:'Refresh',click:callback};
    menu['notepad'] = {text:'Notepad++',click:callback};
    menu['s1'] = '---';
    menu['copy'] = {text:'Copy',click:callback};
    menu['paste'] = {disabled:true,text:'Paste',click:callback};
    menu['paste_shortcut'] = {disabled:true,text:'Paste shortcut',click:callback};
    menu['s2'] = '---';
    menu['create_shortcut'] = {text:'Create shortcut',click:callback};
    menu['rename'] = {text:'Rename',click:callback};
    menu['del'] = {text:'Delete',click:callback};
    menu['s3'] = '---';
    menu['properties'] = {text:'Properties',click:callback};
    $('#gridList').bsContextMenu({menus:menu,onShow:function(){
        console.log("contextMenu show.");
        return true;
    }});
    $("#gridList").bsGrid({
        paging:true,
        dataCount:5,
        multi:true,
        pageSize:3,
        title:"表格Demo",
        statusField:"status",
        statusColor:{enabled:"#dff0d8", disabled:"#fcf8e3"},
        sortable:true,
        hasCheckBox:true,
        onSelect:function(row,data){
            console.log("onSelect : " + data.value);
        },
        onUnSelect:function(row,data){
            console.log("onUnSelect : " + data.value);
        },
        onPaging:function(pageNo){
            console.log("pageNo : " + pageNo);
        },
        onSort:function(field,order,column){
            console.log("onSort : field="+field+", sort="+order+"");
            console.log(column);
        },
        onMouseRightUp:function(data, $row){
            $("#gridList").bsContextMenu("disabled","back",true);
            console.log(data);
        },
        emptyTemplate:"<div class='text-center'><i>No data exists.</i></div>",
        columns:[
            {
                title:"列1",
                field:"value",
                sortable:true
            },
            {
                title:"列2",
                field:"val",
                sortable:true,
                visible:false
            },
            {
                title:"列3",
                field:"value"
            },
            {
                title:"列4",
                field:"value",
                visible:false
            }
        ],
        data:[
            {
                value:"cel1",
                val:"cell1",
                status : "enabled"
            },
            {
                value:"cell2",
                val:"cell2",
                status : "enabled"
            },
            {
                value:"cell3",
                val:"cell3",
                status : "enabled"
            },
            {
                value:"cell4",
                val:"cell4",
                status : "disabled"
            },
            {
                value:"cell5",
                val:"cell5",
                status : "enabled"
            }
        ]
    });
    var code = $("div[tip-bind='btnLoadAction'] code").text();
    $("#btnLoadAction").bsCode();
    $("#btnSetPageSize").bsCode();
    $("#btnNoData").bsCode();

})(jQuery);