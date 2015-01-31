game.module(
	'game.warmup'
)
.require(
	'engine.scene',
	'engine.core',

	'game.assets',
	'game.captain',
	'game.AI',
	'game.pile',
	'game.refereepile',
	'game.dice',
	'game.chip',
	'game.cardmenu'
)
.body(function(){

/*	In order to call these value easily,
 *	set them to global value as game.***
 */
var Player = null;
var AI = null;
var RefereePile = null;
var chip = null;
var dice = null;

var gameround = null;

game.createScene('WarmUp', {

	Player_die1: 1,
	Player_die2: 1,
	AI_die1: 1,
	AI_die2: 1,

	PlayerIsHome: true,	// default to set player as home side
	PlayerGetLastGoal: true,
	PlayerLastPlay: true,

	NoRound: 0,			// number of the game turn

	// =================

	init: function(){
		var field = new game.Sprite('field');
		game.scene.stage.addChild(field);

		game.dice = new game.Dice();

		/*
		 * I'd like add a start button in the middle of the field
		 */
		this.NewGame();
	},

	NewGame: function(){
		var self = this;

		// =================
		var StartText = new game.BitmapText('Let\'s StartTEST', { font: 'Foo' });
		StartText.position.set(200, 500);
		var StartJudge = new game.Sprite('lion', 320, 400, {
			anchor: {x: 0.5, y: 0.5},
			scale: {x: 0.8, y: 0.8}
		});
		StartJudge.interactive = true;
		StartJudge.buttonMode = true;
		StartJudge.mouseover = function(){
			StartJudge.scale.set(1.0, 1.0);
		};
		StartJudge.mouseout = function(){
			StartJudge.scale.set(0.8, 0.8);
		};
		StartJudge.tap = StartJudge.click = function(){
			StartJudge.visible = false;
			StartText.setText('the text is still here'); // Todo: destroy this 

			self.HomeAway();				
		};

		StartText.addTo(game.scene.stage);
		game.scene.stage.addChild(StartJudge);
		
	},

	// =================================================================
	/*	Functions to decide HomeAway */
	HomeAway: function(){
		var d_str = "Roll single dice \nto determine \nwho is Home Side";
		var text = new game.BitmapText(d_str, { font: '60 Foo', align: 'center' });
		text.position.set(-400, 200);
		text.addTo(game.scene.stage);

		var tween1 = new game.Tween(text.position);
		tween1.to({x: 130}, 1000);
		tween1.easing( game.Tween.Easing.Back.Out);

		var tween2 = new game.Tween(text.position);
		tween2.to({x: 800}, 1000);
		tween2.easing(game.Tween.Easing.Back.In );
		tween2.delay(2000);

		tween2.onComplete(this.PlayerRollSingleDice.bind(this));

		tween1.chain(tween2);
		tween1.start();

	},

	/*	In case of the same roll value, Seperate Player's Roll with AI's Roll
	 * 	Once get the same roll, recursively till not same
	 */
	PlayerRollSingleDice: function(){
		var self = this;

		game.dice.setPlayerPosition();
		game.dice.showsingle();
		
		this.addTimer(1000, function(){
			game.dice.roll();
			self.addTimer(1000, function() {
	            game.dice.stopRoll();
	            self.SetDieValue(true);
	            self.addTimer(500, function(){
		            game.dice.hidesingle();
	            	self.AIRollSingleDice();
	        	});
	        });
		});			
	},

	AIRollSingleDice: function(){
		var self = this;
		this.addTimer(1000, function(){
    		game.dice.setAiPosition();
    		game.dice.showsingle();
    		self.addTimer(1000,function(){
    			game.dice.roll();
				self.addTimer(1000, function() {
		            game.dice.stopRoll();
		            self.SetDieValue(false);
		            self.addTimer(500, function(){
		            	game.dice.hidesingle();
		            	self.HAResult();
		            });
		        });
    		});
    	});
	},

	SetDieValue: function(IsPlayer){
		if(IsPlayer)	this.Player_die1 = game.dice.value1;
		else			this.AI_die1 = game.dice.value1;
	},

	HAResult: function(){
		//this.Player_die1 = 1;
		//this.AI_die1 = 2;
		var self = this;

		var Result = new game.BitmapText('You are Home Side!', {font: 'Foo'});
		Result.visible = false;

		var Ok_button = new game.BitmapText('OK', { font: 'Foo' } );
		Ok_button.position.set(275, 500);
		Ok_button.visible = false;
		Ok_button.interactive = true;
		Ok_button.buttonMode = true;
		Ok_button.tap = Ok_button.click = function(){
			Result.visible = false;
			Ok_button.visible = false;
			if(self.Player_die1 == self.AI_die1)
				self.PlayerRollSingleDice();
			else
				self.SetAfterHA();
		};

		if(this.Player_die1 > this.AI_die1){
			this.PlayerIsHome = true;
			Result.position.set(100, 400);
			Result.visible = true;
			Ok_button.visible = true;
		}else if(this.Player_die1 < this.AI_die1){
			this.PlayerIsHome = false;
			Result.setText('You Are Away Side!');
			Result.position.set(100, 400);
			Result.visible = true;
			Ok_button.visible = true;
		}else if(this.Player_die1 == this.AI_die1){	
			Result.setText('Same Dice Roll! \n    Roll Again!');
			Result.position.set(125, 350);
			Result.visible = true;
			Ok_button.visible = true;
		}else{
			console.log('Error at HAResult()');
			return;
		}

		Result.addTo(game.scene.stage);
		Ok_button.addTo(game.scene.stage);
	},

	// ====================================================================

	SetAfterHA: function(){
		this.NoRound = 0;

		game.Player = new game.Captain(this.PlayerIsHome);
		game.AI = new game.AI(!this.PlayerIsHome);
		game.RefereePile = new game.RefereePile();
		game.chip = new game.Chip();

		this.PlayerGetLastGoal = !this.PlayerIsHome;

		game.gameround = new game.GameRound(this.PlayerIsHome);
		game.gameround.Rounding();

	}
});

game.createClass('GameRound', {

	PlayerIsHome: true,
	PlayerGetLastGoal: true,
	PlayerLastPlay: true,

	NoRound: 0,

	init: function(PlayerIsHome){
		this.PlayerIsHome = PlayerIsHome;
		this.PlayerGetLastGoal = !PlayerIsHome;
	},

	EndGame: function(){

	},

	Winner: function() {
		if(game.Player.Score == 10 || game.Player.Score > game.AI.Score)
			console.log('You Win!');
		else if(game.AI.Score == 10 || game.AI.Score > game.Player.Score)
			console.log('You Loser!');
		else if(game.AI.Score == game.Player.Score)
			console.log('平手');
		else
			console.log('Unknown Error for final Scores');

		this.EndGame();
	},

	Rounding: function() {
		if(game.Player.Score == 10 || game.AI.Score == 10 ||
			game.Player.pile.IsEmpty() || game.AI.pile.IsEmpty() )
		{
			this.Winner();
		}else{
			game.Player.NewTurnInit();
			game.AI.NewTurnInit();

			this.KickOff();
		}
	},

	KickOff: function(){
		var self = this;
		game.chip.resetchip(this.PlayerIsHome, this.PlayerGetLastGoal);
		var str1 = "Your KickOff";
		var str2 = "AI KickOff";

		var text = new game.BitmapText(str1, { font: 'Foo', align: 'center' });
		text.position.set(-400, 300);

		var tween1 = new game.Tween(text.position);
		tween1.to({x: 150}, 600);
		tween1.easing( game.Tween.Easing.Back.Out);

		var tween2 = new game.Tween(text.position);
		tween2.to({x: 800}, 600);
		tween2.easing(game.Tween.Easing.Back.In );
		tween2.delay(2000);

		tween1.chain(tween2);

		if(this.PlayerGetLastGoal)	{
			game.Player.switchToDeffence();
			game.AI.switchToOffence();
			text.setText(str2);
			tween2.onComplete( function(){
				game.AI.RollDueDice(null);
			});		
		}else{
			game.AI.switchToDeffence();
			game.Player.switchToOffence();
			tween2.onComplete( function(){
				game.Player.RollDueDice(null);
			});	
		}	
		tween1.start();	
		text.addTo(game.scene.stage);
						
	},

	PlayerTurn: function(){
		var text = new game.BitmapText('Your Turn', { font: 'Foo', align: 'center' });
		text.position.set( -100, 600 );
		text.addTo(game.scene.stage);

		var tween1 = new game.Tween(text.position);
		tween1.to({x: 150 }, 700);

		var tween2 = new game.Tween(text.position);
		tween2.to({x: 700 }, 700);
		tween2.delay(700);

		tween2.onComplete(function(){
			game.dice.setPlayerPosition();
			game.Player.ShowCardPick();	
		});

		tween1.chain(tween2);
		tween1.start();		
	},

	AITurn: function(){
		var text = new game.BitmapText('AI\'s Turn', { font: 'Foo', align: 'center' });
		text.position.set( -100, 300 );
		text.addTo(game.scene.stage);

		var tween1 = new game.Tween(text.position);
		tween1.to({x: 150 }, 700);

		var tween2 = new game.Tween(text.position);
		tween2.to({x: 700 }, 700);
		tween2.delay(700);

		tween2.onComplete(function(){
			game.dice.setPlayerPosition();
			game.AI.StartThinking();	
		});

		tween1.chain(tween2);
		tween1.start();	
	}


});


});