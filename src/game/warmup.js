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
	'game.chip'
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

game.createScene('WarmUp', {

	Player_die1: 1,
	Player_die2: 1,
	AI_die1: 1,
	AI_die2: 1,

	PlayerIsHome: true,	// default to set player as home side

	NoRound: 0,			// number of the game turn

	// =================
	/*	Values for HomeAway()
	 */
	//StartJudge: null,


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
		this.HomeAway();
	},

	// =================================================================
	/*	Functions to decide HomeAway */
	HomeAway: function(){
		var self = this;

		// ===================
		/*	Roll Text is kind a button on right-bot corner
		 *	that click/tap on it will start dice rolling
		 */
		this.RollText = new game.BitmapText('Roll', { font: 'Foo' });
		this.RollText.visible = false;
		this.RollText.position.set(490, 850);
		this.RollText.interactive = true;
		this.RollText.buttonMode = true;
		this.RollText.tap = this.RollText.click = this.PlayerRollSingleDice.bind(this);

		// =================
		var StartText = new game.BitmapText('Let\'s Start', { font: 'Foo' });
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
			StartText.setText();
			self.RollText.visible = true;				
		};


		this.RollText.addTo(game.scene.stage);
		StartText.addTo(game.scene.stage);
		game.scene.stage.addChild(StartJudge);
		
	},

	/*	In case of the same roll value, Seperate Player's Roll with AI's Roll
	 * 	Once get the same roll, recursively till not same
	 */
	PlayerRollSingleDice: function(){
		var self = this;
		this.RollText.visible = false;

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
	},

	KickOff: function(){

	}

});


});