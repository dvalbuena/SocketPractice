// enum
var red = 1, blue = 2, empty = 3;
var turn = red;


var socket = io();
//socket.emit('assignToken', turn);



socket.on('move', function(moveJSON) {
    console.log("Received move event", moveJSON);
    if(moveJSON.valid) {
        console.log("#" + moveJSON.move);
        if(moveJSON.turn === red) {
            $("#" + moveJSON.move).addClass("piece").addClass("red");
            turn = blue;
        } else {
            $("#" + moveJSON.move).addClass("piece").addClass("blue");
            turn = red;
        }
    } else {
        window.alert("Invalid Move");
    }
});



//socket.on()

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
    
    $(this).removeClass("red").removeClass("blue");
    var moveJSON = {'color': turn, 'column':column };
    // alert("click " + JSON.stringify(moveJSON));
    socket.emit('validateMove', moveJSON);
});
