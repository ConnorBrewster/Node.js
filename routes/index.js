const db = require('./config');
let session = require('express-session');
module.exports = {
    homePage: (req, res) => {
            res.render('index.ejs', {
                message: '',
				regmessage:''
        });  
    },
	addUser: (req, res) => {
		 var users ={
        "userName":req.body.userName,
        "password":req.body.password,
        "firstname":req.body.firstname,
        "lastname":req.body.lastname
		}
		let usernameQuery = "SELECT * FROM `users` WHERE userName = '" + users.userName + "'";
        db.query(usernameQuery, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length > 0) {
                regmessage = 'Username already exists';
				message = '';
                res.render('index.ejs', {
                    regmessage,
					message,
                });
			}else
			{
				let usersQuery =  "INSERT INTO `users` (userName, password, firstname, lastname) VALUES ('" +
								users.userName + "', '" + users.password + "', '" + users.firstname + "', '" + users.lastname + "')";
					db.query(usersQuery, (err, result) => {
                        if (err) {
                            regmessage = 'Query ERROR'
                        }else{
							regmessage = 'User Registered Successfully';
							message = '';
							res.render('index.ejs', {
							regmessage,
							message,
							});
						}
                    });
			}
		});
	},

	 authUser: (req, res) => {
		 let sess = req.session;
		 let userName = req.body.userName
		 let password = req.body.password
		 let nameQuery = "SELECT * FROM `users` WHERE userName = '" + userName + "'";
		 
		 db.query(nameQuery, (err, result) => {
		 if (err) {
                console.log(err);
            }
            if (result.length > 0) {
				dbpassword = result[0].password;
					if(password==dbpassword){
						let postsQuery = "SELECT posts.post,posts.date,posts.post_id,users.userName,likes.likeID, COUNT(likes.post_id) as LikeCount FROM likes RIGHT OUTER JOIN posts ON (likes.post_id=posts.post_id) INNER JOIN users ON (posts.user_id = users.userID) GROUP BY posts.post ORDER BY posts.post_id DESC"
						message = 'Logged in';
						regmessage = '';
						let postcontent =[]
						let errmessage = ''
						users = result[0];
						sess.users = users;
						db.query(postsQuery, (err, result) => {
							if (err) {
								console.log(err)
							}else{
								let errmessage = ""
								res.render('dashboard.ejs',{
									message,
									users,
									regmessage,
									errmessage,
									postcontent:result
								});
								
							}
						});
					}else{
						message = "Username or password don't match."
						regmessage = ''
						res.render('index.ejs', {
							message,
							regmessage,
						});
					}	
			}
		});
	}
}