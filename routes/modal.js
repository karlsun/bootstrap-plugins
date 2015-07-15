module.exports=function(app){
    app.get("/plugin/modal",function(req,res){
        res.render("modal/default");
    });
};