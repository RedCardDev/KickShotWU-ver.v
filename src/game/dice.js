game.module(
    'game.dice'
).body(function() {

var SuperSpeed = 100;
var Debug = 3;

game.createClass('Dice', {
    rolling: false,
    value1: 1,
    value2: 1,
    sameRoll: false,
    timing: false,

    init: function() {
        this.die1 = new game.Sprite('dice1').addTo(game.scene.stage);
        this.die2 = new game.Sprite('dice1').addTo(game.scene.stage);
        this.die1.x = this.die2.x = -50;
        this.die1.anchor.set(0.5, 0.5);
        this.die2.anchor.set(0.5, 0.5);
        this.setPlayerPosition();

        game.scene.addObject(this);
    },

    update: function() {
        if (this.rolling && !this.timing) {
            var self = this;
            this.timing = true;
            this.sameRoll = false;
            this.value1 = ~~Math.randomBetween(1, 7);
            this.value2 = ~~Math.randomBetween(1, 7);
            if(this.value1 == this.value2)
            {
            	this.sameRoll = true;
            }

            // Print the dice roll
			if (Debug >= 2)
			{
				console.log('value1: ' + this.value1);
				console.log('value2: ' + this.value2);
				console.log('sameRoll: ' + this.sameRoll);
			}

            this.die1.setTexture('dice' + this.value1);
            this.die2.setTexture('dice' + this.value2);
			if (SuperSpeed == 1)
			{
				game.scene.addTimer(100, function() {
					self.timing = false;
				});
			}
			else
			{
				game.scene.addTimer(100/SuperSpeed, function() {
					self.timing = false;
				});
			}
			
        }
    },

    // Functions for rendering 2 die
    showdue: function() {
		if (SuperSpeed == 1)
		{
			game.scene.addTween(this.die1, {x: 100}, 500, { easing: game.Tween.Easing.Back.Out }).start();
			game.scene.addTween(this.die2, {x: 100}, 500, { easing: game.Tween.Easing.Back.Out }).start();
		}
		else
		{
			game.scene.addTween(this.die1, {x: 100}, 500/SuperSpeed, { easing: game.Tween.Easing.Back.Out }).start();
			game.scene.addTween(this.die2, {x: 100}, 500/SuperSpeed, { easing: game.Tween.Easing.Back.Out }).start();
		}
	},

    hidedue: function() {
		if (SuperSpeed == 1)
		{
			game.scene.addTween(this.die1, {x: -this.die1.width}, 500, { easing: game.Tween.Easing.Back.In }).start();
			game.scene.addTween(this.die2, {x: -this.die2.width}, 500, { easing: game.Tween.Easing.Back.In }).start();
		}
		else
		{
			game.scene.addTween(this.die1, {x: -this.die1.width}, 500/SuperSpeed, { easing: game.Tween.Easing.Back.In }).start();
			game.scene.addTween(this.die2, {x: -this.die2.width}, 500/SuperSpeed, { easing: game.Tween.Easing.Back.In }).start();
		}
		
	},

    // ============================================
    /* showsingle and hidesingle are used for homeaway decision, which roll single dice */
    showsingle: function(){
		if (SuperSpeed == 1)
		{
			game.scene.addTween(this.die1, {x: 100}, 500, { easing: game.Tween.Easing.Back.Out }).start();   
		}
		else
		{
			game.scene.addTween(this.die1, {x: 100}, 500/SuperSpeed, { easing: game.Tween.Easing.Back.Out }).start();   
		}
    },

    hidesingle: function(){
		if (SuperSpeed == 1)
		{
			game.scene.addTween(this.die1, {x: -this.die1.width}, 500, { easing: game.Tween.Easing.Back.In }).start();
		}
		else
		{
			game.scene.addTween(this.die1, {x: -this.die1.width}, 500/SuperSpeed, { easing: game.Tween.Easing.Back.In }).start();
		}
	},

    //=============================================

    roll: function() {
        this.rolling = true;
    },

    stopRoll: function() {
        this.rolling = false;
    },

    setPlayerPosition: function() {
        this.die1.y = game.system.height - 100;
        this.die2.y = game.system.height - 200;
    },

    setAiPosition: function() {
        this.die1.y = 100;
        this.die2.y = 200;
    },

    // not used
    reset: function() {
        this.value1 = 1;
        this.value2 = 1;
        this.sameRoll = false;
        this.die1.setTexture('dice1');
        this.die2.setTexture('dice1');
    }
});

});
