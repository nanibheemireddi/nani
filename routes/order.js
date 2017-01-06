var dateTime = require('date-time');
var products;


//listing products//

module.exports.order_list = function(req, res) {

	req.getConnection(function(err, connection) {
		var query = connection.query('select o.totalprice,orderid as orderid,o.status,o.orderdate,u.name as user,p.name as product,c.name as Category FROM `order`as o LEFT JOIN user as u on o.userid=u.userid LEFT JOIN product as p on o.productid=p.productid LEFT JOIN category as c on p.categoryid=c.categoryid', function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				//console.log(rows)
				res.render('order', {page_title: "Orders - E-commerece", data:rows});
			}
		});
	});
}

//add order//

module.exports.add = function(req, res) {
	req.getConnection(function(err, connection) {
		var productquery = connection.query('select name, productid, price, quantity from product where status = "active"', function(producterr, productrows) {
			if(producterr) {
				console.log(producterr);
			} else {
				products = productrows; 
				var userquery = connection.query('select name, userid from user', function(usererr, userrows) {
					if(usererr) {
						console.log(usererr);
					} else {
						res.render('addorder.ejs',{page_title:"Add Product - E-Commerce", userdata: userrows, productdata: productrows});			
					}
				});
			}
		});
	});
}	

//adding order in database//

module.exports.order_save = function(req, res) {
	var relatedproducts = {};
	var input = JSON.parse(JSON.stringify(req.body));
	//console.log(input);
	for(var i = 0; i < products.length; i++ ) {
		if(products[i].productid == input.productid) {
			relatedproducts = {
				productid      : products[i].productid,
				productprice   : products[i].price,
				productquantity: products[i].quantity

			}	
		}
	}
	//console.log(products);
	//console.log(relatedproducts);
	//console.log(relatedproducts.quantity);
	var status;
	var newprice = (relatedproducts.productprice)*(input.quantity);
	if(relatedproducts.productquantity <= input.quantity) {
		status = 'pending';
	} else {
		status = 'completed';
		req.getConnection(function(err, connection) {
			var data = {
				quantity:relatedproducts.productquantity - input.quantity
			}
			var query = connection.query("UPDATE product set ? WHERE productid = ? ",[data,relatedproducts.productid], function(err, rows) {
				if(err) {
					//console.log('haiiii')
					console.log(err);
				} else {
					console.log('updated sucessfully');
					//console.log(rows);
				}
			});
		});
	}

	req.getConnection(function(err, connection) {
		
		var	productdata = {
					productid 	  : input.productid,
					userid        : input.userid,
					quantity   	  : input.quantity,
					baseprice	  : relatedproducts.productprice,
					totalprice    : newprice,
					status		  : status
			}

			var productquery = connection.query("INSERT INTO `order` set ? ", [productdata], function(err, rows) {
				if(err) {
					//console.log('haiiii')
					console.log(err);
				} else {
					//console.log(rows);
					res.redirect('/order');
				}
			});
		});
	}


//deleting order//

module.exports.order_delete = function(req,res){
	 //console.log('orderid');	

          
    var orderid = req.params.id;  
    req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM `order` WHERE orderid = ? ",[orderid], function(err, rows)
        {
            
            if(err){
                console.log("Error deleting : %s ",err );
            }
            //console.log(orderid);	
            res.redirect('/order');
             
        });
        
     });
}

module.exports.update = function(req, res){
	console.log('haiiii');
	res.render('update.ejs');
}


