
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
}

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
