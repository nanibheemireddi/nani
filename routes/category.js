 
var dateTime = require('date-time');


//listing Categories//

module.exports.category_list = function(req, res) {

	req.getConnection(function(err, connection) {
		if(connection) {
			var query = connection.query('select * from category', function(err, rows) {
				if(err) {
					res.json({err});
				} else {
					res.json({'error': false, "message":"success", rows });
				}
			});	
		} else {
			res.status(500).json({err});
		}
		
	});
}

//add category//

module.exports.add = function(req, res) {
	res.render('addcategory.ejs',{page_title:"Add Category - E-Commerce"});
}


//adding category in database//

module.exports.category_save = function(req, res) {
	req.getConnection(function(err, connection) {
		if(connection) {
			var data;
			if(input.status === 'active') {
				data = {
					Name          : req.body.name,
					Description   : req.body.description,
					Status		  : req.body.status
				}
			} else {
				data = {
					Name          : req.body.name,
					Description   : req.body.description
					
				}
			}
			
			var query = connection.query('insert into category set ?', data, function(err, rows) {
				if(err) {
					res.json({err});
				} else {
					res.json({"error": false, "message":"sucess", rows});
				}
			});
		} else {
			res.status(500).json({err});
		}
	});
}


//updating category data//

module.exports.category_save_edit = function(req, res) {
	console.log("haiii");
	var id = req.params.id;
	var body = req.body;
	req.getConnection(function(err, connection) {
		if(connection) {
			var categorydata = {};
			if(body.hasOwnProperty("name")) {
				categorydata.name = body.name.trim();
				categorydata.updatedon = dateTime(new Date(), {local: true});
			}
			if(body.hasOwnProperty("description")) {
				categorydata.description = body.description.trim();
				categorydata.updatedon = dateTime(new Date(), {local: true})
			}
			if(body.hasOwnProperty("status")) {
				categorydata.status = body.status
				categorydata.updatedon = dateTime(new Date(), {local: true})
			}
			
			//console.log(categorydata);
			connection.query("update category set ? where categoryid = ?",[categorydata,id], function(err, rows) {
				//console.log(rows);
				if(rows.affectedRows > 0) {
					res.json({'error':false, "message":"updated successfully"});
				} else {
					res.status(404).json({err})
				}
			});
		} else {
			res.status(500).json({err});
		}
	});
}


//deleting category data//

module.exports.category_delete = function(req, res) {
	var id  = req.params.id;
	req.getConnection(function(err, connection) {
		if(connection) {
			connection.query("delete from category where categoryid = ?",[id], function(err, rows) {
				if (rows.affectedRows) {
					res.json({"error": false, "message":"deleted successfully"});
				} else {
					res.json({err});
				}
			});
		} else {
			res.status(500).json({err});
		}
	});
}