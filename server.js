var express = require('express');
var bodyParser = require('body-parser');
//var path = require("path");
var routes = require('./routes/routes');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require("mongoose");





app.use(bodyParser.urlencoded({ extended: true }));


// view engine setup
//app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

// enum
var red = 1, blue = 2, empty = 3;
var turn = red;

var height = [5, 5, 5, 5, 5, 5, 5];

//set up board for connect 4 
var grid = [[empty,empty,empty,empty,empty,empty],
			[empty,empty,empty,empty,empty,empty],
			[empty,empty,empty,empty,empty,empty],
			[empty,empty,empty,empty,empty,empty],
			[empty,empty,empty,empty,empty,empty],
			[empty,empty,empty,empty,empty,empty],
			[empty,empty,empty,empty,empty,empty]];
			
//console.log(grid[0][0]);
//console.log(grid[6][0]);
//console.log(grid[0][5]);
//console.log(grid[6][5]);
var playerturn = {};
var maxUsers =0;
io.on('connection', function(socket) {
    console.log('a user connected');
    
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

	//assign token for user blue or red
/*	socket.on('assignToken', function(turn){
		socket.turn = turn;
		//add user to the list of turn
		playerturn[turn] = turn;
		++maxUsers;
		
	});

	//echo the a player has been assigned a token
	socket.broadcast.emit('user joined', {
		playerturn: socket.turn,
		maxUsers: maxUsers
	})*/


    socket.on('validateMove', function(moveJSON) {
    	console.log(JSON.stringify(moveJSON));
    	
    	if(moveJSON.color === turn && height[moveJSON.column] < 6) {
    		var x = moveJSON.column;
    		var y = height[moveJSON.column];
    		var move = x.toString() + y.toString();
    		
    		grid[x][y] = turn;
    		
    		console.log("this is grid: "+ grid[x][y]);
    		
    		var responseJSON = {'turn':turn, 'valid':true, 'move':move};
    		console.log("RESPONSE:" + JSON.stringify(responseJSON));
    		
    		socket.broadcast.emit('move', responseJSON);
    		socket.emit('move', responseJSON);

    		height[moveJSON.column]--;
    		
    		if(turn === red) {
    			turn = blue;
    		} else if(turn === blue) {
    			turn = red;
    		}
    		
    	} else {
    		var responseJSON = {'turn':turn, 'valid':false};
    		console.log("RESPONSE:" + JSON.stringify(responseJSON));
    		
    		socket.broadcast.emit('move', responseJSON);
            socket.emit('move', responseJSON);
    	}
    });
});


// Create user session
/*app.use(session({
	secret: "f4tk4t4u",
	resave: true,
	saveUninitialized: true
}));*/

app.use('/', routes);


/*/ catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});*/


var server = http.listen(process.env.PORT, process.env.IP, function() {
	console.log('Cloud9');
});

/*
var server = app.listen(3000, function() {
	console.log('Listening on port 3000');
});
*/