game.module(
	'game.chip'
)
.body(function(){

var SuperSpeed = 100;
var Debug = 3;

game.createClass('Chip', {

	Side: null,

	chipzone: 0,
	/*	Just make sure here, 
	 *	negative chiplocation is Player's side
	 *  positive chiplocation is AI's side
	 */

	chipY_axis: [
		{zone: -11, Y_axis: 60},
		{zone: -10, Y_axis: 99},
		{zone: -9, Y_axis: 139},
		{zone: -8, Y_axis: 178},
		{zone: -7, Y_axis: 218},
		{zone: -6, Y_axis: 258},
		{zone: -5, Y_axis: 298},
		{zone: -4, Y_axis: 338},
		{zone: -3, Y_axis: 378},
		{zone: -2, Y_axis: 418},
		{zone: -1, Y_axis: 456},
		{zone: 0,  Y_axis: 480},
		{zone: 1,  Y_axis: 507},
		{zone: 2,  Y_axis: 546},
		{zone: 3,  Y_axis: 584},
		{zone: 4,  Y_axis: 622},
		{zone: 5,  Y_axis: 660},
		{zone: 6,  Y_axis: 699},
		{zone: 7,  Y_axis: 737},
		{zone: 8,  Y_axis: 776},
		{zone: 9,  Y_axis: 815},
		{zone: 10, Y_axis: 854},
		{zone: 11, Y_axis: 895}
	],

	init: function(){
		this.Side = 'Home',
		this.chipzone = 0;

		this.chip = new game.Sprite('chip-home', 320, 480, {
			anchor: {x: 0.5, y: 0.5},
			scale: {x: 0.7, y: 0.7}
		}).addTo(game.scene.stage);
		//this.chip.visible = false;

		game.scene.addObject(this);
	},

	Locate: function(){
		return this.chipzone;
	},

	TurnOver: function(){
		if(this.Side == 'Home')	{
			this.Side = 'Away';
			this.chip.setTexture('chip-away');
			// ball turn over animation
		}else if(this.Side == 'Away'){
			this.Side = 'Home';
			this.chip.setTexture('chip-home');
			// ball turn over animation
		}else{
			console.log('Error: Unknown chip side!');
		}
		if (Debug >= 2)
		{
			console.log('The chip was turned over');
			console.log('Chip Side: '+this.Side);
		}
		
	},

	resetchip: function(PlayerIsHome, PlayerGetLastGoal){
		this.chipzone = 0;
		if(( PlayerIsHome  && !PlayerGetLastGoal) ||
		    (!PlayerIsHome && PlayerGetLastGoal))
		{
			if (Debug >= 3)
			{
				console.log('Set to HomeChip');
			}
			this.Side = 'Home';
			this.chip.setTexture('chip-home');
		}else if((!PlayerIsHome && !PlayerGetLastGoal) || 
			  	 ( PlayerIsHome &&  PlayerGetLastGoal))
		{
			if (Debug >= 3)
			{
				console.log('Set To AwayChip');
			}
			this.Side = 'Away';
			this.chip.setTexture('chip-away');
		}else{
			if (Debug >= 1)
			{
				console.log('Error: chip side error when resetchip()');
			}
		}
		this.chip.position.set(320, 480);
		this.chip.visible = true;
	},

	moveChip: function(distance){		
		var lastchipzone = this.chipzone;
		if(game.Player.currentOffence)	this.chipzone -= distance;
		else							this.chipzone += distance;

		if( this.lastchipzone < 0 && this.chipzone >= 0 )
			this.chipzone++;
		else if( this.lastchipzone > 0 && this.chipzone <= 0 )
			this.chipzone--;

		if(this.chipzone > 11)		this.chipzone = 11;
		if(this.chipzone < -11)		this.chipzone = -11;

		var tween = new game.Tween(this.chip.position);
		var Y_axis = this.chipY_axis[this.chipzone + 11].Y_axis;
		if (SuperSpeed == 1)
		{	
			tween.to({y: Y_axis}, 500);
		}
		else
		{	
			tween.to({y: Y_axis}, 500/SuperSpeed);
		}
		tween.start();
		

		console.log();
		if (Debug >= 3)
		{
			console.log('Current Chip zone: '+this.chipzone);
		}
	}

});


});