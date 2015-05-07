// enum
var red = 1, blue = 2, empty = 3;
var turn = red;
var isOver = false;

var socket = io();
//socket.emit('assignToken', turn);

function updateGrid(moveJSON, isBroadcast) {
    if(moveJSON.valid) {
        if(moveJSON.turn === red) {
            $("#" + moveJSON.move).addClass("piece").addClass("red");
            if(isBroadcast === true) {
                turn = blue;
            }
        } else {
            $("#" + moveJSON.move).addClass("piece").addClass("blue");
            if(isBroadcast === true) {
                turn = red;
            }
        }
    } 
}

//disable the ability to click on the grid
function blockClick() {
    $(".piece").css( 'pointer-events', 'none' );
}

socket.on('move', function(moveJSON) {
    var isBroadcast = true;
    if(moveJSON.valid) {
        updateGrid(moveJSON, isBroadcast);   
    }
});


socket.on('move2', function(moveJSON) {
    var isBroadcast = false;
    if(moveJSON.valid) {      
        updateGrid(moveJSON, isBroadcast);
    } else {
        window.alert("Invalid move");
    }
    
});

socket.on('winner', function(turn) {
  isOver = true;
  console.log("winner is called o client side");
  $("body .message p").text("Player " + turn + " win.");
  $("body .message").append($("<button>").text("click here to play again."));

  blockClick();
});

socket.on('Draw', function(draw) {
  isOver = true;
  //console.log("winner is called o client side");
  $("body .message p").text("Game is a Draw!");
  $("body .message").append($("<button>").text("click here to playe again."));

  blockClick();
});

socket.on('gameOver', function() {
    isOver = true;
    blockClick();
    $("body .message p").text("Game Over. One of the players disconnected.");
});

//include a message to tell the user that the room is full
socket.on('denied', function () {
    $("body .message p").text("This room is full. You can not play.");
    blockClick();
});


$("body .message button").on("click", function () {
    console.log("listener of button");
    $("body .message p").text(" ");
    //$("body .message button").remove();
    socket.emit("newGame");

});

$("div.c4-control div.piece").hover(
    // hover over
    function () {
        if (turn === red) {
            $(this).addClass("red");
        } else if(turn === blue) {
            $(this).addClass("blue");
        }
    },
    // hover out
    function () {
        $(this).removeClass("red").removeClass("blue");
    }
);


/*    $(this).removeClass("red").removeClass("blue");
    var moveJSON = {'color': turn, 'column':column };
    // alert("click " + JSON.stringify(moveJSON));
    socket.emit('validateMove', moveJSON);
});*/

//var possiblemoves = [0,1,2,4,3,5,6];
//var setTime = 7000;

//click even to drop the token
$("div.c4-control div.piece").click(function () {
    var column = parseInt($(this).attr("id"));

    setTime = 7000;
    //reset time if player makes a move.
    
    //socket.emit("timer",setTime);
    $(this).removeClass("red").removeClass("blue");
    var moveJSON = {'color': turn, 'column':column };
    // alert("click " + JSON.stringify(moveJSON));
    socket.emit('validateMove', moveJSON);
});

//if no button is click set start the timer countdown

//setInterval(computermove,setTime);
/*
function computermove(){
var compmove = Math.floor((Math.random()* possiblemoves.length));
var compChoice = possiblemoves[compmove];
console.log("this is random comp move " + compChoice);
//remove choice from the array

    $(this).removeClass("red").removeClass("blue");
    var moveJSON = {'color': turn, 'column':compChoice };
    // alert("click " + JSON.stringify(moveJSON));
    if(!isOver) {
        socket.emit('validateMove', moveJSON);
        //possiblemoves.splice(compmove,1);
    }
    
};*/