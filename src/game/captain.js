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

		this.cardmenu = new game.CardMenu(this.cards);

		game.scene.addObject(this);
		
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

	ShowCardPick: function(){
		this.cardmenu.traded = false;
		game.scene.addTimer(500, this.cardmenu.showMenu.bind(this.cardmenu) );
	},

	tradeCard: function(position){
		this.cards[position] = null;
		return this.DrawCard(position);	// then recover the card
	},

	DrawCard: function(position){
		var type = this.pile.DrawCard();
		this.cards[position] = type;

		// testing
			console.log();
			console.log('Draw a new Card at: '+ position);
			console.log('NewCard: '+ this.cards[position]);
			console.log();
		// testing
			for(var i = 0; i < this.cards.length; i++){
				console.log('Cards['+i+']: '+ this.cards[i]);
			}
		return type;

	},

	DrawRefereeCard: function(){

	},

	// =====================================
	// function deal with use cards
	UseCard: function(select){
		switch(this.cards[select]){
			case 1: case 11:
				this.UsePass(select);
				break;
			case 2: case 3: case 12: case 13:
				this.UseShot(select);
				break;
			case 4: case 14:
				this.UseIntercept(select);
				break;
			case 5: case 15: 
				this.UseLeftBlock(select);
				break;
			case 6: case 16: 
				this.UseRightBlock(select);
				break;
			default:
				console.log('Unknown cardType in UseCard- captain()');
				break;
		}
	},

	UsePass: function(select){
		if(!this.currentOffence){
			console.log('You are currently not in Offence! Not Able to use pass');
			console.log('Try Another');
		}else{
			console.log('TestUsePass');
			this.cardmenu.hideMenu();
			this.RollDueDice(select);
		}
	},

	PassOrShotFail: function(){
		this.switchToDeffence();
		game.AI.switchToOffence();
		game.chip.TurnOver();
		this.EndTurn();
	},

	UseShot: function(select){
		if(!this.currentOffence){
			console.log('You are currently not in Offence! Not Able to use shot');
		}else{
			console.log('TestUseShot');
			this.cardmenu.hideMenu();
			this.RollDueDice(select);
		}
	},

	UseIntercept: function(select){
		if(this.currentOffence){
			console.log('You are currently in Offence! Not Able to use intercerpt');
		}else{
			this.cardmenu.hideMenu();
			this.RollDueDice(select);
		}
	},

	UseLeftBlock: function(select){
		if(this.currentOffence){
			console.log('You are currently in Offence! Not Able to use UseLeftBlock');
		}else if(game.AI.LastPick != 2 || game.AI.LastPick != 12){
			console.log('The Block Direction is not the same as AI shot direction!');
		}else if(game.AI.LastPick == 2 || game.AI.LastPick == 12){
			this.carmenu.hideMenu();
			this.RollDueDice(select);
		}else{
			console.log('AI didn\'t use goal shot card, no need block');
		}
	},

	UseRightBlock: function(select){
		if(this.currentOffence){
			console.log('You are currently in Offence! Not Able to use intercerpt');
		}else if(game.AI.LastPick != 3 || game.AI.LastPick != 13){
			console.log('The Block Direction is not the same as AI shot direction!');
		}else if(game.AI.LastPick == 3 || game.AI.LastPick == 13){
			this.carmenu.hideMenu();
			this.RollDueDice(select);
		}else{
			console.log('AI didn\'t use goal shot card, no need block');
		}
	},

	RollDueDice: function(i){
		var self = this;
		game.dice.showdue();

		game.scene.addTimer(1000, this.StartRoll.bind(this, i) );
	},

	StartRoll: function(i){
		game.dice.roll();
		game.scene.addTimer( 1000, this.StopRoll.bind(this, i) );
	},

	StopRoll: function(i){
		game.dice.stopRoll();
		console.log('Test stoproll');
		game.scene.addTimer( 500, this.Transit.bind(this, i) );
	}, 

	Transit: function(i){
		game.dice.hidedue();
		var self = this;
		var die1 = game.dice.value1;
		var die2 = game.dice.value2;
		switch(this.cards[i]){
			case 1: case 11:
				game.chip.moveChip( Math.max(die1, die2) );
				if(die1 == 1 || die2 == 1){
					game.scene.addTimer(1000, this.PassOrShotFail.bind(this) );
				}else{
					if(game.chip.chipzone == -11){
						this.PassToGoal();
					}
					this.EndTurn();					
				}
				break;
			case 2: case 3: case 12: case 13:
				game.chip.moveChip( (die1 + die2) );
				if(game.chip.chipzone > -11){
					game.scene.addTimer(1000, this.PassOrShotFail.bind(this) );
				}else{
					this.DrawRefereeCard();
					this.EndTurn();
				}
				break;
			case 4: case 14:
				if( die1 == 1 || die2 == 2 ){
					console.log( 'You fail intercerpt by rolling 1' );
				}else{
					this.switchToOffence();
					game.AI.switchToDeffence();
					game.chip.TurnOver();
				}
				this.EndTurn();
				break;
			case 5: case 6: case 15: case 16:
				this.switchToOffence();
				game.AI.switchToDeffence();
				game.chip.TurnOver();

				game.scene.addTimer( 500, function(){
					game.chip.moveChip( (die1 + die2) );

					if(die1 == 1 || die2 == 1){
						game.scene.addTimer(1000, function(){
							self.switchToDeffence();
							game.AI.switchToOffence();
							game.chip.TurnOver();
							self.EndTurn();
						});
					}else{
						game.scene.addTimer(1000, this.EndTurn.bind(this) );
					}
				});
				break;

		}

	},
	// ======================================

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

	EndTurn: function(){
		if(this.GoalThisTurn){
			game.gameround.Rounding();
		}else{
			game.gameround.AITurn();
		}	
	},

	// once goaled and before kickoff, reset some value here
	NewTurnInit: function(){
		this.GoalThisTurn = false;
		this.LastPick = null;
	}


});
 
});