game.module(
    'game.AI'
)
.body(function() {
    
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
			this.pushHold(this.cards[i], i);
		}

		var text1 = new game.BitmapText(this.Side, {font: 'Foo'});
		text1.position.set(10, 10);

		this.phase.position.set(450, 10);

		text1.addTo(game.scene.stage);
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

	pushHold: function(cardType, position){
		switch(cardType){
			case 1: this.HoldHomePass.push(position);	break; 
			case 2: this.HoldHomeLeftShot.push(position);	break; 
			case 3: this.HoldHomeRightShot.push(position);	break; 
			case 4: this.HoldHomeIntercept.push(position);	break; 
			case 5: this.HoldHomeLeftBlock.push(position);	break; 
			case 6: this.HoldHomeRightBlock.push(position);	break; 
			case 11: this.HoldAwayPass.push(position);		break; 
			case 12: this.HoldAwayLeftShot.push(position);	break; 
			case 13: this.HoldAwayRightShot.push(position);	break; 
			case 14: this.HoldAwayIntercept.push(position);	break; 
			case 15: this.HoldAwayLeftBlock.push(position);	break; 
			case 16: this.HoldAwayRightBlock.push(position);	break; 
			default: console.log('Undefined Card Type!');		break;
		}
	},

	popHold: function(position){
		var found = false;
		var i;
		switch(this.cards[position]){
			case 0: this.HoldReferee.pop();	break; 
			case 1: 
				i = 0;
				while(!found){
					if(this.HoldHomePass[i] == position){
						delete this.HoldHomePass[i];
						found = true;
					}
					i++;
				}
				break;
			case 2:
				i = 0;
				while(!found){
					if(this.HoldHomeLeftShot[i] == position){
						delete this.HoldHomeLeftShot[i];
						found = true;
					}
					i++;
				}
				break;
			case 3: 
				i = 0;
				while(!found){
					if(this.HoldHomeRightShot[i] == position){
						delete this.HoldHomeRightShot[i];
						found = true;
					}
					i++;
				}
				break;
			case 4:
				i = 0;
				while(!found){
					if(this.HoldHomeIntercept[i] == position){
						delete this.HoldHomeIntercept[i];
						found = true;
					}
					i++;
				}
				break;
			case 5: 
				i = 0;
				while(!found){
					if(this.HoldHomeLeftBlock[i] == position){
						delete this.HoldHomeLeftBlock[i];
						found = true;
					}
					i++;
				}
				break;
			case 6:
				i = 0;
				while(!found){
					if(this.HoldHomeRightBlock[i] == position){
						delete this.HoldHomeRightBlock[i];
						found = true;
					}
					i++;
				}
				break;
			case 11: 
				i = 0;
				while(!found){
					if(this.HoldAwayPass[i] == position){
						delete this.HoldAwayPass[i];
						found = true;
					}
					i++;
				}
				break;
			case 12:
				i = 0;
				while(!found){
					if(this.HoldAwayLeftShot[i] == position){
						delete this.HoldAwayLeftShot[i];
						found = true;
					}
					i++;
				}
				break;
			case 13: 
				i = 0;
				while(!found){
					if(this.HoldAwayRightShot[i] == position){
						delete this.HoldAwayRightShot[i];
						found = true;
					}
					i++;
				}
				break;
			case 14:
				i = 0;
				while(!found){
					if(this.HoldAwayIntercept[i] == position){
						delete this.HoldAwayIntercept[i];
						found = true;
					}
					i++;
				}
				break;
			case 15: 
				i = 0;
				while(!found){
					if(this.HoldAwayLeftBlock[i] == position){
						delete this.HoldAwayLeftBlock[i];
						found = true;
					}
					i++;
				}
				break;
			case 16:
				i = 0;
				while(!found){
					if(this.HoldAwayRightBlock[i] == position){
						delete this.HoldAwayRightBlock[i];
						found = true;
					}
					i++;
				}
				break;
		}
			
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

	SmartPlay: function(){
		if(this.currentOffence){
			this.DealOffence();
		}else{	// If AI is currently is Deffence
			// check last card Player use, since in Deffence, only check 1,2,3 or 11,12,13, or null
			if(game.Player.LastPick == null || game.Player.LastPick == 0 ||
				game.Player.LastPick == 1 || game.Player.LastPick == 11 ||
				game.Player.LastPick == 4 || gane.Player.LastPick == 14)
			{	
				// if Player used pass card, or didnt use any card last turn
				this.TryIntercept();
			}else if((game.Player.LastPick == 2 || game.Player.LastPick == 3 ||
					  game.Player.LastPick == 12 || game.Player.LastPick == 13) 
						&& game.chip.chipzone == 11)
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
		this.popHold(position);	// delete the traded card in hold stack
		this.DrawCard(position);	// then recover the card
		return position;
	},

	DrawCard: function(position){
		var type = this.pile.DrawCard();
		this.cards[position] = type;
		this.pushHold(type, position);

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
		this.HoldReferee.push(game.RefereePile.Draw());
		console.log('AI Draw a Referee card');
	},

	/*
	 *	This function will deal with AI offence turn
	 * 	get the selected card position and pass to usecard()
	 */
	DealOffence: function(){
		console.log('AI Dealing Offence Phase');
		var position = null;
		var r = ~~Math.randomBetween(-1, 5);	
		if(game.chip.chipzone > r){
			/* if the chip is located randomly between this field,
			 * check if hold shot cards
			 * If so, store the position value and pop it from hold stack
			 */
			/* note, we dont need if statement for Home/Away */
			if(this.HoldHomeLeftShot.length > 0){
				position = this.HoldHomeLeftShot[this.HoldHomeLeftShot.length-1];
				this.HoldHomeLeftShot.pop();
				console.log('Pick LeftShot(Home)');
			}else if(this.HoldHomeRightShot.length > 0){
				position = this.HoldHomeRightShot[this.HoldHomeRightShot.length-1];
				this.HoldHomeRightShot.pop();
				console.log('Pick RightShot(Home)');
			}

			if(this.HoldAwayLeftShot.length > 0){
				position = this.HoldAwayLeftShot[this.HoldAwayLeftShot.length-1];
				this.HoldAwayLeftShot.pop();
				console.log('Pick LeftShot(Away)');
			}else if(this.HoldAwayRightShot.length > 0){
				position = this.HoldAwayRightShot[this.HoldAwayRightShot.length-1];
				this.HoldAwayRightShot.pop();
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
			if(this.HoldHomePass.length > 0){
				position = this.HoldHomePass[this.HoldHomePass.length-1];
				this.HoldHomePass.pop();
				console.log('Pick Pass(Home)');				
			}

			if(this.HoldAwayPass.length > 0){
				position = this.HoldAwayPass[this.HoldAwayPass.length-1];
				this.HoldAwayPass.pop();
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
			var tmp_p = this.TradeCard();
			if(this.cards[tmp_p] == 1 || this.cards[tmp_p] == 11){
				position = tmp_p;
				this.popHold(position);
			}else if((this.cards[tmp_p] == 2 || this.cards[tmp_p] == 12 ||
					  this.cards[tmp_p] == 3 || this.cards[tmp_p] == 13) 
					  && game.chip.chipzone > r)
			{
				position = tmp_p;
				this.popHold(position);
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
			if(this.HoldReferee.length > 0)
				useRefereeCard();
			else{
				this.LastPick = null;
				this.EndTurn();
			}
		}

	},

	TryIntercept: function(){
		var position = null;
		if(this.HoldHomeIntercept.length > 0){
			position = this.HoldHomeIntercept[this.HoldHomeIntercept.length-1];
			this.HoldHomeIntercept.pop();
			console.log('Pick Intercept(Home)');
		}

		if(this.HoldAwayIntercept.length > 0){
			position = this.HoldAwayIntercept[this.HoldAwayIntercept.length-1];
			this.HoldAwayIntercept.pop();
			console.log('Pick Intercept(Away)');
		}

		if(position == null){
			/*	If AI dont hold intercept card, 
			 *	trade card to see if AI can get it
			 */
			console.log('No Card To Use, try trade card!');
			var tmp_p = this.TradeCard();
			if(this.cards[tmp_p] == this.HomeIntercept || 
			   this.cards[tmp_p] == this.AwayIntercept)
			{
				console.log('Succeed to trade and get intercept');
				position = tmp_p;
				this.popHold(position);
			}
		}

		if(position != null){
			/*	If we finally got one card, use it.	 */
			this.useCard(position);
		}else{
			if(this.HoldReferee.length > 0)
				useRefereeCard();
			else{
				this.LastPick = null;
				this.EndTurn();
			}
		}

	},

	TryGoalBlock: function(){
		var position = null;
		var PLP = game.Player.LastPick;

		if( PLP == this.HomeLeftShot && this.HoldAwayLeftBlock.length > 0){
			position = this.HoldAwayLeftBlock[this.HoldAwayLeftBlock.length-1];
			this.HoldAwayLeftBlock.pop();
		}

		if( PLP == this.HomeLeftShot && this.HoldAwayRightBlock.length > 0){
			position = this.HoldAwayRightBlock[this.HoldAwayRightBlock.length-1];
			this.HoldAwayRightBlock.pop();
		}

		if( PLP == this.AwayLeftShot && this.HoldHomeLeftBlock.length > 0){
			position = this.HoldHomeLeftBlock[this.HoldHomeLeftBlock.length-1];
			this.HoldHomeLeftBlock.pop();
		}

		if( PLP == this.AwayRightShot && this.HoldHomeRightBlock.length > 0){
			position = this.HoldHomeRightBlock[this.HoldHomeRightBlock.length-1];
			this.HoldHomeRightBlock.pop();
		}
		
		if(position == null){
			/*	If AI dont hold specific block card, 
			 *	trade card to see if AI can get it
			 */
			var tmp_p = this.TradeCard();
			if( (PLP == this.HomeLeftShot && this.cards[tmp_p] == this.AwayLeftBlock) 	||
				(PLP == this.HomeRightShot && this.cards[tmp_p] == this.AwayRightBlock) ||
				(PLP == this.AwayLeftShot && this.cards[tmp_p] == this.HomeLeftBlock) 	||
				(PLP == this.AwayRightShot && this.cards[tmp_p] == this.HomeRightBlock) )
			{
				position = tmp_p;
				this.popHold(position);
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

		this.RollDueDice(position);
	},

	useRefereeCard: function(){
		this.EndTurn();
	},

	RollDueDice: function(i){
		var self = this;
		game.dice.setAiPosition();
		game.dice.showdue();

		game.scene.addTimer( 1000, function(){
			game.dice.roll();
			game.scene.addTimer( 1000, function(){
				game.dice.stopRoll();
				game.scene.addTimer(500, self.Transit.bind(self, i));
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
			game.chip.moveChip( Math.max(game.dice.value1, game.dice.value2) );
			
			game.scene.addTimer( 500, game.gameround.PlayerTurn.bind(game.gameround) );			
		}else{
			this.LastPick = this.cards[i];
			switch(this.cards[i]){
				case 1: case 11:
					game.chip.moveChip( Math.max(die1, die2) );
					if(die1 == 1 || die2 == 1){	// Pass fail by rolling 1
						game.scene.addTimer(1000, this.PassFail.bind(this, i) );
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
						game.scene.addTimer(1000, this.ShotFail.bind(this, i) );
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
					game.scene.addTimer( 500, function(){
						game.chip.moveChip( (die1 + die2) );

						if(die1 == 1 || die2 == 1){
							game.scene.addTimer(1000, function(){
								self.switchToDeffence();
								game.Player.switchToOffence();
								game.chip.TurnOver();
								self.EndTurn();
							});
						}else{
							game.scene.addTimer(1000, this.EndTurn.bind(this) );
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
	},

	LostGoal: function(){
		console.log('Player Shot To Goal');
		this.LostGoalThisTurn = true;
		game.gameround.PlayerGetLastGoal = true;
		game.Player.Score++;
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
		game.scene.addTimer(1000, function(){
			if(self.GoalThisTurn){
				var goalsprite;
				if(this.Side == 'Home'){
					goalsprite = new game.Sprite('Goal_home');					
				}else if(this.Side == 'Away'){
					goalsprite = new game.Sprite('Goal_away');
				}
				goalsprite.anchor.set(0.5, 0.5);
				goalsprite.position.set(320, 480);
				goalsprite.click = goalsprite.tap = game.gameround.Rounding.bind(game.gameround);
				//game.gameround.Rounding();
			}else if( self.LostGoalThisTurn ){
				var goalsprite;
				if(this.Side == 'Away'){
					goalsprite = new game.Sprite('Goal_home');					
				}else if(this.Side == 'Home'){
					goalsprite = new game.Sprite('Goal_away');
				}
				goalsprite.anchor.set(0.5, 0.5);
				goalsprite.position.set(320, 480);
				goalsprite.click = goalsprite.tap = game.gameround.Rounding.bind(game.gameround);
				//game.gameround.Rounding();
			}else{
				game.gameround.PlayerTurn();
			}
		});
			
	}

});

});