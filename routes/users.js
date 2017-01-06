//var now = require("date-now");
var validator = require('validator');
//var Isemail = require('isemail');
var moment = require('moment-timezone');
//var validate = require('/valiation');

var dateTime = require('date-time');
var md5 = require('md5');
module.exports.list = function(req, res) {

	req.getConnection(function(err, connection) {
		if(connection) {
			var query = connection.query('select id,firstname,lastname,email,gender,dob from user ', function(err, rows) {
				if(!rows.length) {
					res.status(404).json({err});
				} else {
					rows.forEach(function(obj){
						var a = moment.tz(obj.dob, "YYYY-MM-DD", "Asia/Kolkata");
						obj.dob = a.format("YYYY-MM-DD");
					});
					res.json({"error":false,"message":"success","users": rows});
				}
			});
		} else {
			res.status(500).json({"error":"connection error"});
		}
	});
}




//add user form//

module.exports.add = function(req, res) {
	res.render('adduser.ejs',{page_title:"Add User - E-Commerce"});
}




//adding user in database//

module.exports.save = function(req, res) {
	var flag = 1;
	var input = JSON.parse(JSON.stringify(req.body));
	var validation = validate(input,res,flag);
	if(validation == 1) {
		var valid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
		var email = validator.isEmail(req.body.email);
		var password = validator.matches(req.body.password, valid);
		if(email === true && password === true) {
			req.getConnection(function(err, connection) {
				if(connection) {
					var data = {
						firstname 	: req.body.firstname,
						lastname    : req.body.lastname,
						email 		: req.body.email,
						password    : md5(req.body.password),
					    gender   	: req.body.gender,
					    dob 		: req.body.dob
					}
					var defaultquery =  connection.query('select * from user where email = ?', [data.email], function(err, rows) {
						if(err) {
							res.status(500).send(err);
						} else {
							var query = connection.query('insert into user set ?',data, function(err, rows) {
								if(err) {
									res.status(400).json(err);
								} else {
									res.json({"error":false,"message":"success","user": rows});
								}
							});
						}
					});
				} else {
					res.status(500).json({"error":"connection error"});
				}
			});
		} else {
			res.json({"error":"invalid email id or password"});
		}
	}

}



//login user//

module.exports.login = function(req, res) {
	var valid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
	var email = validator.isEmail(req.body.email);
	var password = validator.matches(req.body.password, valid);
	if(email === true && password === true) {
		req.getConnection(function(err, connection) {
				if(connection) {
					var password = md5(req.body.password).toString();
					var query = connection.query('select id,firstname,lastname,email,gender,dob from user where email = \''+req.body.email+'\' and password = \''+password+'\';', function(err, rows) {	
					if(rows.length) {
						rows.forEach(function(object){
							var a = moment.tz(object.dob, "YYYY-MM-DD", "Asia/Kolkata");
							object.dob = a.format("YYYY-MM-DD");
						});
						res.json(rows);
					} else {
						res.status(404).json({'error':"data not found"});
					}	
				});
			} else {
				res.status(500).json({"error":"connection error"});
			}
		});
	} else {
		res.status(401).json({"error":"invalid email id or password"});
	}
}



//editing the user data//

module.exports.getbyid = function(req, res) {

	var id = req.params.id;

	req.getConnection(function(err, connection) {
		if(connection) {
			var query = connection.query('select * from user where id = ?', [id] , function(err, rows) {
				if(rows.length) {
					rows.forEach(function(object){
						var a = moment.tz(object.dob, "YYYY-MM-DD", "Asia/Kolkata");
						object.dob = a.format("YYYY-MM-DD");
					});
					res.json({"error": false, "message":"sucess", "user":rows});
				} else {
					res.status(404).json({'error':"data not found"});
				}
			}); 
		} else {
			res.status(500).json({"error" : "connection error"});
		}
	});
}


	
//updating user data//

module.exports.save_edit = function(req, res) {
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		if(connection) {
			var userdata = req.body;
			connection.query("update user set ? where id = ?",[userdata,id], function(err, rows) {
				if(rows.affectedRows > 0) {
					res.json({"error": false, "message": "sucess", "updatedRows":rows.affectedRows});
				} else {
					res.status(404).json({"error":"data not found"});
				}
			});
		} else {
			res.status(500).json({"error":"connection error"});
		}
	});
		
}



//deleting user data//

module.exports.delete = function(req, res) {
	var id  = req.params.id;
	//console.log(id);
	req.getConnection(function(err, connection) {
		connection.query("delete from user where id = ?",[id], function(err, rows) {
			if (err) {
				res.status(404).json(err);
			} else {
				//console.log(rows);
				res.json({"error": false, "message": "sucess", "deletedRows":rows.affectedRows});
			}
		});
	});
}


function validate(input,res,flag) {
	if(typeof input.firstname == 'undefined') {
		flag = 0;
		res.status(401).json({
			status: -2,
			message: "firstname is not defined."
		});
	} else if(input.firstname.trim().length <= 0){
		flag = 0;
		res.status(401).json({
			status: -2,
			message: "firstname should be there."
		});
	}
	return flag;	
}


