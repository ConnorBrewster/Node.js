const db = require('./config');
let session = require('express-session');
module.exports = {
    dashboard: (req, res) => {
		if (!req.session.users) {
			res.send('You are not authorized to view this page');
			}else {
						let errmessage = ""
						res.render('dashboard.ejs',{
							errmessage,
							postcontent: ""
					})
					
				}
	},
	
	logout: (req, res) => {
		req.session.destroy(function(err) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/');
			}
		});
	},
	
};
  
