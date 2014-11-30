game.module(
	'game.pile'
).
body(function() {


game.createClass('Pile', {
	/* 17 pass cards
	 * 5 left/right goal shot cards
	 * 5 defence cards each
	 * total 42 cards
	 */
	NoPass: 	 17,
	NoLeftShot:   5,
	NoRightShot:  5,
	NoIntercept:  5,
	NoLeftBlock:  5,
	NoRightBlock: 5,
	//=================================
	cards: [], 


	init: function(piletype, c_gone){	// c_gone means the cards had been taken away
		
		switch(piletype){
			case "home": case "Home":
				console.log('create homepile');
				this.HomePile(c_gone);
				break;
			case "away": case "Away":
				console.log('create awaypile');
				this.AwayPile(c_gone);
				break;
			default:
				console.log('Unknown pile type');
				break;
		}
	},

	HomePile: function(c_gone){
		
		var i,j;

		for(i = 0; i < c_gone.length; i++){
			switch(c_gone[i]){
				case 1: this.NoPass--; break;
				case 2: this.NoLeftShot--; break;
				case 3: this.NoRightShot--; break;
				case 4: this.NoIntercept--; break;
				case 5: this.NoLeftBlock--; break;
				case 6: this.NoRightBlock--; break;
				default:
					console.log('Undefined card type in cards has been taken away');
					break;
			}
		}
		console.log('After taken away cards');
		console.log(this.NoPass);
		console.log(this.NoLeftShot);
		console.log(this.NoRightShot);
		console.log(this.NoIntercept);
		console.log(this.NoLeftBlock);
		console.log(this.NoRightBlock);
		/* 1. write down all the cards in order */
		for(i = 0; i < this.NoPass; i++){
			this.cards.push(1);
		}

		for(i = 2; i <= 6; i++){
			for(j = 0; j < 5; j++){
				this.cards.push(i);
			}
		}
		// ================

	},

	AwayPile: function(c_gone){

		var i,j;

		for(i = 0; i < c_gone.length; i++){
			switch(c_gone[i]){
				case 11: this.NoPass--; break;
				case 12: this.NoLeftShot--; break;
				case 13: this.NoRightShot--; break;
				case 14: this.NoIntercept--; break;
				case 15: this.NoLeftBlock--; break;
				case 16: this.NoRightBlock--; break;
				default:
					console.log('Undefined card type in cards has been taken away');
					break;
			}
		}
		console.log('After taken away cards');
		console.log(this.NoPass);
		console.log(this.NoLeftShot);
		console.log(this.NoRightShot);
		console.log(this.NoIntercept);
		console.log(this.NoLeftBlock);
		console.log(this.NoRightBlock);
		/* 1. write down all the cards in order */
		for(i = 0; i < this.NoPass; i++){
			this.cards.push(11);
		}

		for(i = 2; i <= 6; i++){
			for(j = 0; j < 5; j++){
				this.cards.push(i+10);
			}
		}

	},

	Shuffle: function(){	// Fisher-Yates shuffle
		var i,j;
		var tmp;
		for(i = this.cards.length-1; i >= 1; i--){
			j = ~~Math.randomBetween(0, i);
			tmp = this.cards[i];
			this.cards[i] = this.cards[j];
			this.cards[j] = tmp;
		}
	},

	DrawCard: function(){
		if(this.cards.length > 0){
			var cardtype = this.cards[this.cards.length-1];
			this.cards.pop();
			switch(cardtype){
				case 1: case 11: this.NoPass--; break;
				case 2: case 12: this.NoLeftShot--; break;
				case 3: case 13: this.NoRightShot--; break;
				case 4: case 14: this.NoIntercept--; break;
				case 5: case 15: this.NoLeftBlock--; break;
				case 6: case 16: this.NoRightBlock--; break;
				default: console.log('Unknown type of card when drawing'); break;
			}
			return cardtype;
		}else{
			console.log('Pile is Empty now');
			return null;
		}
	},

	NoCards: function(){
		return this.NoPass+this.NoLeftShot+this.NoRightShot+this.NoIntercept+this.NoLeftBlock+this.NoRightBlock;
	}



});

});