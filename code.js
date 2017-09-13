//CHARACTER STRUCTURE
function character(characterName, healthPoints, attackPower, pic_url){
	this.name =  characterName;
	this.hp = healthPoints;
	this.ap = attackPower;
	this.pic = pic_url; //link to pic
};

//Animate Once
var animateonce = function (id, animation, delay, speed){
  var classname = id.attr('class');
  if (typeof delay == 'undefined')
    delay = '0s';
  if (typeof speed == 'undefined')
    speed = "0.5s";
  id.removeClass().addClass(animation+" animated "+classname).css({"animation-delay":delay, "animation-duration":speed}).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
            $(this).addClass(classname)});
}

//RPG OBJECT
var rpg = {
	characters: [],
	chosenCharacter: null,
	chosenEnemy: null,
	beatenEnemy: [],
	gameState : 0, 
	//0: choose character
	//1: choose enemy
	//2: in-progress
	//3: win
	//4: lose / beat all enemies
	initChar: function(){
		//Push Characters to Array
		rpg.characters.push(new character("Chocobo",
										 Math.floor(Math.random()*1000)+100, 
										 Math.floor(Math.random()*20)+10,
										 "images/chocobo.jpg"));
		rpg.characters.push(new character("Moogle", 
										 Math.floor(Math.random()*1000)+100,
										 Math.floor(Math.random()*20)+10,
										 "images/moogle.jpg"));
		rpg.characters.push(new character("Cactuar", 
										  Math.floor(Math.random()*1000)+100,
										  Math.floor(Math.random()*20)+10,
										  "images/cactuar.jpg"));
		rpg.characters.push(new character("Tonberry", 
										  Math.floor(Math.random()*1000)+100,
										  Math.floor(Math.random()*20)+10,
										  "images/tonberry.jpg"));
	},
	init: function(){
		//Reinitialize values
		rpg.chosenCharacter = null;
		rpg.chosenEnemy = null;
		$("#attackBtn").hide();
		rpg.initChar();
	},
	attack: function(){
		//if game is still in progress
		if (rpg.gameState == 2)
		{
			rpg.characters[rpg.chosenEnemy].hp -= rpg.characters[rpg.chosenCharacter].ap; //decrease enemy hp
			//rpg.chosenCharacter.ap *= 1.2; //double attack point of char
			rpg.characters[rpg.chosenCharacter].ap = Math.floor(rpg.characters[rpg.chosenCharacter].ap*1.5);
			//rpg.characters[rpg.chosenCharacter].ap *= 2;
			if (rpg.characters[rpg.chosenEnemy].hp <= 0)
			{
				if (rpg.beatenEnemy.indexOf(rpg.chosenEnemy) == -1)
					rpg.beatenEnemy.push(rpg.chosenEnemy);
			}
			else if (rpg.characters[rpg.chosenCharacter].hp > 0) // elseif you still have hp, enemy attacks you
			{
				//decrease char hp
				rpg.characters[rpg.chosenCharacter].hp -= rpg.characters[rpg.chosenEnemy].ap;
				rpg.characters[rpg.chosenEnemy].ap =  Math.floor(rpg.characters[rpg.chosenEnemy].ap*1.2);
			
				if (rpg.characters[rpg.chosenCharacter].hp <= 0)
					rpg.gameState = 4;

			}
		}
	},
	display: function(){
		//Display Characters
		if (rpg.gameState == 0){
			rpg.init();
		}

		for (var i in rpg.characters)
		{
			if (rpg.beatenEnemy.indexOf(i) == -1)
			{
				let m = "<strong>HP :</strong> "+rpg.characters[i].hp+" &emsp;&emsp; <strong>AP :</strong> "+rpg.characters[i].ap;
				$(".ccard[value='"+i+"'] > .card-footer > .card-text").html(m);
				$(".ccard[value='"+i+"'] > .card-body > .card-title").html(rpg.characters[i].name);
				$(".ccard[value='"+i+"'] > img").attr("src", rpg.characters[i].pic);
			}
		}

		if (rpg.gameState == 1)
		{	
			
			$(".ccard[value='"+rpg.chosenCharacter+"']").css("filter", "drop-shadow(0px 0px 10px blue)")
			var ar = [];
			for (let i = 0; i < 4;i++)
				if (rpg.beatenEnemy.indexOf(i.toString()) == -1) ar.push(i);
			console.log(ar);
			for (let i in ar)
				if (ar[i] != rpg.chosenCharacter)
				{
					let oldfilter = $(".ccard[value='"+ar[i]+"']").css("filter");
					if (oldfilter == 'none') oldfilter = "";
					//console.log(oldfilter);
					$(".ccard[value='"+ar[i]+"']").css("filter", oldfilter+' '+"drop-shadow(0px 0px 10px red)");
				}
			$(".display-3").html("Pick an Enemy");

			if (rpg.chosenCharacter != null && rpg.chosenEnemy != null && rpg.gameState == 1)
				rpg.gameState = 2;
		}

		
		//Fighting Stage
		if (rpg.gameState == 2)
		{
			var ar = [];
			for (let i = 0; i < 4;i++)
				if (rpg.beatenEnemy.indexOf(i.toString()) == -1) ar.push(i);
			for (let i in ar)
				if (ar[i] != rpg.chosenCharacter && ar[i] != rpg.chosenEnemy)
					$(".ccard[value='"+ar[i]+"']").css("filter", '');

			//make visible attack button
			let m = "<button type=\"button\" class=\"btn btn-danger\" id=\"attackBtn\">Attack</button>";
			$(".attackdeck > .card[value='"+rpg.chosenEnemy+"']").html(m);
			$(".attackdeck > .card[value='"+rpg.chosenEnemy+"']").css("visibility", "visible");
			$(".display-3").html("Fight!");
			
			// If Enemy HP is 0 or below, change state to 'win'
			if (rpg.characters[rpg.chosenEnemy].hp <= 0)
				rpg.gameState = 3;
		}

		//If you win a round
		if (rpg.gameState == 3)
		{
			$(".ccard[value='"+rpg.chosenEnemy+"'] > .card-footer > .card-text").html("DEFEATED");
			$(".ccard[value='"+rpg.chosenEnemy+"']").css("filter", "brightness(70%)");
			$(".attackdeck > .card[value='"+rpg.chosenEnemy+"']").html('');
			$(".attackdeck > .card[value='"+rpg.chosenEnemy+"']").css('visibility', 'hidden');
			//choose new enemy
			rpg.gameState = 1;
			rpg.chosenEnemy = null;
			rpg.display();

		//if you beat all the enemies, you win and end the game
		}

		if (rpg.beatenEnemy.length == 3)
			rpg.gameState = 4;

		if (rpg.gameState == 4)
		{
			$(".attackdeck > .card[value='"+rpg.chosenEnemy+"']").html('');
			$(".attackdeck > .card[value='"+rpg.chosenEnemy+"']").css('visibility', 'hidden');

			if (rpg.characters[rpg.chosenCharacter].hp <= 0)
			{
				$(".ccard[value='"+rpg.chosenCharacter+"'] > .card-footer > .card-text").html("DEFEATED");
				$(".display-3").html("You died!");
				$(".ccard[value='"+rpg.chosenCharacter+"']").css("filter", "brightness(70%)");
				let m = "<button type=\"button\" class=\"btn btn-primary\" id=\"retryBtn\">Retry</button>";
				$(".attackdeck > .card[value='"+rpg.chosenCharacter+"']").html(m);
				$(".attackdeck > .card[value='"+rpg.chosenCharacter+"']").css("visibility", "visible");
			}
			else
			{
				$(".display-3").html("You Win!");
				let m = "<button type=\"button\" class=\"btn btn-primary\" id=\"retryBtn\">New Game</button>";
				$(".attackdeck > .card[value='"+rpg.chosenCharacter+"']").html(m);
				$(".attackdeck > .card[value='"+rpg.chosenCharacter+"']").css("visibility", "visible");
			}
		}

	}
};

//when a character button is clicked
$(".card").on('click', function(){
	//if you haven't chosen your main character
	console.log($(this).attr("value") != rpg.chosenCharacter);
	if (rpg.chosenCharacter == null && rpg.gameState == 0)
	{
		rpg.chosenCharacter = $(this).attr("value");
		rpg.gameState = 1;
		rpg.display();
	}
	//if you haven't chosen an enemy to battle
	else if (rpg.chosenEnemy == null && rpg.gameState == 1 && $(this).attr("value") != rpg.chosenCharacter)
	{
		rpg.chosenEnemy = $(this).attr("value");
		rpg.gameState = 2;
		rpg.display();
	}

});

//when attack button is clicked
$(".cardatk").on('click', '#attackBtn', function(){
	rpg.attack();
	animateonce($(".ccard[value='"+rpg.chosenEnemy+"']"), "shake", "0s", "0.3s");
	rpg.display();
});

$(".cardatk").on('click', '#retryBtn', function(){
	location.reload();
});

//when document is ready, call the display function
$(document).ready(function(){
	rpg.display();
})