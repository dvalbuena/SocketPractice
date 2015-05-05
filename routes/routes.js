// Use router from express.
var express = require('express');
var router = express.Router();

// Use the data file to find user information.
var appdata = require('../data.json');

// Start without an active user.
var currentuser = null;

// Authentication for logging in.
function authenticate(email, password) {
	// Grab the list of users and their information.
	var users = appdata.users;
	// Find the user who is logging in.

	//filter sample from stackoverflow http://stackoverflow.com/questions/2722159/javascript-how-to-filter-object-array-based-on-attributes
	var loginuser = users.filter(
		// If the user email and password both match, return true.
		function(user){ 
			return user.email === email && user.password === password 
		}
	)[0];
	// If loginuser returns undefined, return false.
	if(loginuser === undefined) {
		return false;
	}
	// Otherwise, log the user in.
	else {
		currentuser = loginuser;
		return true;
	}
}
// router.get('/connect4', function(req, res) {
// 	res.render('connect4', {"pagetitle": "Play Connect4"});
// });
// /* POST login form. */
// 	router.post("/", function (req, res) {
// 	var users = appdata.users;
// 	//find and see if the user in in the data.json
// 	users.findOne({email: req.body.email}, function(err, user) {
// 		if (err || !user) {
// 			console.log("check if user exist");
// 			req.session.isAuthorized = false;
// 			console.log("User Not Found - isAuthorized: " + req.session.isAuthorized);
// 			return res.redirect("/login");
// 		} else {
// 			if(user.password === req.body.password) {
// 				req.session.isAuthorized = true;
// 				req.session.email = user.email;
// 				console.log("user exist" + user.email);
// 				return res.redirect("/connect4");
// 			} else {
// 				req.session.isAuthorized = false;
// 				console.log("Incorrect Password - isAuthorized: " + req.session.isAuthorized);
// 				return res.redirect("/login");
// 			}
// 		}
// 	});
// });

// route to login since index do not have anything on there so when the user type in it reached into the login page
/*router.get('/', function(req, res) {
	res.render('login', {"pagetitle": "Login"});
});

// Route to the login page.
router.get('/login', function(req, res) {
	res.render('login', {"pagetitle": "Login"});
});*/

router.get('/connect4', function(req, res) {
	res.render('connect4', {"pagetitle": "Play Connect4"});
});

module.exports = router;