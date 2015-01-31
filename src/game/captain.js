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
 	LostGoalThisTurn: false,

 	phase: null,

	init: function(HomeSide){
		console.log('Current player side:' + HomeSide);
		if(HomeSide){
			this.Side = 'Home';
			this.phase = new game.BitmapText('Offense', {font: 'Foo'});
			this.switchToOffence();
			this.homeCaptain();
			this.pile = new game.Pile('Home', this.cards);
		}else{
			this.Side = 'Away';
			this.phase = new game.BitmapText('Defence', {font: 'Foo'});
			this.switchToDeffence();
			this.awayCaptain();
			this.pile = new game.Pile('Away', this.cards);
		}
		// testing
		for(var i = 0; i < this.cards.length; i++){
			console.log('Cards['+i+']: '+ this.cards[i]);
		}

		this.cardmenu = new game.CardMenu(this.cards);

		var text1 = new game.BitmapText( this.Side, {font: 'Foo'} );
		text1.position.set(10, 890);

		this.scoreText = new game.BitmapText( 'You: '+this.Score, {
			font: 'Foo'
		});

		this.scoreText.position.set(450, 830);

		this.phase.position.set(450, 890);

		text1.addTo(game.scene.stage);
		this.scoreText.addTo(game.scene.stage);
		this.phase.addTo(game.scene.stage);
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
		this.phase.setText('Offence');
	},

	switchToDeffence: function(){
		this.currentOffence = false;
		this.phase.setText('Defence');
	},

	ShowCardPick: function(){
		this.cardmenu.traded = false;
		game.scene.addTimer(500, this.cardmenu.showMenu.bind(this.cardmenu) );
	},

	tradeCard: function(position){
		this.cards[position] = null;
		return this.DrawCard(position);	// then recover the card
	},

	DrawAfterUse: function(position){
		this.cards[position] = null;
		var type = this.DrawCard(position);
		this.cardmenu.ChangeSprite(type, position);
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
	RollDueDice: function(i){
		var self = this;
		game.dice.setPlayerPosition();
		game.scene.addTimer( 1000, function(){
			game.dice.showdue();
			game.scene.addTimer( 1000, function(){
				game.dice.roll();
				game.scene.addTimer( 1000, function(){
					game.dice.stopRoll();
					game.scene.addTimer(500, self.Use.bind(self, i));
				});
			});
		});			
	},

	Use: function(i){
		game.dice.hidedue();

		var self = this;
		var die1 = game.dice.value1;
		var die2 = game.dice.value2;
		console.log();
		console.log('dice1: '+die1);
		console.log('dice2: '+die2);

		if(i == null){
			// kickoff
			game.chip.moveChip( Math.max(game.dice.value1, game.dice.value2) );
			
			game.scene.addTimer( 500, game.gameround.AITurn.bind(game.gameround) );		
		}else{
			this.LastPick = this.cards[i];
			switch(this.cards[i]){
				case 1: case 11:
					console.log('Pass Ball By High die Roll');
					game.chip.moveChip( Math.max(die1, die2) );
					if(die1 == 1 || die2 == 1){
						console.log('Pass was blocked by rolling 1');
						game.scene.addTimer(1000, this.PassOrShotFail.bind(this, i) );
					}else{
						if(game.chip.chipzone == -11){
							this.PassToGoal();
						}
						this.DrawAfterUse(i);
						this.EndTurn();					
					}
					break;
				case 2: case 3: case 12: case 13:
					console.log();
					game.chip.moveChip( (die1 + die2) );
					if(game.chip.chipzone > -11){
						game.scene.addTimer(1000, this.PassOrShotFail.bind(this, i) );
					}else{
						this.DrawRefereeCard();
						this.DrawAfterUse(i);
						this.EndTurn();
					}
					break;
				case 4: case 14:
					console.log();
					if( die1 == 1 || die2 == 1 ){
						console.log( 'You fail intercerpt by rolling 1' );
					}else{
						this.switchToOffence();
						game.AI.switchToDeffence();
						game.chip.TurnOver();
					}
					this.DrawAfterUse(i);
					this.EndTurn();
					break;
				case 5: case 6: case 15: case 16:
					console.log();
					this.switchToOffence();
					game.AI.switchToDeffence();
					game.chip.TurnOver();
					this.DrawAfterUse(i);

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
							this.EndTurn();
						}
					});
					break;
				default: 
					console.log('Unknown Type of Card');
					break;
			}
		}

	},

	PassOrShotFail: function(i){
		this.switchToDeffence();
		game.AI.switchToOffence();
		game.chip.TurnOver();
		this.DrawAfterUse(i);
		this.EndTurn();
	},
	// ======================================

	PassToGoal: function(){
		console.log('Player Pass To Goal');
		this.GoalThisTurn = true;
		this.Score++;
		this.scoreText.setText('You: '+this.Score);
		game.gameround.PlayerGetLastGoal = true;
	},

	LostGoal: function(){
		console.log('AI Shot To Goal');
		this.LostGoalThisTurn = true;
		game.AI.Score++;
		game.AI.scoreText.setText(' AI: '+game.AI.Score);
		game.gameround.PlayerGetLastGoal = false;
	},

	checkGoal: function(){
		return this.GoalThisTurn;
	},

	EndTurn: function(){
		var self = this;
		if(this.GoalThisTurn || this.LostGoalThisTurn){
			this.goalsprite = new game.Sprite('Goal_home');
			if( (this.GoalThisTurn && this.Side == 'Away')||
				(this.LostGoalThisTurn && this.Side == 'Home') )
				this.goalsprite.setTexture('Goal_away');

			this.goalsprite.anchor.set(0.5, 0.5);
			this.goalsprite.position.set(320, 480);
			this.goalsprite.interactive = true;
			this.goalsprite.click = this.goalsprite.tap = function(){
				self.goalsprite.visible = false;
				game.gameround.Rounding();
			};
			game.scene.stage.addChild(this.goalsprite);
		}else{
			game.gameround.AITurn();
		}	

			
	},

	// once goaled and before kickoff, reset some value here
	NewTurnInit: function(){
		this.GoalThisTurn = false;
		this.LostGoalThisTurn = false;
		this.LastPick = null;
	}


});
 
});