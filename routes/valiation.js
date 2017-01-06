 var fun = function fnction1() {
	return {
		validation: function(req,res,next) {
			if(typeof req.body.firstname === 'undefined') {
				res.status(401).json({
					status: -2,
					message: "firstname is not defined."
				});
			} else if(req.body.firstname.trim().length <= 0){
				res.status(401).json({
					status: -2,
					message: "firstname should be there."
				});
			}
			next();
		}	
	}
}
module.exports = fun;