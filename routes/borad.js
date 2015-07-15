module.exports=function(app){
    app.get("/plugin/board",function(req,res){
        res.render("board/default");
    });
};