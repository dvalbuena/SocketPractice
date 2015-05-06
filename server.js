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
//keep track of moves 
var columns = [[], [], [], [], [], [], []];
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
var users = [];
var sers = 0;
var id = 0;
var maxUsers = 0;

io.on('connection', function(socket) {
    
    console.log('a user connected');
    maxUsers++;
/*    socket.username = id;
    users[id] = id;
    console.log(users);
    id++;*/
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
        delete users[socket.username];
        id--;
        maxUsers--;
    });

    //call the event to disable playing for 3rd, 4th, ... users
    if(maxUsers > 2) {
        socket.emit('denied');
    }

	//assign token for user blue or red
/*	socket.on('assignToken', function(turn){
		socket.turn = turn;
		//add user to the list of turn
		playerturn[turn] = turn;
		++sers;
		
	});

	//echo the a player has been assigned a token
	socket.broadcast.emit('user joined', {
		playerturn: socket.turn,
		sers: sers
	})*/


    socket.on('validateMove', function(moveJSON) {
    	console.log(JSON.stringify(moveJSON));
    	
    	if(moveJSON.color === turn && height[moveJSON.column] < 6) {
    		//x is the column
    		var x = moveJSON.column;
    		//y is row
    		var y = height[moveJSON.column];
    		var move = x.toString() + y.toString();
    		
    		grid[x][y] = turn;
    		
    		console.log("this is grid: "+ grid[x][y]);
    		
    		var responseJSON = {'turn':turn, 'valid':true, 'move':move};
    		console.log("RESPONSE:" + JSON.stringify(responseJSON));
    		//check move status;
			moveStatus(turn,x,y);
    		socket.broadcast.emit('move', responseJSON);
    		socket.emit('move2', responseJSON);

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
            socket.emit('move2', responseJSON);
    	}
    });
});

//logic of game source http://www.codecademy.com/Smwaters/codebits/Uln4W/edit
//movestatus
var moveStatus = function(turn,col,row){
	//var lengthCol = columns[5-row].length;
	//if(lengthCol >= 6) return false;
	columns[col].push(turn);
	if(winner(turn,col,row)){
		console.log("player " + turn + " wins");
		io.emit('winner',turn);
	}
	if(columns[col].length === 6){
		checkForDraw();
	}
}


//locate the move made
var locate = function(turn, col, row) {
	
//	row = 5-row1;
	console.log("this is col " + col);
	console.log("this is row " + row);
    if((col < 0) || (col > 6)) return false;
    if((row < 0) || (row > 6 - 1)) return false;
    if(columns[col].length < (row + 1)) return false;
    return (columns[col][row] === turn);
};

//check for win
var winner = function(turn, col, row1) {
	console.log("checking for win");
	var row = 5-row1;
    if(!locate(turn, col, row)) return false;
    var direct = [[1,0], [1,1], [0,1], [1,-1]];
    var matches = 0;
    for(var i = 0; i < 4; i++) {
        for(var j = 1; ; j++)
            if(locate(turn, col+j*direct[i][0], row+j*direct[i][1])){
                matches++;
   				console.log("checking for matches" + matches);
            }
            else break;
        for(var j = 1; ; j++)
            if(locate(turn, col-j*direct[i][0], row-j*direct[i][1]))
                matches++;
            else break;
        if(matches >= 3) return true;
        matches = 0;
    }
    return false;
};

var checkForDraw = function() {
    for(var i = 0; i < columns.length; i++)
        if(columns[i].length < 6)
            return;
     //window.alert("Draw");
    // window.alert("win");
    //playing = false;
};

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


/*var server = http.listen(3000, function() {
	console.log('Cloud9');
});*/

var server = http.listen(process.env.PORT, process.env.IP, function() {
    console.log('Cloud9');
});