$(function(){
var callback = function(target,element){
    $(target).html('<span style="color:#61fdff">' +$(element).html() +'</span> menu is clicked, Target id: '+ $(target).attr('id'));
};
var menu = {};
menu['back'] = {icon:'fa fa-arrow-left',text:'Back',click:callback};
menu['forward'] = {icon:'icon-arrow-right',text:'Forward',click:callback};
menu['view'] = {text:'View',click:callback};
menu['sortby'] = {text:'Sort by',click:callback,
    children:{
        name:{text:'Name',click:callback},
        size:{text:'Size',click:callback},
        itemtype:{text:'Item type',click:callback},
        datemodified:{text:'Date modified',click:callback},
        s1:'---',
        Ascending:{text:'Ascending',click:callback},
        Descending:{text:'Descending',click:callback},
        s2:'---',
        More:{text:'More',click:callback,
            children:{
                other1:{text:'Other 1',click:callback},
                other2:{text:'Other 2',click:callback},
                other3:{text:'Other 3',click:callback},
                sx:'---',
                other4:{text:'Other 4',click:callback}
            }
        }
    }
};
menu.refresh = {icon:'icon-refresh',text:'Refresh',click:callback};
menu.notepad = {text:'Notepad++',click:callback};
menu.s1 = '---';
menu.copy = {text:'Copy',click:callback};
menu.paste = {disabled:true,text:'Paste',click:callback};
menu.paste_shortcut = {disabled:true,text:'Paste shortcut',click:callback};
menu.s2 = '---';
menu.create_shortcut = {text:'Create shortcut',click:callback};
menu.rename = {text:'Rename',click:callback};
menu.del = {text:'Delete',click:callback};
menu.s3 = '---';
menu.properties = {text:'Properties',click:callback};
    $('#contextMenuDemo').bsContextMenu({menus:menu,onShow:function(){
        console.log("contextMenu show.");
        return true;}});
});