$(document).ready(function(){
	var
	cartCount,
	pointsCount = 0,
	totalCards,
	record,
	btn,
	card_icon;



	function init() {
		record = $("#submit-cards");
		btn = $(".multiplier_btn");
		card_icon = $(".card_number");

		record.on("click",function(event){
			event.preventDefault();	
			handlePoints()		
		})

		btn.on("click", function(){
			changeAmount(this);
		})

		card_icon.on("click", function(){
			handlePoints(this);
		})



		setInitalStage();


	}

	var 
	handlePoints = function() {
		var cards = $(".card_number:checked");

		console.log(cards);
	},

	getCardPoints = function(card) {
		let points;
		switch (card) {
		  case "2":
		  case "4":
		  case "6":
		    points = 2;
		    break;

		  case "5":
		    points = 3;
		    break;

		  case "7":
		    points = 1;
		    break

		  case "8":
		    points = 0;
		    break;

		  case "9":
		    points = -1;
		    break;

		  case "10":
		  case "1":
		  case "11":
			points = -2;
		    break;
		}

		return points;
	},

	changeAmount = function(element)  {
		let e = $(element);

		let brotherMultiplier = e.parent().siblings('input').attr("multiplier");
		
		if (e.hasClass('up')) {			
			e.parent().siblings().attr('multiplier', parseInt(brotherMultiplier) + 1);
		} else if(e.hasClass('down')) {
			if (brotherMultiplier == 1) {
				e.parent().siblings('input').click();
			} else {
				e.parent().siblings().attr('multiplier', parseInt(brotherMultiplier) - 1);
			}

		} else {
			alert("ooopps! Something went wrong!! changeAmount function")
		}
	},

	setInitalStage  = function() {
		let numberOfDecks = getNumberOfDecks();

		setTotalCards(numberOfDecks*52)
		setTotalPoints(0);

		


	},

	setTotalCards = function (total) {
		$("#total-cards").text(total);
	},

	setTotalPoints = function (total) {
		$("#total-points").text(total);
	},


	getNumberOfDecks = function() {
		return 1;
	}

	init();
})