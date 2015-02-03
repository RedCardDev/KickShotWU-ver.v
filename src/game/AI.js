game.module(
    'game.AI'
)
.body(function() {

var SuperSpeed = 1;
    
/*
 *	A player class will hold all the current infomation for this player
 */
game.createClass('AI', {

	Side: 'Away',	// default set player is home

	Score: 0,

	currentOffence: false,

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

	cards: [],
	RefereeCards: [],	

	LastPick: null,	// hold last card that AI used

	GoalThisTurn: false,
	LostGoalThisTurn: false,

	phase: null,


	init: function(HomeSide){
		console.log('Current AI side:' + HomeSide);
		if(HomeSide){
			this.Side = 'Home';
			this.phase = new game.BitmapText('Offence', {font: 'Foo'});
			this.switchToOffence();
			this.homeAI();
			this.pile = new game.Pile('Home', this.cards);
		}else{
			this.Side = 'Away';
			this.phase = new game.BitmapText('Defence', {font: 'Foo'});
			this.switchToDeffence();
			this.awayAI();
			this.pile = new game.Pile('Away', this.cards);
		}

		// push the position of all the cards to each array that hold this type
		for(var i = 0; i < this.cards.length; i++){
			console.log('Cards['+i+']: '+ this.cards[i]);
		}

		var text1 = new game.BitmapText(this.Side, {font: 'Foo'});
		text1.position.set(10, 10);

		this.scoreText = new game.BitmapText( ' AI: '+this.Score, {
			font: 'Foo'
		});

		this.scoreText.position.set(450, 80);

		this.phase.position.set(450, 10);

		text1.addTo(game.scene.stage);
		this.scoreText.addTo(game.scene.stage);
		this.phase.addTo(game.scene.stage);
		game.scene.addObject(this);	
	},

	homeAI: function(){
		// need to draw 2 Deffence card and 4 offence card randomly
		var n;
		// 4 offence cards
		for(var i = 0; i < 4; i++){
			n = ~~Math.randomBetween(1, 28);
			if(n <= 17)			this.cards.push(this.HomePass);
			else if(n <= 22)	this.cards.push(this.HomeLeftShot);
			else 			 	this.cards.push(this.HomeRightShot);
		}
		// then 2 defence cards
		this.cards.push(~~Math.randomBetween(4, 7));
		this.cards.push(~~Math.randomBetween(4, 7));		
	},

	awayAI: function(){
		// need to draw 2 Deffence card and 4 offence card randomly
		var n;
		// 4 offence cards
		for(var i = 0; i < 4; i++){
			n = ~~Math.randomBetween(1, 28);
			if(n <= 17)			this.cards.push(this.AwayPass);
			else if(n <= 22) 	this.cards.push(this.AwayLeftShot);
			else 			 	this.cards.push(this.AwayRightShot);
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

	SmartTrade: function(){

	},

	StartThinking: function(){
		var text = new game.BitmapText('AI Is Thinking . . .', { font: 'Foo' });
		text.position.set(120, 200);
		
		this.RemainThinking(text, 0);
		text.addTo(game.scene.stage);
	},

	RemainThinking: function(text, i){
		//console.log(i);
		var self = this;
		if(i == 13){
			text.visible = false;
			this.SmartPlay();
		}else{
			if(i % 4 == 0)		text.setText('AI Is Thinking');
			else if(i % 4 == 1)	text.setText('AI Is Thinking .');
			else if(i % 4 == 2)	text.setText('AI Is Thinking . .');
			else if(i % 4 == 3)	text.setText('AI Is Thinking . . .');

			i++;
			if (SuperSpeed == 1)
			{
				game.scene.addTimer(2, self.RemainThinking.bind(self, text, i));
			}
			else
			{
				game.scene.addTimer(250, self.RemainThinking.bind(self, text, i));
			}
		}
	},

	SmartPlay: function(){
		if(this.currentOffence){
			this.DealOffence();
		}else{	// If AI is currently is Deffence
			// check last card Player use, since in Deffence, only check 1,2,3 or 11,12,13, or null
			if(game.Player.LastPick == null || game.Player.LastPick == 0 ||
				game.Player.LastPick == 1 || game.Player.LastPick == 11 ||
				game.Player.LastPick == 4 || game.Player.LastPick == 14)
			{	
				// if Player used pass card, or didnt use any card last turn
				this.TryIntercept();
			}else if((game.Player.LastPick == 2 || game.Player.LastPick == 3 ||
					  game.Player.LastPick == 12 || game.Player.LastPick == 13) 
						&& game.chip.chipzone == -11)
			{ 
			// if Player used leftshot card && reaches the end of zone
				this.TryGoalBlock();
			}
		}
	},

	TradeCard: function(){
		// will have smart trade later, use random so far
		var position = ~~Math.randomBetween(0,6);
		this.cards[position] = null;
		this.DrawCard(position);	// then recover the card
		return position;
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

	},

	DrawRefereeCard: function(){
		this.RefereeCards.push(game.RefereePile.Draw());
		console.log('AI Draw a Referee card');
	},

	SearchCard: function(type){
		var position = null;
		for(var i = 0; i < this.cards.length-1; i++){
			if(this.cards[i] == type){
				position = i;
				i = this.cards.length-1;
			}
		}
		return position;	// return null means didnt find this type
	},

	/*
	 *	This function will deal with AI offence turn
	 * 	get the selected card position and pass to usecard()
	 */
	DealOffence: function(){
		console.log('AI Dealing Offence Phase');
		var position = null;
		var tmp;
		var r = ~~Math.randomBetween(2, 6);
		if(game.chip.chipzone > r){
			/* if the chip is located randomly between this field,
			 * check if hold shot cards
			 * If so, store the position value and pop it from hold stack
			 */
			/* note, we dont need if statement for Home/Away */
			if((tmp = this.SearchCard(this.HomeLeftShot)) != null){
				position = tmp;
				console.log('Pick LeftShot(Home)');
			}else if((tmp = this.SearchCard(this.HomeRightShot)) != null){
				position = tmp;
				console.log('Pick RightShot(Home)');
			}

			if((tmp = this.SearchCard(this.AwayLeftShot)) != null){
				position = tmp;
				console.log('Pick LeftShot(Away)');
			}else if((tmp = this.SearchCard(this.AwayRightShot)) != null){
				position = tmp;
				console.log('Pick RightShot(Away)');
			}
			/*	If not, skip current if statement 
			 *  and check if hold pass card
			 */
		}

		if(position == null){	
			/* 	if AI didnt use shot cards, check pass
			 *	If so, store the position value and pop it from hold stack
			 */
			if((tmp = this.SearchCard(this.HomePass)) != null){
				position = tmp;
				console.log('Pick Pass(Home)');		
			}

			if((tmp = this.SearchCard(this.AwayPass)) != null){
				position = tmp;
				console.log('Pick Pass(Away)');	
			}
		}// else use card or leave position as null that we didnt use card

		if(position == null){
			/*	If AI dont have card avaiable to use so far
			 * 	Randomly trade a card so far,
			 *  check if we can use the traded card immedietely
			 *  if not, check referee later
			 */
			console.log('No Card To Use, try trade card!');
			tmp = this.TradeCard();
			if(this.cards[tmp] == 1 || this.cards[tmp] == 11){
				position = tmp;
			}else if((this.cards[tmp] == 2 || this.cards[tmp] == 12 ||
					  this.cards[tmp] == 3 || this.cards[tmp] == 13) 
					  && game.chip.chipzone > r)
			{
				position = tmp;
			}else
				console.log('Still no card to use after trade card');
		}

		if(position != null){
			/*	If we finally got one card, use it.
			 * 	make sure we draw a card at the end of usecard function
			 */
			this.useCard(position);
		}else{
			/* check referee if still no card to use */
			if(this.RefereeCards.length > 0)
				this.useRefereeCard();
			else{
				this.LastPick = null;
				this.EndTurn();
			}
		}
	},

	TryIntercept: function(){
		var position = null;
		var tmp;
		if((tmp = this.SearchCard(this.HomeIntercept)) != null){
			position = tmp;
			console.log('Pick Intercept(Home)');
		}

		if((tmp = this.SearchCard(this.AwayIntercept)) != null){
			position = tmp;
			console.log('Pick Intercept(Away)');
		}

		if(position == null){
			/*	If AI dont hold intercept card, 
			 *	trade card to see if AI can get it
			 */
			console.log('No Card To Use, try trade card!');
			var tmp = this.TradeCard();
			if(this.cards[tmp] == this.HomeIntercept || 
			   this.cards[tmp] == this.AwayIntercept)
			{
				console.log('Succeed to trade and get intercept');
				position = tmp;
			}
		}

		if(position != null){
			/*	If we finally got one card, use it.	 */
			this.useCard(position);
		}else{
			if(this.RefereeCards.length > 0)
				this.useRefereeCard();
			else{
				this.LastPick = null;
				this.EndTurn();
			}
		}
	},

	TryGoalBlock: function(){
		var position = null;
		var tmp;
		var PLP = game.Player.LastPick;

		if( PLP == this.HomeLeftShot &&
			(tmp = this.SearchCard(this.AwayLeftBlock)) != null){
			position = tmp;
			console.log('Pick LeftBlock(Away)');
		}

		if( PLP == this.HomeRightShot &&
			(tmp = this.SearchCard(this.AwayRightBlock)) != null){
			position = tmp;
			console.log('Pick RightBlock(Away)');
		}

		if( PLP == this.AwayLeftShot &&
			(tmp = this.SearchCard(this.HomeLeftBlock)) != null){
			position = tmp;
			console.log('Pick LeftBlock(Home)');
		}

		if( PLP == this.AwayRightShot &&
			(tmp = this.SearchCard(this.HomeRightBlock)) != null){
			position = tmp;
			console.log('Pick RightBlock(Home)');
		}

		if(position == null){
			/*	If AI dont hold specific block card, 
			 *	trade card to see if AI can get it
			 */
			var tmp = this.TradeCard();
			if( (PLP == this.HomeLeftShot && this.cards[tmp] == this.AwayLeftBlock) 	||
				(PLP == this.HomeRightShot && this.cards[tmp] == this.AwayRightBlock) ||
				(PLP == this.AwayLeftShot && this.cards[tmp] == this.HomeLeftBlock) 	||
				(PLP == this.AwayRightShot && this.cards[tmp] == this.HomeRightBlock) )
			{
				position = tmp;
			}// else leave position null
		}

		if(position != null){
			/*	If we finally got one card, use it.	 */
			this.useCard(position);
		}else{
			this.LastPick = null;
			console.log('AI doesn\'t hold block card' );
			/* since we are not able to block it,
			 * Player will goal!!
			 */
			this.LostGoal();

			this.EndTurn();
		}
	},

	useCard: function(position){
		var self = this;
		var name;
		switch(this.cards[position]){
			case 1:
				name = 'Pass_home';
				break;
			case 2:
				name = 'LeftShot_home';
				break;
			case 3:
				name = 'RightShot_home';
				break;
			case 4:
				name = 'Intercept_home';
				break;
			case 5:
				name = 'LeftBlock_home';
				break;
			case 6:
				name = 'RightBlock_home';
				break;
			case 11:
				name = 'Pass_away';
				break;
			case 12:
				name = 'LeftShot_away';
				break;
			case 13:
				name = 'RightShot_away';
				break;
			case 14:
				name = 'Intercept_away';
				break;
			case 15:
				name = 'LeftBlock_away';
				break;
			case 16:
				name = 'RightBlock_away';
				break;
			default:
				console.log('Unknown cardType in iniSprite - cardmenu.js');
				break;
		}

		console.log('Test CardSprite Name: '+name);
		this.CardSprite = new game.Sprite(name,  320, -100, {
			anchor: {x: 0.5, y: 0.5},
			scale: {x: 0.4, y: 0.4},
		});

		if (SuperSpeed == 1)
		{
			var tween = new game.Tween(this.CardSprite.position);
			tween.to({y: 480}, 7);

			tween.onComplete(function(){
				game.scene.addTimer(10, function(){
					self.CardSprite.visible = false;
					self.RollDueDice(position);
				});
				
			});

			game.scene.addTimer(5, tween.start());
		}
		else
		{
			var tween = new game.Tween(this.CardSprite.position);
			tween.to({y: 480}, 700);

			tween.onComplete(function(){
				game.scene.addTimer(1000, function(){
					self.CardSprite.visible = false;
					self.RollDueDice(position);
				});
				
			});

			game.scene.addTimer(500, tween.start());
		}
		game.scene.stage.addChild(this.CardSprite);
	},

	useRefereeCard: function(){
		this.EndTurn();
	},

	RollDueDice: function(i){
		var self = this;
		game.dice.setAiPosition();
		game.dice.showdue();

		game.scene.addTimer( 10, function(){
			game.dice.roll();
			game.scene.addTimer( 10, function(){
				game.dice.stopRoll();
				game.scene.addTimer(5, self.Transit.bind(self, i));
			});
		});
	},

	Transit: function(i){
		game.dice.hidedue();

		var self = this;
		var die1 = game.dice.value1;
		var die2 = game.dice.value2;

		if(i == null){
			// kickoff

			// Add 1 to dice roll when doubles are rolled
			if(game.dice.sameRoll)
			{
				game.chip.moveChip( Math.max(game.dice.value1, game.dice.value2) + 1);
			} 
			else
			{
				game.chip.moveChip( Math.max(game.dice.value1, game.dice.value2) );
			}

			game.scene.addTimer( 5, game.gameround.PlayerTurn.bind(game.gameround) );			
		}else{
			this.LastPick = this.cards[i];
			switch(this.cards[i]){
				case 1: case 11:
					game.chip.moveChip( Math.max(die1, die2) );
					if(die1 == 1 || die2 == 1){	// Pass fail by rolling 1
						game.scene.addTimer(10, this.PassFail.bind(this, i) );
					}else{
						if(game.chip.chipzone == 11){
							this.PassToGoal();
						}
						this.DrawCard(i);
						this.EndTurn();					
					}
					break;
				case 2: case 3: case 12: case 13:
					game.chip.moveChip( (die1 + die2) );
					if(game.chip.chipzone < 11){
						game.scene.addTimer(10, this.ShotFail.bind(this, i) );
					}else{
						this.DrawRefereeCard();
						this.DrawCard(i);
						this.EndTurn();
					}
					break;
				case 4: case 14:
					if( die1 == 1 || die2 == 1 ){
						console.log( 'AI fail intercerpt by rolling 1' );
					}else{
						this.switchToOffence();
						game.Player.switchToDeffence();
						game.chip.TurnOver();
					}
					this.DrawCard(i);
					this.EndTurn();
					break;
				case 5: case 6: case 15: case 16:
					this.switchToOffence();
					game.Player.switchToDeffence();
					game.chip.TurnOver();
					this.DrawCard(i);
					game.scene.addTimer( 5, function(){
						game.chip.moveChip( (die1 + die2) );

						if(die1 == 1 || die2 == 1){
							game.scene.addTimer(10, function(){
								self.switchToDeffence();
								game.Player.switchToOffence();
								game.chip.TurnOver();
								self.EndTurn();
							});
						}else{
							game.scene.addTimer(10, self.EndTurn.bind(self) );
						}
					});
					break;
				default: 
					console.log('Unknown Type of Card');
					break;
			}
		}

	},

	PassFail: function(i){
		console.log('AI pass is blocked by rolling 1');
		this.switchToDeffence();
		game.Player.switchToOffence();
		game.chip.TurnOver();
		this.DrawCard(i);
		this.EndTurn();
	},

	ShotFail: function(i){
		console.log('AI shot! But didnt reach the end of zone!')
		this.switchToDeffence();
		game.Player.switchToOffence();
		game.chip.TurnOver();
		this.DrawCard(i);
		this.EndTurn();
	},

	PassToGoal: function(){
		console.log('AI Pass To Goal');
		this.GoalThisTurn = true;
		game.gameround.PlayerGetLastGoal = false;
		this.Score++;
		this.scoreText.setText(' AI: '+this.Score);
	},

	LostGoal: function(){
		console.log('Player Shot To Goal');
		this.LostGoalThisTurn = true;
		game.gameround.PlayerGetLastGoal = true;
		game.Player.Score++;
		game.Player.scoreText.setText('You: '+game.Player.Score);
	},

	checkGoal: function(){
		return this.GoalThisTurn;
	},

	// once goaled and before kickoff, reset some value here
	NewTurnInit: function(){
		this.GoalThisTurn = false;
		this.LostGoalThisTurn = false;
		this.LastPick = null;
	},

	EndTurn: function(){
		var self = this;
		// need animation here

		game.scene.addTimer(10, function(){
			
			if(self.GoalThisTurn || self.LostGoalThisTurn){
				self.goalsprite = new game.Sprite('Goal_home');
				if( (self.GoalThisTurn && self.Side == 'Away')||
					(self.LostGoalThisTurn && self.Side == 'Home') )
					self.goalsprite.setTexture('Goal_away');

				self.goalsprite.anchor.set(0.5, 0.5);
				self.goalsprite.position.set(320, 480);
				self.goalsprite.interactive = true;
				self.goalsprite.click = self.goalsprite.tap = function(){
					self.goalsprite.visible = false;
					game.gameround.Rounding();
				};
				game.scene.stage.addChild(self.goalsprite);
			}else{
				game.gameround.PlayerTurn();
			}

				
		});
			
	}
});

});