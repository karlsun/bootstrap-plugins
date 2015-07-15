
module.exports = function(app){
    app.get("/plugin/selector",function(req,res){
        res.render("selector/default");
    });
}