
module.exports=function(app){
    app.get("/plugin/rightfromleft",function(req,res){
        res.render("rightFromLeft/default");
    });
};