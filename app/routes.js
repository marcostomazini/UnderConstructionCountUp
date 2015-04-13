module.exports = function(app) {
	
    app.get('/', function(req, res){
        res.render('index');
    });

	app.get('/burndown', function(req, res){
        res.render('wilde/index');
    });

	app.get('/burn-aam', function(req, res){
        res.render('wilde/burn-aam');
    });
	
	app.get('/burn-imp', function(req, res){
        res.render('wilde/burn-imp');
    });
	
	app.get('/done-points', function(req, res){
        res.render('wilde/done-points');
    });
	
    app.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });
}