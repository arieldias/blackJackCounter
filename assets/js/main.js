$(document).ready(function(){
	var
	cartCount,
	pointsCount,
	totalCards,
	record,
	btn,
	card_icon,
	cardSelect,
	playerCards,
	dealerCards,
	basicStrategyChart;



	function init() {
		record = $("#submit-cards");
		btn = $(".multiplier_btn");
		card_icon = $(".card_number");
		cardSelect = $(".hand-player select");

		record.on("click",function(event){
			event.preventDefault();	
			handlePoints()		
		})

		btn.on("click", function(){
			changeAmount(this);
		})

		card_icon.on("click", function(){
			checking(this);
		})

		cardSelect.on("change",function(){
			settingCardsBySelection($(this));
			bestMove();
		})



		setInitalStage();


	}

	var 
	checking = function(element) {
		let el = $(element);
		if (el.is(":checked")) {
			updatePonits(parseInt( el.attr('multiplier') * getCardPoints(el.attr('val')) )     )
		} else {
			updatePonits(parseInt( el.attr('multiplier') * getCardPoints( el.attr('val')) ) *-1)
		}
	},

	updatePonits = function (entry) {
		pointsCount = pointsCount + entry;
		setTotalPoints(pointsCount);

		cardCount = calculateTotalPoints();
		setTotalCards(cardCount)

	},

	settingCardsBySelection = function(entry) {
		let index = parseInt(entry.attr('number'))-1;


		handleCardsBySelection( entry.hasClass("player-card") ? playerCards : dealerCards, index, entry)
	},

	handleCardsBySelection = function(cardSet, index, entry) {
		let card = $(".card_number#"+entry.find("option:selected").attr("value"));



		if (!entry.find("option:selected").attr("value")) {
			$(".card_number#"+cardSet[index]).siblings().find(".multiplier_btn.down").click();
			return;
		}

		 		
		if (typeof cardSet[index] != "undefined") {
			$(".card_number#"+cardSet[index]).siblings().find(".multiplier_btn.down").click();
		}
	
		if( card.is(":checked")) {		
			card.siblings().find(".multiplier_btn.up").click();			
		} else {
			card.click();
		}
		
		
		cardSet[index] = card.attr("id");	
		
	},

	getCardPoints = function(card) {
		let points;
		switch (card) {
		  case "2":
		  case "3":
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
		  case "A":
			points = -2;
		    break;
		}

		return points;
	},

	bestMove = function () {
		let playerHand = [], dealerHand = [], aP = false, playerValue;

		$(".player-card").each(function(i,e) {
			if (e.value != "Choose a card") {
				playerHand[i] = e.value;
				if (e.value == "A") {
					aP = i;
				}
			}
		})

		$(".dealer-card").each(function(i,e) {
			if (e.value != "Choose a card") {
				dealerHand[i] = e.value;
			}
		})

		if(dealerHand[0] && playerHand.length == 2 && (playerHand[0] == playerHand[1])) {
			setNextMove(basicStrategyChart.split[getValueById(playerHand[0])][getValueById(dealerHand[0])])
		}




		// if (c1 != "Choose a card" && c1 != "Choose a card" && d1 != "Choose a card" ) {
		// 	let v;
		// 	if (c1 == c2) {
		// 		console.log("SPLIT:")
		// 	} else if(c1 == "A" || c2 == "A") {

		// 		console.log("The A exists")
		// 		if (c1 == "A") {
		// 			console.log("the a is the 1")
		// 			c1 = (11 + getValueById(c2) > 21 ? 1 : 11)
		// 			console.log("and it's value is : " + c1)
		// 		} else {
		// 			console.log("the a is the 2")
		// 			c2 = (11 + getValueById(c1) > 21 ? 1 : 11)
		// 			console.log("and it's value is : " + c2)
		// 		}

		// 		setNextMove(getRealAction( basicStrategyChart.soft[getValueById(c1) + getValueById(c2)][d1]))

		// 	} else {
		// 		setNextMove( getRealAction( basicStrategyChart.hard[getValueById(c1) + getValueById(c2)][d1]) );				
		// 	}
		// }

	},

	changeAmount = function(element)  {
		let e = $(element);

		let brother = e.parent().siblings('input');
		let brotherMultiplier = brother.attr("multiplier");
		
		if (e.hasClass('up') && !e.hasClass('disabled')) {			
			
			e.parent().siblings().attr('multiplier', parseInt(brotherMultiplier) + 1);
			updatePonits(parseInt( getCardPoints(brother.attr("val"))) )


			if (parseInt(brotherMultiplier) + 1 == getNumberOfDecks()*4) {
				e.addClass("disabled")			
			} 
			
		} else if(e.hasClass('down')) {
			e.siblings(".up").removeClass("disabled")

			if (brotherMultiplier == 1) {
				e.parent().siblings('input').click();
			} else {
				e.parent().siblings().attr('multiplier', parseInt(brotherMultiplier) - 1);
				updatePonits(parseInt(getCardPoints(brother.attr("val")))*-1)
			}
			
		} 


	},

	setInitalStage  = function() {
		let numberOfDecks = getNumberOfDecks();

		cartCount = 0,
		pointsCount = 0,
		totalCards = numberOfDecks*52,	
		playerCards = {},
		dealerCards = {};
		

		setTotalCards(totalCards)
		setTotalPoints(0);

		setBasicStrategyChart();

	},

	setTotalCards = function (total) {
		$("#total-cards").text(total);
	},

	setTotalPoints = function (total) {
		$("#total-points").text(total);		
	},

	setNextMove = function(move) {
		$("#next_action").text(move)
	},

	calculateTotalPoints = function() {
		let t =0;
		$("input[type='checkbox']:checked").each(function(){
			t = t + parseInt($(this).attr('multiplier'));
		})

		return (totalCards - t);

	},


	getNumberOfDecks = function() {
		return 1;
	},

	getValueById = function(e) {
		if (e == "J" || e == "Q" || e == "K") {
			return 10;
		} else if (e == "A") {
			return "A";
		} else {
			return parseInt(e);
		}
	},



	setBasicStrategyChart = function() {
		basicStrategyChart = {
			hard: {
			    4: {
			    	2:  "H",
			    	3:  "H",
			    	4:  "H",
			    	5:  "H",
			    	6:  "H",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
			    },
				5: {
					2:  "H",
			    	3:  "H",
			    	4:  "H",
			    	5:  "H",
			    	6:  "H",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				6: {
					2:  "H",
			    	3:  "H",
			    	4:  "H",
			    	5:  "H",
			    	6:  "H",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				7: {
					2:  "H",
			    	3:  "H",
			    	4:  "H",
			    	5:  "H",
			    	6:  "H",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				8: {
					2:  "H",
			    	3:  "H",
			    	4:  "H",
			    	5:  "H",
			    	6:  "H",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				9: {
					2:  "H",
			    	3:  "Dh",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				10: {
					2:  "Dh",
			    	3:  "Dh",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "Dh",
			    	8:  "Dh",
			    	9:  "Dh",
			    	10: "H",
			    	A:  "H"
				},
				11: {					
					2:  "Dh",
			    	3:  "Dh",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "Dh",
			    	8:  "Dh",
			    	9:  "Dh",
			    	10: "Dh",
			    	A:  "H"
				},
				12: {
					2:  "H",
			    	3:  "H",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				13:{
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				14: {
					2:  "H",
			    	3:  "H",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				15: {
					2:  "H",
			    	3:  "H",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "Rh",
			    	A:  "H"
				},
				16: {
					2:  "H",
			    	3:  "H",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "H",
			    	8:  "H",
			    	9:  "Rh",
			    	10: "Rh",
			    	A:  "Rh"
				},
				17: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				},
				18: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				},
				19: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				},
				20: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				}
			},

			soft : {
			
				13:{
					2:  "H",
			    	3:  "H",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				14: {
					2:  "H",
			    	3:  "H",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				15: {
					2:  "H",
			    	3:  "H",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				16: {
					2:  "H",
			    	3:  "H",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				17: {
					2:  "Dh",
			    	3:  "Dh",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
				},
				18: {
					2:  "S",
			    	3:  "Ds",
			    	4:  "Ds",
			    	5:  "S",
			    	6:  "Ds",
			    	7:  "S",
			    	8:  "S",
			    	9:  "H",
			    	10: "H",
			    	A:  "S"
				},
				19: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "Ds",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				},
				20: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				},
				21: {
					2:  "S",
			    	3:  "S",
			    	4:  "S",
			    	5:  "S",
			    	6:  "S",
			    	7:  "S",
			    	8:  "S",
			    	9:  "S",
			    	10: "S",
			    	A:  "S"
				}
			},	

			split: {
				2: {
			    	2:  "Ph",
			    	3:  "Ph",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "P",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
			    },
			    3: {
			    	2:  "Ph",
			    	3:  "Ph",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "P",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
			    },
			    4: {
			    	2:  "H",
			    	3:  "H",
			    	4:  "H",
			    	5:  "Ph",
			    	6:  "Ph",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
			    },
			    5: {
			    	2:  "Dh",
			    	3:  "Dh",
			    	4:  "Dh",
			    	5:  "Dh",
			    	6:  "Dh",
			    	7:  "Dh",
			    	8:  "Dh",
			    	9:  "Dh",
			    	10: "H",
			    	A:  "H"
			    },
			    6: {
			    	2:  "Ph",
			    	3:  "P",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "H",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
			    },
			    7: {
			    	2:  "P",
			    	3:  "P",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "P",
			    	8:  "H",
			    	9:  "H",
			    	10: "H",
			    	A:  "H"
			    },
			    8: {
			    	2:  "P",
			    	3:  "P",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "P",
			    	8:  "P",
			    	9:  "P",
			    	10: "P",
			    	A:  "P"
			    },
			    9: {
			    	2:  "P",
			    	3:  "P",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "S",
			    	8:  "P",
			    	9:  "P",
			    	10: "S",
			    	A:  "S"
			    },
			    A: {
			    	2:  "P",
			    	3:  "P",
			    	4:  "P",
			    	5:  "P",
			    	6:  "P",
			    	7:  "P",
			    	8:  "P",
			    	9:  "P",
			    	10: "P",
			    	A:  "P"
			    }


			}
		};
	},

	getRealAction = function(action) {
		let result;
		switch(action){
			case "S":
				result = 'stand';
				break;
			
			case "H":
				result = 'hit';
				break;				

			case "S":
				result = 'stand';
				break;
			
			case "Dh":
				result = "Double if allowed otherwhise hit";
				break;
			
			case "Ds":
				result = "Double if allowed otherwhise stand";
				break;
			
			case "Rh":
				result = "Surrender if allowed otherwhise hit";
				break;

			case "Rs":
				result = "Surrender if allowed otherwhise stand";
				break;				
		}
		return result;
	},

	clearAll = function () {
		let inputs = $("input[type='checkbox']")
		inputs.attr('multiplier', 1);
		inputs.siblings().attr("multiplier", 1)

		inputs.each(function(){
			if(this.is(":checked")) {
				this.click();
			}
		})

		$("select").find("otion:first-child").click();

		setInitalStage();
	}

	init();
})