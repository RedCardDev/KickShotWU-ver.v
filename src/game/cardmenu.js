game.module(
	'game.cardmenu'
).body(function() {

var SuperSpeed = 100;
var Debug = 3;
game.createClass('CardMenu', {
	
	cards: [
    	{Type: null, sprite: null}, 
    	{Type: null, sprite: null}, 
    	{Type: null, sprite: null}, 
    	{Type: null, sprite: null}, 
    	{Type: null, sprite: null}, 
    	{Type: null, sprite: null}
    ],

    select: 2,	// position that is currently select

    traded: false,

	init: function(cards_type_array){
		var self = this;

		this.blackSquare = new game.Sprite('blackSquare').addTo(game.scene.stage);
		this.blackSquare.scale.x = this.blackSquare.scale.y = 100;
		this.blackSquare.position.set(0, 0);
		this.blackSquare.alpha = 0.7;
		this.blackSquare.visible = false;

		this.textbox = new game.Sprite('textbox').addTo(game.scene.stage);
		this.textbox.scale.x = this.textbox.scale.y = 0.9;
		this.textbox.position.set(30, 360);
		this.textbox.visible = false;
			
		this.rightArrow = new game.Sprite('rightArrow').addTo(game.scene.stage);
		this.rightArrow.scale.x = this.rightArrow.scale.y = 0.3;
		this.rightArrow.position.set(560, 150);
		this.rightArrow.visible = false;
		this.rightArrow.buttonMode = true;
		this.rightArrow.interactive = true;
		this.rightArrow.click = this.rightArrow.tap = this.InteractRightArrow.bind(this);

        this.leftArrow = new game.Sprite('leftArrow').addTo(game.scene.stage);
        this.leftArrow.scale.x = this.leftArrow.scale.y = 0.3;
		this.leftArrow.position.set(0, 150);
		this.leftArrow.visible = false;
		this.leftArrow.buttonMode = true;
		this.leftArrow.interactive = true;
		this.leftArrow.click = this.leftArrow.tap = this.InteractLeftArrow.bind(this);

		this.useCardButton = new game.Sprite('useCardButton').addTo(game.scene.stage);
		this.useCardButton.scale.x = this.useCardButton.scale.y = 1.3;
		this.useCardButton.position.set(100, 730);
		this.useCardButton.visible = false;
		this.useCardButton.buttonMode = true;
		this.useCardButton.interactive = true;
		this.useCardButton.click = this.useCardButton.tap = this.InteractUseButton.bind(this);

        this.tradeButton = new game.Sprite('tradeButton').addTo(game.scene.stage);
        this.tradeButton.scale.x = this.tradeButton.scale.y = 1.3;
		this.tradeButton.position.set(350, 730);
		this.tradeButton.visible = false;
		this.tradeButton.buttonMode = true;
		this.tradeButton.interactive = true;
		this.tradeButton.click = this.tradeButton.tap = this.InteractTradeButton.bind(this);

		this.skipButton = new game.Sprite('skipButton').addTo(game.scene.stage);
		this.skipButton.scale.x = this.skipButton.scale.y = 1.3;
		this.skipButton.position.set(100, 830);
		this.skipButton.visible = false;
		this.skipButton.buttonMode = true;
		this.skipButton.interactive = true;
		this.skipButton.click = this.skipButton.tap = this.InteractSkipButton.bind(this);

        this.mainViewButton = new game.Sprite('mainViewButton').addTo(game.scene.stage);
        this.mainViewButton.scale.x = this.mainViewButton.scale.y = 1.3;
		this.mainViewButton.position.set(350, 830);
		this.mainViewButton.visible = false;
		this.mainViewButton.buttonMode = true;
		this.mainViewButton.interactive = true;	
		

		this.backButton = new game.Sprite('backButton', 490, 850, {
			anchor: {x: 0.5, y: 0.5},
			scale: {x: 0.5, y: 0.5}
		}).addTo(game.scene.stage);
		this.backButton.visible = false;
		this.backButton.buttonMode = true;
		this.backButton.interactive = true;
		this.backButton.click = this.backButton.tap = function(){
			self.backButton.visible = false;
			self.showMenu();
		};

		this.mainViewButton.click = this.mainViewButton.tap = function(){
			self.backButton.visible = true;
			self.hideMenu();
		};

		this.initSprite(cards_type_array);


		this.CardDes = new game.PIXI.Text('NULL', {
			font: '40px Comic Sans MS', 
			align: 'center'
		});
		this.CardDes.position.set(40, 380);
		this.CardDes.visible = false;
		game.scene.stage.addChild(this.CardDes);
		game.scene.addObject(this);
	},

	update: function(){
		switch(this.cards[this.select].Type){
			case 1: case 11:
				this.CardDes.setText('Roll Dice\nAdvance Ball By High Dice\n\nBall Turn Over \nOn Rolling 1 on Either Dice');
				break;
			case 2: case 3: case 12: case 13:
				this.CardDes.setText('Roll Dice\nAdvance Ball By Sum of Dices\n\nBall Turn Over \nIf Not Reach the End Of Zone');
				break;
			case 4: case 14:
				this.CardDes.setText('Roll Dice\nBall Turn Over\nIf No Rolling of 1 \nOn Either Dice');
				break;
			case 5: case 6: case 15: case 16:
				this.CardDes.setText('Must Use The Same Direction\nTo Block GoalShot\n\nRoll Dice\nAdvance The Ball\nBy Sum of Dices');
				break;
			default:
				if (Debug >= 1)
				{
					console.log('Update Error');
				}
		}

	},

	/* if player call showmenu after AI end the turn, use this show 
	 * this function is only used for trade button visible update
	 */
	

	showMenu: function(){
		this.blackSquare.visible = true;
		this.textbox.visible = true;
		if(this.select != this.cards.length-1){
			this.rightArrow.visible = true;
		}
		if(this.select != 0){
			this.leftArrow.visible = true;
		}
		this.useCardButton.visible = true;
		if(!this.traded){
			this.tradeButton.visible = true;
		}
		this.skipButton.visible = true;
		this.mainViewButton.visible = true;

		for(var i = 0; i < this.cards.length; i++){
			this.cards[i].sprite.visible = true;
		}

		this.CardDes.visible = true;
	},

	hideMenu: function(){
		this.blackSquare.visible = false;
		this.textbox.visible = false;
		this.rightArrow.visible = false;
		this.leftArrow.visible = false;
		this.useCardButton.visible = false;
		this.tradeButton.visible = false;
		this.skipButton.visible = false;
		this.mainViewButton.visible = false;

		for(var i = 0; i < this.cards.length; i++){
			this.cards[i].sprite.visible = false;
		}

		this.CardDes.visible = false;
	},

	initSprite: function(cards_type_array){
		var name;
		for(var i = 0; i < this.cards.length; i++){
			this.cards[i].sprite = new game.Sprite('BlankCard');
			this.ChangeSprite(cards_type_array[i], i);

			this.cards[i].sprite.position.set(0, 0);
			this.cards[i].sprite.anchor.set(0.5, 0.5);
			this.cards[i].sprite.visible = false;
			game.scene.stage.addChild(this.cards[i].sprite);	
		}	

		// 1st card position and size
		this.cards[0].sprite.position.set(140, 180);
    	this.cards[0].sprite.scale.set(0.01, 0.01);

    	// 2nd card postion and size
    	this.cards[1].sprite.position.set(140, 180);
    	this.cards[1].sprite.scale.set(0.2, 0.2);

    	// 3rd card postion and size
    	this.cards[2].sprite.position.set(320, 180);
    	this.cards[2].sprite.scale.set(0.4, 0.4);

    	// 4th card postion and size   	
    	this.cards[3].sprite.position.set(500, 180);
    	this.cards[3].sprite.scale.set(0.2, 0.2);

    	// 5th card postion and size
    	this.cards[4].sprite.position.set(500, 180);
    	this.cards[4].sprite.scale.set(0.01, 0.01);

    	// 6th card postion and size
    	this.cards[5].sprite.position.set(500, 180);
    	this.cards[5].sprite.scale.set(0.01, 0.01);

    	this.select = 2;
	},

	ChangeSprite: function(type, i){
		var name;
		switch(type){
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
				if (Debug >= 1)
				{
					console.log('Unknown cardType in iniSprite - cardmenu.js');
				}
				break;
		}

		this.cards[i].Type = type;
		this.cards[i].sprite.setTexture(name);
	},

	InteractRightArrow: function(){
    	var tweenGroup = new game.TweenGroup();

    	// =======  Left one zoom in ===========
    	if(this.select != 0){
			if (SuperSpeed == 1)
			{
				var zoom1 = new game.Tween(this.cards[this.select-1].sprite.scale);
				zoom1.to( {x: 0.01, y: 0.01 }, 5);
			}
			else
			{
				var zoom1 = new game.Tween(this.cards[this.select-1].sprite.scale);
				zoom1.to( {x: 0.01, y: 0.01 }, 500);
			}
			
	    	tweenGroup.add(zoom1);
    	}	    	

    	// =======  Middle one move to left ===========
		if (SuperSpeed == 1)
		{
			var tween2 = new game.Tween(this.cards[this.select].sprite.position);
			tween2.to( {x: 140 }, 500);
			var zoom2 = new game.Tween(this.cards[this.select].sprite.scale);
			zoom2.to( {x: 0.2, y: 0.2 }, 500);
		}
		else
		{
			var tween2 = new game.Tween(this.cards[this.select].sprite.position);
			tween2.to( {x: 140 }, 500/SuperSpeed);
			var zoom2 = new game.Tween(this.cards[this.select].sprite.scale);
			zoom2.to( {x: 0.2, y: 0.2 }, 500/SuperSpeed);
		}
		
    	tweenGroup.add(tween2);
    	tweenGroup.add(zoom2);

    	// =======  Right one move to middle ===========
		if (SuperSpeed == 1)
		{
			var tween3 = new game.Tween(this.cards[this.select+1].sprite.position);
			tween3.to( {x: 320 }, 500);
			var zoom3 = new game.Tween(this.cards[this.select+1].sprite.scale);
			zoom3.to( {x: 0.4, y: 0.4 }, 500);
		}
		else
		{
			var tween3 = new game.Tween(this.cards[this.select+1].sprite.position);
			tween3.to( {x: 320 }, 500/SuperSpeed);
			var zoom3 = new game.Tween(this.cards[this.select+1].sprite.scale);
			zoom3.to( {x: 0.4, y: 0.4 }, 500/SuperSpeed);
		}
    	tweenGroup.add(tween3);
    	tweenGroup.add(zoom3);

    	// ======= Hidden one zoomout to right =======
		if (SuperSpeed == 1)
		{
			if(this.select != this.cards.length-2){
				var zoom4 = new game.Tween(this.cards[this.select+2].sprite.scale);
				zoom4.to( {x: 0.2, y: 0.2 }, 500);
				tweenGroup.add(zoom4);    		
			}   	
    	}
		else
		{
			if(this.select != this.cards.length-2){
				var zoom4 = new game.Tween(this.cards[this.select+2].sprite.scale);
				zoom4.to( {x: 0.2, y: 0.2 }, 500/SuperSpeed);
				tweenGroup.add(zoom4);    		
			}   	
    	}
		
    	
    	tweenGroup.start();

    	this.select++;
    	if(this.select == 5){
    		this.leftArrow.visible = true;
    		this.rightArrow.visible = false;
    	}else{
    		this.leftArrow.visible = true;
    		this.rightArrow.visible = true;
    	}
    },

    InteractLeftArrow: function(){
    	var tweenGroup = new game.TweenGroup();

    	// =======  Hidden one zoom out to left ===========
		if (SuperSpeed == 1)
		{
			if(this.select != 1){
				var zoom1 = new game.Tween(this.cards[this.select-2].sprite.scale);
				zoom1.to( {x: 0.2, y: 0.2 }, 5);
				tweenGroup.add(zoom1); 
			}
		}
		else
		{
			if(this.select != 1){
				var zoom1 = new game.Tween(this.cards[this.select-2].sprite.scale);
				zoom1.to( {x: 0.2, y: 0.2 }, 500);
				tweenGroup.add(zoom1); 
			}
		}
		

    	// =======  Left one move to middle ===========
		if (SuperSpeed == 1)
		{
			var tween2 = new game.Tween(this.cards[this.select-1].sprite.position);
			tween2.to( {x: 320 }, 5);
			var zoom2 = new game.Tween(this.cards[this.select-1].sprite.scale);
			zoom2.to( {x: 0.4, y: 0.4 }, 5);
		}
		else
		{
			var tween2 = new game.Tween(this.cards[this.select-1].sprite.position);
			tween2.to( {x: 320 }, 500);
			var zoom2 = new game.Tween(this.cards[this.select-1].sprite.scale);
			zoom2.to( {x: 0.4, y: 0.4 }, 500);
		}
		
    	tweenGroup.add(tween2);
    	tweenGroup.add(zoom2);

    	// =======  Middle one move to right ===========
		if (SuperSpeed == 1)
		{
			var tween3 = new game.Tween(this.cards[this.select].sprite.position);
			tween3.to( {x: 500 }, 5);
			var zoom3 = new game.Tween(this.cards[this.select].sprite.scale);
			zoom3.to( {x: 0.2, y: 0.2 }, 5);
		}
		else
		{
			var tween3 = new game.Tween(this.cards[this.select].sprite.position);
			tween3.to( {x: 500 }, 500);
			var zoom3 = new game.Tween(this.cards[this.select].sprite.scale);
			zoom3.to( {x: 0.2, y: 0.2 }, 500);
		}
		
    	tweenGroup.add(tween3);
    	tweenGroup.add(zoom3);

    	// =======  Right one zoom in and hidden ===========
		
    	if(this.select != this.cards.length-1){
			if (SuperSpeed == 1)
			{	
				var zoom4 = new game.Tween(this.cards[this.select+1].sprite.scale);
				zoom4.to( {x: 0.01, y: 0.01 }, 5);
				tweenGroup.add(zoom4);
			}
			else
			{	
				var zoom4 = new game.Tween(this.cards[this.select+1].sprite.scale);
				zoom4.to( {x: 0.01, y: 0.01 }, 500);
				tweenGroup.add(zoom4);
			}
			
    	}

    	tweenGroup.start();

    	this.select--;
    	if(this.select == 0){
    		this.leftArrow.visible = false;
    		this.rightArrow.visible = true;
    	}else{
    		this.leftArrow.visible = true;
    		this.rightArrow.visible = true;
    	}

    },

    InteractUseButton: function(){
    	//game.Player.Permission(this.select); 
    	// Test the permisson of current select card
    	switch(this.cards[this.select].Type){
			case 1: case 11: // Pass Permission 
				if(!game.Player.currentOffence){
					var loremlong = "You are curretly not in Offence Phase. Can\'t use Pass Card. Please Try Use Other Cards";
					var text = new game.PIXI.Text(loremlong, {
						font: 'Foo', 
						wordWrap: true, 
						wordWrapWidth: 400,
						align: "center"
					});
					text.position.y = 400;
					game.scene.stage.addChild(text);
				}else{
					console.log('TestUsePass');
					this.hideMenu();
					game.Player.RollDueDice(this.select);
				}
				break;
			case 2: case 3: case 12: case 13:
				if(!game.Player.currentOffence){
					console.log('You are currently not in Offence! Not Able to use shot');
				}else{
					console.log('TestUseShot');
					this.hideMenu();
					game.Player.RollDueDice(this.select);
				}
				break;
			case 4: case 14:
				if(game.Player.currentOffence){
					console.log('You are currently in Offence! Not Able to use intercerpt');
				}else{
					this.hideMenu();
					game.Player.RollDueDice(this.select);
				}
				break;
			case 5: case 15: 
				if(game.Player.currentOffence){
					console.log('You are currently in Offence! Not Able to use UseLeftBlock');
				}else if(game.AI.LastPick == 3 || game.AI.LastPick == 13){
					console.log('The Block Direction is not the same as AI shot direction!');
				}else if(game.AI.LastPick == 2 || game.AI.LastPick == 12){
					this.hideMenu();
					game.Player.RollDueDice(this.select);
				}else{
					console.log('AI didn\'t use goal shot card, no need block');
				}
				break;
			case 6: case 16: 
				if(game.Player.currentOffence){
					console.log('You are currently in Offence! Not Able to use intercerpt');
				}else if(game.AI.LastPick == 2 || game.AI.LastPick == 12){
					console.log('The Block Direction is not the same as AI shot direction!');
				}else if(game.AI.LastPick == 3 || game.AI.LastPick == 13){
					this.hideMenu();
					game.Player.RollDueDice(select);
				}else{
					console.log('AI didn\'t use goal shot card, no need block');
				}
				break;
			default:
				console.log('Unknown cardType in UseCard- captain()');
				break;
		}
    },

    InteractSkipButton: function(){
    	this.hideMenu();
    	if( (game.AI.LastPick == 2  || game.AI.LastPick == 3 ||
    		 game.AI.LastPick == 12 || game.AI.LastPick == 13) && 
    		 game.chip.chipzone == 11 )
    	{	// if skip turn with AI has goal shot last turn 
    		game.Player.LostGoal();
    		game.Player.EndTurn();
    	}else{
    		game.Player.LastPick = null;
			if (SuperSpeed == 1)
			{
				game.scene.addTimer(10, game.gameround.AITurn.bind(game.gameround));
			}
			else
			{
				game.scene.addTimer(1000, game.gameround.AITurn.bind(game.gameround));
			}
			
    	}
    },

    InteractTradeButton: function(){
    	this.traded = true;
    	this.tradeButton.visible = false;
    	var type = game.Player.tradeCard(this.select);
    	this.ChangeSprite(type, this.select);

    }

});

});