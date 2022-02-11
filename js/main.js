
const names = [ "Rock", "Paper", "Scissors" ];

const plays = {
	1: 1,
	2: 0,
	3: 2
};

const score = { 
	'player': 0, 
	'computer': 0,
	'tie': 0
};

const x = [];
const y = [];

let i = 0,
		tmpMove = [],
		middle,
		lastWinner,
		lastMove,
		scoreResults;

const nn = new MLP( 3, 3, 3, 0.1, 300 );

let computerScore, playerScore;
let computerPlay, playerPlay;
let computerDiv, playerDiv;
let menu, result, finalScore;

let gameOver = false;

const play = function(player){
	if(!gameOver){
		clearBoard();
		const move = Array(3).fill(0);
		move[player] = 1;
		tmpMove.push( move );
		if( tmpMove.length == 2 ){
			x.push( tmpMove.shift() );
			y.push( tmpMove[0] );
		}
		let computer;
		if( y.length < 3 ){
			computer = Math.floor( Math.random() * 3 );
		}else{
			let prediction = nn.predict( lastMove ).data;
			computer = (prediction.indexOf(Math.max(...prediction)) + 1) % 3;
			if( lastWinner !== 'computer' ){ 
				nn.shuffle( x, y );
				nn.fit( x, y );
			}
		}
		const win = plays[player+computer];
		lastWinner = player === computer || win === undefined ? 'tie' : win === player ? 'player' : 'computer';
		score[lastWinner]++;
		updateScore(player, computer, lastWinner);
		lastMove = move;
	}
}

const updateScore = function(p, c, w){
	playerPlay.innerHTML = "&#" + (9994 + p) +";";
	computerPlay.innerHTML = "&#" + (9994 + c) +";";
	switch (w) {
		case 'player':
			playerDiv.classList.add("winnerp");
			playTone('F3','sine', .8);
			break;
		case 'computer':
			computerDiv.classList.add("winnerc");
			playTone('A2','sine', .8);
			break;
		case 'tie':
			playerDiv.classList.add("tie");
			computerDiv.classList.add("tie");
			playTone('C3','sine', .8);
			break;
	}
	//setTimeout(()=>clearBoard(),1000);
	computerScore.style.width = score.computer * 2 + "%";
	computerScore.setAttribute("aria-valuenow", score.computer);
	computerScore.innerHTML = score.computer;
	playerScore.style.width = score.player * 2 + "%";
	playerScore.setAttribute("aria-valuenow", score.player);
	playerScore.innerHTML = score.player;
	
	if(score.computer == 50){
		gameOver = true;
		menu.classList.toggle("hidden");
		result.innerHTML = "O Computador venceu!";
		finalScore.innerHTML = score.computer + " x " + score.player;
	}
	if(score.player == 50){
		gameOver = true;
		menu.classList.toggle("hidden");
		result.innerHTML = "Voce venceu!";
		finalScore.innerHTML = score.player + " x " + score.computer;
	}

	return;
	for(let player of Object.keys(score) ){
		scoreResults[player].innerHTML = player+"<br>"+score[player];
	}
	middle.innerHTML = names[p]+" x "+names[c]+"<br>"+w;
}

const clearBoard = function(){
	playerDiv.classList.remove("winnerp");
	playerDiv.classList.remove("tie");
	computerDiv.classList.remove("winnerc");
	computerDiv.classList.remove("tie");
}

const restart = function(){
	gameOver = false;
	menu.classList.toggle("hidden");
	score.player = 0;
	score.computer = 0;
	computerScore.style.width = score.computer * 2 + "%";
	computerScore.setAttribute("aria-valuenow", score.computer);
	computerScore.innerHTML = score.computer;
	playerScore.style.width = score.player * 2 + "%";
	playerScore.setAttribute("aria-valuenow", score.player);
	playerScore.innerHTML = score.player;
}
const init = function(){
	computerScore = document.querySelector("#computerscore");
	playerScore = document.querySelector("#playerscore");
	computerDiv = document.querySelector("#computerdiv");
	playerDiv = document.querySelector("#playerdiv");
	computerPlay = document.querySelector("#computerplay");
	playerPlay = document.querySelector("#playerplay");
	menu = document.querySelector("#menu");
	result = document.querySelector("#result");
	finalScore = document.querySelector("#finalscore");
	
}

init();
