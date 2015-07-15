module.exports=function(app){
    app.get("/plugin/grid",function(req,res){
        res.render("grid/grid");
    });
};