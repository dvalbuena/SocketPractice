// enum
var red = 1, blue = 2, empty = 3;
var turn = red;


var socket = io();
//socket.emit('assignToken', turn);

function updateGrid(moveJSON, isBroadcast) {
    if(moveJSON.valid) {
        console.log("#" + moveJSON.move);
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

socket.on('move', function(moveJSON) {
    console.log("Received move event", moveJSON);
    if(moveJSON.valid) {
        updateGrid(moveJSON, true);   
    }
});

socket.on('winner', function(turn) {
  window.alert("Player " + turn + "wins");
});

socket.on('move2', function(moveJSON) {
    
    if(moveJSON.valid) {      
        updateGrid(moveJSON, false);
    } else {
        window.alert("It is not your turn");
    }
    


});

//include a message to tell the user that the room is full
socket.on('denied', function () {
    //disable the ability to click on the grid
    $("div.c4-control div.piece").style.pointerEvents = 'none';
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
//var possiblemoves = [0.1,2,3,5,6];
//var setTime = 7000;
$("div.c4-control div.piece").click(function () {
    var column = parseInt($(this).attr("id"));
    /* for (var row = 6; row > 0; row--) {
        var id = '#' + row + column;
        if ($(id).attr("class") === undefined) {
            if (turn == red) {
                $(id).addClass("piece").addClass("red");
                //turn = blue;
            }
            else {
                $(id).addClass("piece").addClass("blue");
                //turn = red;
            }

            if (row === 1) {
                $("#" + column).removeClass("piece");
            }

            break;
        }
    } */
  //  setTime = 7000;
    $(this).removeClass("red").removeClass("blue");
    var moveJSON = {'color': turn, 'column':column };
    // alert("click " + JSON.stringify(moveJSON));
    socket.emit('validateMove', moveJSON);
});

//if no button is click set start the timer countdown

/*setInterval(computermove,setTime);

function computermove(){
var compmove = Math.floor((Math.random()* possiblemoves.length));
var compChoice = possiblemoves[compmove];
console.log("this is random comp move " + compChoice);
//remove choice from the array

    $(this).removeClass("red").removeClass("blue");
    var moveJSON = {'color': turn, 'column':compChoice };
    // alert("click " + JSON.stringify(moveJSON));
    socket.emit('validateMove', moveJSON);
    //possiblemoves.splice(compmove,1);
};*/