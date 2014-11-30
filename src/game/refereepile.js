game.module(
	'game.refereepile'
)
.body(function(){
	
game.createClass('RefereePile', {

	pile: [],

	NoDirectlyKick: 5,

	init: function(){
		var i;
		for(i = 0; i < this.NoDirectlyKick; i++){
			this.pile.push(0);
		}
	},

	Draw: function(){
		if(this.pile.length > 0){
			var cardType = this.pile[this.pile.length-1];
			this.pile.pop();
			this.NoDirectlyKick--;
			return cardType;
		}else{
			console.log('Referee Pile Is Empty');
			return null;
		}
	}

});


});