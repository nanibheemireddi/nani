
var dateTime = require('date-time');
var fs = require("fs");
var sizeOf = require('image-size');

//listing products//

module.exports.product_list = function(req, res) {

	req.getConnection(function(err, connection) {
		var query = connection.query('select p.*, c.name as categoryName from product as p left join category as c on p.categoryid = c.categoryid', function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				//console.log(rows)
				res.render('product', {page_title: "Products - E-commerece", data:rows});
			}
		});
	});
}

//add product//

module.exports.add = function(req, res) {
	req.getConnection(function(err, connection) {
		var query = connection.query('select name, categoryid from category where status = "active"', function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.render('addproduct.ejs',{page_title:"Add Product - E-Commerce", data: rows});			
			}
		});
	});
	
}


//adding category in database//

module.exports.product_save = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	//console.log(input);
	req.getConnection(function(err, connection) {
		var data;
		fs.open("./public/images/", 'r', function (status, fd) {
      if (status) {
          console.log(status.message);
          return;
      }
      console.log(fd);
		var stats = fs.statSync("./public/images/" + input.image);
      	var fileSize = stats["size"];
        var buffer = new Buffer(fileSize);

      });

		if(input.status === 'active') {
			data = {
				categoryid 	  : input.categoryid,
				Name          : input.name,
				Description   : input.description,
				Price		  : input.price,
				Quantity  	  : input.quantity,
				//Image         : input.image,
				Status		  : input.status

			}
		} else {
			data = {
				categoryid 	  : input.categoryid,
				Name          : input.name,
				Description   : input.description,
				Price		  : input.price,
				Quantity  	  : input.quantity
				//Image         : input.image

			}
		}
	
		
		var query = connection.query('insert into product set ?', data, function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/product');
			}
		});
	});
}

//editing the product data//

module.exports.product_edit = function(req, res) {
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		var query = connection.query('select * from product where productid = ?', [id],  function(err, rows) {
			if(err) {
				//console.log('hlllo');
				console.log(err);
			} else {
				//console.log('haiiiii')
				var queryCategory = connection.query('select name, categoryid from category where status = "active"', function(errCategory, rowsCategory) {
					if(errCategory) {
						console.log(errCategory);
					} else {
						res.render('editproduct.ejs', {page_title: "Edit Products - E-Commerce" , data:rows, dataCategory : rowsCategory});
					}
				});
			}
		});
	});
}


//updating Products data//

module.exports.product_save_edit = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		var categorydata;
		var statusNew = 'inactive';
		if(input.status && input.status == 'active'){
			statusNew = 'active';
		}

		if(input.myimage !== ''){
			productsdata = {
				categoryid 	  : input.categoryid,
				Name          : input.name,
				Description   : input.description,
				Price		  : input.price,
				Quantity  	  : input.quantity,
				image         : input.myimage,
				Status		  : statusNew,
			    updatedon   : dateTime(new Date(), {local: true})
			}
		} else {
			productsdata = {
				categoryid 	  : input.categoryid,
				Name          : input.name,
				Description   : input.description,
				Price		  : input.price,
				Quantity  	  : input.quantity,
				Status		  : statusNew,
				updatedon   : dateTime(new Date(), {local: true})
			}
		}
var fileName = "foo.txt";		
fs.exists(fileName, function(exists) {
  if (exists) {
    fs.stat(fileName, function(error, stats) {
      fs.open(fileName, "r", function(error, fd) {
        var buffer = new Buffer(stats.size);

        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
          var data = buffer.toString("utf8", 0, buffer.length);

          console.log(data);
          fs.close(fd);
        });
      });
    });
  }
});



			
		connection.query("update product set ? where productid = ?",[productsdata,id], function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/product');
			}
		});
	});
}


//deleting category data//

module.exports.product_delete = function(req, res) {
	var id  = req.params.id;
	//console.log(id);
	req.getConnection(function(err, connection) {
		connection.query("delete from product where productid = ?",[id], function(err, rows) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/product');
			}
		});
	});
}