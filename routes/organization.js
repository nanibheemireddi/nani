
var moment = require('moment-timezone');


//adding organizationTypeMaster in database//

module.exports.organizationType = function(req, res) {

	var a = moment.tz("Europe/London");
	console.log(a);
	req.getConnection(function(err, connection) {
		if(connection) {
			var data;
			if(req.body.status === 0 ) {
				data = {
					name          : req.body.name,
					status		  : 0,
					createdBy     : req.body.createdBy,
					updatedBy 	  : req.body.updatedBy
				}
			} else {
				data = {
					name          : req.body.name,
					createdBy     : req.body.createdBy,
					updatedBy 	  : req.body.updatedBy
				}
			}
			
			var query = connection.query('insert into OrganizationTypeMaster set ?', data, function(err, rows) {
				if(err) {
					console.log("hello");
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