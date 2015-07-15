$(function(){

    var sources = [
        {
            id:"1",
            name:"管理员",
            type:"role"
        },{
            id:"2",
            name:"运维组",
            type:"role"
        },
        {
            id:"1",
            name:"admin",
            type:"user"
        },
        {
            id:"2",
            name:"张三",
            type:"user"
        },
        {
            id:"3",
            name:"李四",
            type:"user"
        }
    ];

    $("#selector-default").bsSelector({
        sources:sources,
        onExists:function(data){
            alert(data.name + "已存在.");
        }
    });

    $("#selector-remote").bsSelector({
        sortable:true,
        onSearch:function(key,callback){
            callback(sources);
        },
        onExists:function(data){
            alert(data.name + "已存在.");
        }
    });

});
