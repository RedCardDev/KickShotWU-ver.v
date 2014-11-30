game.module(
    'game.captain'
)
.body(function() {
    
/*
 *	A player class will hold all the current infomation for this player
 */
game.createClass('Captain', {

	Side: 'Home',	// default set player is home

	Score: 0,

	currentOffence: true,

	pile: null,	// pile stack all left cards

	Referee: 0,
	HomePass: 1,
	HomeLeftShot: 2,
	HomeRightShot: 3,
	HomeIntercept: 4,
	HomeLeftBlock: 5,
	HomeRightBlock: 6,
	AwayPass: 11,
	AwayLeftShot: 12,
	AwayRightShot: 13,
	AwayIntercept: 14,
	AwayLeftBlock: 15,
	AwayRightBlock: 16,

	cards: [],	// are we gonna create card classes to hold the values for use later?

	/* this part is easy use to determine if AI hold this kind of card,
	 * which will help to make the code much simple!!!!!!!!
	 */
	HoldReferee: [],
	HoldHomePass: [],
	HoldHomeLeftShot: [],
	HoldHomeRightShot: [],
	HoldHomeIntercept: [],
	HoldHomeLeftBlock: [],
	HoldHomeRightBlock: [],
	HoldAwayPass: [],
	HoldAwayLeftShot: [],
	HoldAwayRightShot: [],
	HoldAwayIntercept: [],
	HoldAwayLeftBlock: [],
	HoldAwayRightBlock: [],

	LastPick: null,	// hold last card Player used
 	
 	GoalThisTurn: false,

	init: function(HomeSide){
		console.log('Current player side:' + HomeSide);
		if(HomeSide){
			this.Side = 'Home';
			this.switchToOffence();
			this.homeCaptain();
			this.pile = new game.Pile('Home', this.cards);
		}else{
			this.Side = 'Away';
			this.switchToDeffence();
			this.awayCaptain();
			this.pile = new game.Pile('Away', this.cards);
		}
		// testing
		for(var i = 0; i < this.cards.length; i++){
			console.log('Cards['+i+']: '+ this.cards[i]);
		}
		
	},

	homeCaptain: function(){
		// need to draw 2 Deffence card and 4 offence card randomly
		var n;
		// 4 offence cards
		for(var i = 0; i < 4; i++){
			n = ~~Math.randomBetween(1, 28);
			if(n <= 17)			this.cards.push(1);
			else if(n <= 22) 	this.cards.push(2);
			else 			 	this.cards.push(3);
		}
		// then 2 defence cards
		this.cards.push(~~Math.randomBetween(4, 7));
		this.cards.push(~~Math.randomBetween(4, 7));
		
	},

	awayCaptain: function(){
		// need to draw 2 Deffence card and 4 offence card randomly
		var n;
		// 4 offence cards
		for(var i = 0; i < 4; i++){
			n = ~~Math.randomBetween(1, 28);
			if(n <= 17)			this.cards.push(11);
			else if(n <= 22) 	this.cards.push(12);
			else 			 	this.cards.push(13);
		}
		// then 2 defence cards
		this.cards.push(~~Math.randomBetween(14, 17));
		this.cards.push(~~Math.randomBetween(14, 17));

	},

	switchToOffence: function(){
		this.currentOffence = true;
	},

	switchToDeffence: function(){
		this.currentOffence = false;
	},

	PlayerAuto: function(){
		console.log('Player AutoPlay: do nothing');
		
	},

	tradeCard: function(position){

	},

	PassToGoal: function(){
		console.log('Player Pass To Goal');
		this.GoalThisTurn = true;
		this.Score++;
	},

	ShotToGoal: function(){
		console.log('Player Shot To Goal');
		this.GoalThisTurn = true;
		this.Score++;
	},

	checkGoal: function(){
		return this.GoalThisTurn;
	},

	// once goaled and before kickoff, reset some value here
	NewTurnInit: function(){
		this.GoalThisTurn = false;
		this.LastPick = null;
	}


});
 
});