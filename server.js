const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mysql = require('mysql');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const db = require('./routes/config');

const {homePage, addUser, authUser} = require('./routes/index');
const {dashboard, logout, makepost} = require('./routes/dashboard');
const port = 8080;
let socketCount = 0
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));
app.set('port', process.env.port || port); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(fileUpload()); 


app.get('/',homePage,);
app.get('/dashboard', dashboard);
app.post('/',addUser);
app.post('/dashboard',authUser);
app.get('/logout',logout);

app.post('/mpost', (req, res) => {
  let post = req.body.m;
  let user = req.session.users;
  let date = new Date().toLocaleString();
  io.emit('call progress event', {post, user, date})
 let usersQuery =  "INSERT INTO `posts` (user_id, post,date) VALUES ('" + user.userID + "', '" + post + "', '" + date + "')";
					db.query(usersQuery, (err, result) => {
                        if (err) {
                            console.log(err)
                        }else{	
							res.status(204).send();
						}
				})
	});

app.post('/uplike', (req, res) => {
		 let user = req.session.users;
		 let id = req.body.id;
		 console.log("worked")
		 io.emit('up like count')
});

	io.sockets.on('connection', function(socket){
		socketCount++
		 io.sockets.emit('users connected', socketCount)
        console.log('users connected', socketCount)
    socket.on('disconnect', function() {
        socketCount--
		io.sockets.emit('users connected', socketCount)
        console.log('users connected', socketCount)
    })
	
	
})
http.listen(port,'localhost', () => {
    console.log(`Server running on port: ${port}`);
});