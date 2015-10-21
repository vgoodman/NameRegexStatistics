var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var routes = require('./routes/index');

var app = express();
var maxAge = 0;

var appEnvironment = app.get('env') !== "development" ? app.get('env') : 'local';

if(appEnvironment !== 'local') {
  maxAge = 31536000000;
}
app.use(express.static(__dirname + '/public', { maxAge: maxAge }));
app.use(express.static(__dirname + '/tests'));
// view engine setup
app.set('views', path.join(__dirname, 'src/templates'));
app.set('view engine', 'hbs');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/*', function(req, res){
  var globals = {
    environment: appEnvironment
  };

  if (appEnvironment === 'local' || appEnvironment === 'testing') {
    res.render('index-dev',globals);
  }
  //Add revisioned file paths for production
  else {
    var css = require(__dirname + '/temp/json/css.manifest.json');
    var js = require(__dirname + '/temp/json/js.manifest.json');
    globals.js = removeDot(js);
    globals.css = removeDot(css);
    res.render('index-prod',globals);
  }
  function removeDot(object) {
    var pathObject = {};
      for (var property in object) {
        pathObject[property.split('.')[0]] = "revisioned/" + object[property];
      }
    return pathObject;
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (appEnvironment === 'local') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
