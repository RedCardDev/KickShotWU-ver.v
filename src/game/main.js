game.module(
    'game.main'
).require(
    'engine.scene',

    'game.assets',
    'game.warmup'
)

.body(function(){

var SuperSpeed = 1;

game.createScene('Main', {
	backgroundColor: 0x629dc5,
	title: null,

	playButton: null,
    webButton: null,

    characters: ['racoon','hare','jaguar','weasel','lion','dog','crocodile'],
    cycle: null,
    charSprite: null,
    charIndex: 0,

    init: function() {
        this.title = new game.Sprite('title').addTo(this.stage);
        this.title.x = game.system.width / 2 - this.title.width / 2 + 10;
        this.title.y = -game.system.height / 4;

        this.playButton = new game.Sprite('play').addTo(this.stage);
        this.playButton.anchor.set(0.5, 0.5);
        this.playButton.x = -200;
        this.playButton.y = game.system.height / 2 + 350;
        this.playButton.interactive = true;
        this.playButton.click = this.playButton.tap = this.playClick.bind(this);

        this.webButton = new game.Sprite('web').addTo(this.stage);
        this.webButton.anchor.set(0.5, 0.5);
        this.webButton.x = game.system.width + 200;
        this.webButton.y = game.system.height / 2 + 350;
        this.webButton.interactive = true;
        this.webButton.click = this.webButton.tap = this.webClick.bind(this);

		if (SuperSpeed == 1)
		{
			this.addTween(this.title, {y: 80}, 8, {delay: 1, easing: game.Tween.Easing.Back.Out}).start();
			this.addTween(this.playButton, {x: game.system.width/2 - 150}, 8, {delay: 3, easing: game.Tween.Easing.Quadratic.Out}).start();
			this.addTween(this.webButton, {x: game.system.width/2 + 150}, 8, {delay: 3, easing: game.Tween.Easing.Quadratic.Out}).start();
		}
		else 
		{
			this.addTween(this.title, {y: 80}, 800, {delay: 100, easing: game.Tween.Easing.Back.Out}).start();
			this.addTween(this.playButton, {x: game.system.width/2 - 150}, 800, {delay: 300, easing: game.Tween.Easing.Quadratic.Out}).start();
			this.addTween(this.webButton, {x: game.system.width/2 + 150}, 800, {delay: 300, easing: game.Tween.Easing.Quadratic.Out}).start();		
		}
        
        this.cycle = this.characters.shuffle();
        this.nextCharacter();
    },

    playClick: function() {
        // stop character tween
        game.tweenEngine.stopTweensForObject(this.charSprite);
		if (SuperSpeed == 1)
		{
			this.addTween(this.charSprite, {x: -200}, 4, {delay: 1, easing: game.Tween.Easing.Back.In}).start();
			this.addTween(this.title, {y: -this.title.height}, 4, {delay: 1, easing: game.Tween.Easing.Back.In}).start();
			this.addTween(this.playButton, {x: -200}, 4,
				{delay: 2, easing: game.Tween.Easing.Back.In,
				onComplete: function() {
					game.system.setScene('WarmUp');
				}}).start();
			this.addTween(this.webButton, {x: game.system.width + 200}, 4, {delay: 2, easing: game.Tween.Easing.Back.In}).start();	
		}
		else
		{
			this.addTween(this.charSprite, {x: -200}, 400, {delay: 100, easing: game.Tween.Easing.Back.In}).start();
			this.addTween(this.title, {y: -this.title.height}, 400, {delay: 100, easing: game.Tween.Easing.Back.In}).start();
			this.addTween(this.playButton, {x: -200}, 400,
				{delay: 2, easing: game.Tween.Easing.Back.In,
				onComplete: function() {
					game.system.setScene('WarmUp');
				}}).start();
			this.addTween(this.webButton, {x: game.system.width + 200}, 400, {delay: 2, easing: game.Tween.Easing.Back.In}).start();
		}
        
    },

    webClick: function() {
        //Cocoon.App.openURL("http://www.kickshot.org");
    },

    nextCharacter: function() {
        if (this.charSprite == null) {
            this.charSprite = new game.Sprite(this.cycle[this.charIndex]).addTo(this.stage);
            this.charSprite.anchor.set(0.5, 0.5);
            this.charSprite.center();
            this.charSprite.x = -200;
            this.charSprite.scale.set(1.75, 1.75);
        } else {
            this.charSprite.x = -200;
            this.charIndex += 1;
            if (this.charIndex >= this.cycle.length) {
                this.cycle = this.characters.shuffle();
                this.charIndex = 0;
            }
            this.charSprite.setTexture(this.cycle[this.charIndex]);
        }

        var self = this;
		if (SuperSpeed == 1)
		{
			this.addTween(this.charSprite, {x: game.system.width / 2}, 6,
				{delay:5, easing: game.Tween.Easing.Back.Out, onComplete: function() {
					self.addTween(self.charSprite, {x: 800}, 6,
						{delay:20, easing: game.Tween.Easing.Back.In, onComplete: self.nextCharacter.bind(self)}).start();
				}}).start();
		}
		else
		{
			this.addTween(this.charSprite, {x: game.system.width / 2}, 600,
				{delay:50, easing: game.Tween.Easing.Back.Out, onComplete: function() {
					self.addTween(self.charSprite, {x: 800}, 600,
						{delay:2050, easing: game.Tween.Easing.Back.In, onComplete: self.nextCharacter.bind(self)}).start();
				}}).start();
		}
    }
});


});