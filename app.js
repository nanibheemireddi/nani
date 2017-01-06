var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var decode = require('isodate-convert').decode

// load user route
//var routes = require('./routes/index');
var users = require('./routes/users');
var category = require('./routes/category');
var product = require('./routes/product');
var order = require('./routes/order');
var organization = require('./routes/organization');
//var image = require('./routes/image');
// for file upload
var fs = require('fs');
var path = require('path');
// Get parent directory
directory = path.dirname(module.parent);

var parent = path.resolve(directory, '..');
var uploaddir = parent + (path.sep) +'ecomapi' + (path.sep) +'images' + (path.sep);
console.log(uploaddir)
var multer  = require('multer');
var upload = multer();

var app = express();


// connection setup 
var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.set('port', process.env.PORT || 8080);

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit: 1000000}));
app.use(cookieParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//connection peer

app.use(
connection(mysql,{

    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'node'
    }, 'pool')

);


app.get('/users', users.list);
app.post('/users/login', users.login);
//app.get('/users/add',users.add);
app.post('/users/add', users.save);
app.delete('/users/:id', users.delete);
app.get('/users/:id', users.getbyid);
app.put('/users/:id', users.save_edit);


app.get('/category', category.category_list);
app.get('/category/add', category.add);
app.post('/category', category.category_save);
app.delete('/category/:id', category.category_delete);
//app.get('/category/edit/:id', category.category_edit);
app.put('/category/:id', category.category_save_edit);

app.get('/product', product.product_list);
app.get('/product/add', product.add);
app.post('/product/add', product.product_save);
app.get('/product/delete/:id', product.product_delete);
app.get('/product/edit/:id', product.product_edit);
app.post('/product/edit/:id', product.product_save_edit);


//app.post('/upload', upload.single('image'), image.uploadImage);

app.post('/upload', upload.single('image'), function(req,res){

    console.log('req.body');
    console.log(req.body);
    //console.log(req.files);
    var file = req.file;
    var filename = file.originalname;
    fs.writeFile(uploaddir+filename, file.buffer);
    res.send({
        status: '1',
        message: 'Attachment uploaded'
    });
});


app.post('/image/add', upload.single('image'), function(req,res) {
        console.log(req.body);

});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);

        console.log(err.message);
        /*
        res.render('error', {
            message: err.message,
            error: err
        });
        */
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    console.log(err.message);
    /*
    res.render('error', {
        message: err.message,
        error: {}
    });
    */
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





