/*
*  
*
*    ______   ______     ______     ______     ______     __  __     ______     ______    
*   /\  ___\ /\  __ \   /\  __ \   /\  ___\   /\  == \   /\ \/\ \   /\___  \   /\___  \   
*   \ \  __\ \ \ \/\ \  \ \ \/\ \  \ \___  \  \ \  __<   \ \ \_\ \  \/_/  /__  \/_/  /__  
*    \ \_\    \ \_____\  \ \_____\  \/\_____\  \ \_____\  \ \_____\   /\_____\   /\_____\ 
*     \/_/     \/_____/   \/_____/   \/_____/   \/_____/   \/_____/   \/_____/   \/_____/ 
*
*       An IoT connected foosball table powered by Watson IoT, Cloudant, and Node-RED
*/

/*eslint-env browser, jquery*/
/*globals Timeline timeline:true*/

// CONNECT TO SOCKET /////////////////////////////////////////////////////////////////////////////
var socketaddy = "wss://" + window.location.host + "/ws/game";
console.log(socketaddy);

// You will need to know which sensor maps to which team color.
var team1 = 'Yellow'; //TODO Change to match your Team One color
var team2 = 'Black'; //TODO Change to match your Team Two color

// Declare user information variables
var userOne;
var userTwo;
var userOnePhoto;
var userTwoPhoto;
var timeline_data;

// Main javascript for handling game events, login, tweets, and league rendering
$(document).ready(function() {
    
    socketConnect();

    //Disable reset game on page load
    $("#end").hide();
    $("#rematch").hide();

    //Declare variables
    var currentDate = new Date();
    var servOne;
    var servTwo;
    var shooter;
    var team;
    var gameActive;
    var goalOne;
    var goalTwo;

    //Variable for probability
    var probTeamOne;
    var flip;

    //Initiate first element in timeline
    timeline_data = [{
        date: new Date(),
        title: ' ',
        content: 'Welcome to Foosbuzz, powered by Bluemix!'
    }];
    reloadTimeline();

    //Get initial probability	
    $.get('/probability', function(res) {
        probTeamOne = res.probTeamOne;
        flip = res.flip;
        
        if (probTeamOne === null) {
                console.log("Probability is undefined");
        } else if (flip===true){
                $('#probTeamTwo').html((probTeamOne[0][0] * 100).toFixed(1) + "%");
                $('#probTeamOne').html(((1 - probTeamOne[0][0]) * 100).toFixed(1) + "%");
                $('#probval').show();
        } else {
                $('#probTeamOne').html((probTeamOne[0][0] * 100).toFixed(1) + "%");
                $('#probTeamTwo').html(((1 - probTeamOne[0][0]) * 100).toFixed(1) + "%");
                $('#probval').show();
        }
    });
    
    //Load the current game if one
    currentGame();
    
    /*
     *
     * RENDER THE LEAGUE TABLE USING CLOUDANT DATA
     * 
     */
     
    //League data from server
	var table = $('#leaguetable').DataTable({
		"processing": true,
		"ajax": "league",
		"iDisplayLength": 100,
		"order": [[ 8, 'desc' ],[7, 'desc' ] ], //sort by points, then GD
		"aoColumnDefs": [
			{ "sClass": "photo-column", "aTargets": [ 0 ] },
			{ "sClass": "user-column", "aTargets": [ 1 ] },
			{ "sClass": "company-column", "aTargets": [ 2 ] }
		],    
	    "bLengthChange": false,
		"columns": [
			{ data: 'photo' },
			{ data: 'username' },
			{ data: 'handle' },
			{ data: 'games' },
			{ data: 'won' },
			{ data: 'lost' },
			{ data: 'goalSpread' },
			{ data: 'goalDiff' },
			{ data: 'points' }
		],
		"fnDrawCallback" : function() {
			$(".photo-column > img").attr('height','100px');
			$(".photo-column > img").attr('width','100px');
		}
	}); 
	
	setInterval( function () {
 		table.ajax.reload();
		console.log("Reloading league");
	}, 90000 );

	$('#leaguetable tbody').on( 'click', 'tr', function () {
		console.log( table.row( this ).data() );
	});

	$.fn.dataTable.ext.errMode = 'throw';
    

    /* 
     * 
     * BROWSER BUTTON EVENTS
     * 
     */

    //End button in browser hit
    $("#end").click(function() {
        console.log("Ending Game!");
        $.get('/endGame', function() {});
    });
    
    //Rematch button hit
    $("#rematch").click(function() {
        //Disable reset game
        $("#end").show();
        $("#rematch").hide();
        $.get('/rematch', function() {});
        gameStart();
    });

    /*
     * 
     * SOCKET EVENTS	
     * 
     */
    function socketConnect(){
        var socket = new WebSocket(socketaddy);
        socket.onopen = function() {
            console.log('WebSocket Client Connected');
            currentGame();
        };
        
        socket.onmessage = function(msg) {
            var data = JSON.parse(msg.data);
            console.log(data);
        
            switch (data.type) {
                case "newGame":
                    console.log("New game started");
                    currentGame();
                break;
                case "goal":
                    console.log("Goal score received");
                    goalScored(data);
                break;
                case "gameWon":
                    console.log("Game win received");
                    gameWin(data);
                break;
                case "endGame":
                    console.log("Ending game");
                    gameEnd();
                break;
                case "LoginPlayerOne":
                    console.log("Player for team "+team1+" has logged in.");
                    LoginPlayerOne(data);
                break;
                case "LoginPlayerTwo":
                    console.log("Player for team "+team2+" has logged in.");
                    LoginPlayerTwo(data);
                break;
                case "DuplicateLogin":
                    console.log("Duplicate login detected");
                    currentGame();
                break;
            } //End switch
        };
        socket.onclose = function() {
                console.log("WebSocket not connected");
                setTimeout(socketConnect,5000);
        };
    }
    /* 
     * 
     * FUNCTIONS
     * 
     */
    function currentGame(){
        //Check if a game is open. If it is load the page with the user's data. 
        $.get('/currentGame', function(res) {

            //Same game status from server to client variable
            gameActive = res.gameActive;

            if (gameActive===true) {

                //There are players logged in
                $("#nameOne").html(res.userTeamOne);
                $("#imageOne").attr("src", res.userTeamOnePhoto);
                $("#imageOne").attr("class","avatar alt");
                $("#ScoreOne").html(res.goalsTeamOne);
                $("#nameTwo").html(res.userTeamTwo);
                $("#imageTwo").attr("class","avatar alt");
                $("#imageTwo").attr("src", res.userTeamTwoPhoto);
                $("#ScoreTwo").html(res.goalsTeamTwo);
                $('#LoginButtonOne').hide();
                $('#LoginButtonTwo').hide();
                $("#end").show();
                

                //Set the goals to the current goals from Cloudant
                goalOne = res.goalsTeamOne;
                goalTwo = res.goalsTeamTwo;

                //Get initial probability	
                $.get('/probability', function(res) {
                    probTeamOne = res.probTeamOne;
                    flip = res.flip;
                    console.log("Probability Team One: " + res);
                    //Show probability
                    if (probTeamOne === null) {
                        console.log("Probability is undefined");
                    } else if (flip===true){
                        $('#probTeamTwo').html((probTeamOne[goalOne][goalTwo] * 100).toFixed(1) + "%");
                        $('#probTeamOne').html(((1 - probTeamOne[goalOne][goalTwo]) * 100).toFixed(1) + "%");
                        $('#probval').show();
                    }else {
                        $('#probTeamOne').html((probTeamOne[goalOne][goalTwo] * 100).toFixed(1) + "%");
                        $('#probTeamTwo').html(((1 - probTeamOne[goalOne][goalTwo]) * 100).toFixed(1) + "%");
                        $('#probval').show();
                    }
                }); //End probability

                //Player One is not logged in, set to defaults
                if (res.userTeamOne === "Anonymous" || res.userTeamOne === "Incognito") {
                    userDefault(team1, "One");
                    $("#ScoreOne").html(res.goalsTeamOne);
                }

                //Player Two is not logged in, set to defaults
                if (res.userTeamTwo === "Anonymous" || res.userTeamTwo === "Incognito") {
                    userDefault(team2, "Two");
                    $("#ScoreTwo").html(res.goalsTeamTwo);
                } 
            } else {
                userDefault(team1, "One");
                userDefault(team2, "Two");
                $("#ScoreOne").html("0");
                $("#ScoreTwo").html("0");
                $("#probTeamOne").html("0.00%");
                $("#probTeamTwo").html("0.00%");
            }
        });
    }
    
    function goalScored(data) {
        servOne = data.score_TeamOne;
        servTwo = data.score_TeamTwo;
        shooter = data.shooter;
        team = data.team;
        
        //Set team name for scoring team
        if(team===1){
            team = team1;
        }
        if(team===2){
            team = team2;
        }

        $("#end").show();
        $("#ScoreOne").html(servOne);
        $("#ScoreTwo").html(servTwo);

        //Get probability	
        $.get('/probability', function(res) {
            probTeamOne = res.probTeamOne;
            flip = res.flip;
            
            console.log("Probability Team One: " + res);
            //Show probability
            if (probTeamOne === null) {
                console.log(
                    "Probability is undefined");
            } else if (flip===true){
                $('#probTeamTwo').html((probTeamOne[goalOne][goalTwo] * 100).toFixed(1) + "%");
                $('#probTeamOne').html(((1 - probTeamOne[goalOne][goalTwo]) * 100).toFixed(1) + "%");
                $('#probval').show();
            }else {
                $('#probTeamOne').html((probTeamOne[servOne][servTwo] * 100).toFixed(1) + "%");
                $('#probTeamTwo').html(((1 - probTeamOne[servOne][servTwo]) * 100).toFixed(1) + "%");
                $('#probval').show();
            }
        });

        //Display timeline event with shooter's name
        if (shooter != undefined) {
            timeline_data.push({
                date: new Date(),
                title: 'Goal!',
                content: "Team " + team + " Captain " + shooter + " scores!"
            });
            reloadTimeline();
        } else {
            //Report new score 
            timeline_data.push({
                date: new Date(),
                title: 'Goal!',
                content: team + ' team scores!'
            });
            reloadTimeline();
        }
    } //End goalScored

    //Player One has logged in, load attributes of player if an actual person
    function LoginPlayerOne(data){
        if (data.userTeamOne !== 'Incognito' || data.userTeamOne !=='Anonymous' || data.userTeamOne !== null) {
            userOne = data.userTeamOne;
            userOnePhoto = data.userTeamOnePhoto;
            $("#nameOne").html(userOne);
            $("#imageOne").attr("src", userOnePhoto);
            $("#imageTwo").attr("class","avatar alt");
            //Hide login button to prevent others from logging in
            $('#LoginButtonOne').hide();
            timeline_data.push({
                date: new Date(),
                title: 'Team ' + team1 + ' Logged In',
                content: data.userTeamOne +' playing for Team ' + team1
            });
            reloadTimeline();
        }
    }
    //Player Two has logged in, load attributes of player if an actual person
    function LoginPlayerTwo(data) {
        if (data.userTeamTwo !== 'Anonymous' || data.userTeamTwo !=='Incognito' || data.userTeamTwo !== null) {
            userTwo = data.userTeamTwo;
            userTwoPhoto = data.userTeamTwoPhoto;
            $("#nameTwo").html(userTwo);
            $("#imageTwo").attr("src", userTwoPhoto);
            $("#imageTwo").attr("class","avatar alt");
            //Hide login button to prevent others from logging in
            $('#LoginButtonTwo').hide();
            timeline_data.push({
                date: new Date(),
                title: 'Team ' + team2 + ' Logged In',
                content: data.userTeamTwo + ' playing for Team ' + team2
            });
            reloadTimeline();
        }
    }
    //Game is started either in browser or on the foosball table
    function gameStart() {
        $("#ScoreOne").html("0");
        $("#ScoreTwo").html("0");
        $("#end").show();
        //Report game start
        timeline_data.push({
            date: currentDate,
            title: 'Game Started!',
            content: 'A game has started, who will win? ' + team1 + ' or ' + team2 + '? Tweet your favorite team.'
        });
        reloadTimeline();
    }

    //Team won game
    function gameWin(data) {
        $("#ScoreOne").html(data.score_TeamOne);
        $("#ScoreTwo").html(data.score_TeamTwo);

        $("#rematch").show();
        $("#end").show();

        if (data.team === 1) {
            team = team1;
        }
        if (data.team === 2) {
            team = team2;
        }

        //Report winner
        timeline_data.push({
            date: new Date(),
            title: 'Team ' + team + ' Wins!',
            content: 'Team ' + team +' wins! Game over. Rematch?'
        });
        reloadTimeline();
    }
    
    //Game Ended
    function gameEnd() {
        $("#end").hide();
        $("#rematch").hide();
        $("#probval").hide();

        //reset Team One to defaults
        userDefault(team1, "One");
        userOne = "Captain " + team1;
        $("#ScoreOne").html("0");

        //reset Team Two to defaults
        userDefault(team2, "Two");
        userTwo = "Captain " + team2;
        $("#ScoreTwo").html("0");

        //Report game over
        timeline_data.push({
            date: new Date(),
            title: 'Game End',
            content: 'Game over! Log in to play.'
        });
        reloadTimeline();
    }
    
    //Set default parameters for each team
    function userDefault(team, text) {
        $("#name" + text).html("Captain " + team);
        $("#image" + text).attr("src", '../images/player.svg');
        $("#image" + text).attr("class","avatar");
        $('#LoginButton' + text).show();
    }
    
    //Setup for all new timeline events
    function reloadTimeline() {
        $("#timeline").load('index.html #timeline', function() {
            timeline = new Timeline($('#timeline'),
                timeline_data);
            timeline.display();
        });
    }
    
});
