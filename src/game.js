let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.setAttribute("id", "myCanvas");
        this.canvas.width = 1500;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0].childNodes[2]);
        // this.interval = setInterval(updateGameArea, 20);
        c = this.canvas;
        ctx = c.getContext("2d");
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let o = 0;
let state = 0;
let playerCount = 2;
let doublePCount = playerCount * 2;
let n = 52 /*+ doublePCount*/;
let aCards;
let cardsDealt = 0;
let cardAmount = doublePCount;
let j = cardAmount;
let p1username = undefined;
let p2username = undefined;
let p3username = undefined;
let p4username = undefined;
let tempuser = 1;
let user = "player1";
let c;
let ctx;
let cardX;
let cardY;
let hands = [];
let cardID;
let playerToDeal;
let salt;
let coords = [];
let d;

let buttons = {
	call : document.createElement("button"),
    fold : document.createElement("button"),
    check : document.createElement("button"),
    raise : document.createElement("button"),
    initialize : function() {
        this.call.setAttribute("id", "call"),
        this.fold.setAttribute("id", "fold"),
        this.check.setAttribute("id", "check"),
        this.raise.setAttribute("id", "raise"),
        this.call.setAttribute("class", "button call"),
        this.fold.setAttribute("class", "button fold"),
        this.check.setAttribute("class", "button check"),
        this.raise.setAttribute("class", "button raise"),
    	this.fold.innerHTML = "fold",
        this.call.innerHTML = "call",
        this.raise.innerHTML = "raise",
        this.check.innerHTML = "check"
    }
}

buttons.initialize();

class Card {
	constructor(suit, value) {
    	this.suit = suit;
        this.value = value;
    }
    drawCard(suit, value, x, y) {
        // ion fuckin know
        function drawHeart(x, y) {
            ctx.beginPath();
            ctx.arc(x - 10, y, 10, 0, Math.PI, true);
            ctx.lineTo(x - 20, y);
            ctx.fillStyle = "Tomato";
            ctx.fill();
            ctx.strokeStyle = "Tomato";
            ctx.arc(x + 10, y, 10, 0, Math.PI, true);
            ctx.lineTo(x + 20, y);
            ctx.fill();
            ctx.moveTo(x + 20, y);
            ctx.lineTo(x, y + 30);
            ctx.lineTo(x - 20, y);
            ctx.fill();
            ctx.stroke();
        }
        function drawSpade(x, y) {
            ctx.beginPath();
            ctx.arc(x - 10, y + 10, 10, 0, Math.PI);
            ctx.lineTo(x - 20, y + 10);
            ctx.fillStyle = "Black";
            ctx.fill();
            ctx.strokeStyle = "Black";
            ctx.arc(x + 10, y + 10, 10, 0, Math.PI);
            ctx.lineTo(x - 20, y + 10);
            ctx.fill();
            ctx.moveTo(x - 20, y + 10);
            ctx.lineTo(x, y - 20);
            ctx.lineTo(x + 20, y + 10);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x - 20, y + 10, 20, 0, 0.5 * Math.PI);
            ctx.lineTo(x + 20, y + 30);
            ctx.arc(x + 20, y + 10, 20, 0.5 * Math.PI, Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        function drawClub(x, y) {
            ctx.beginPath();
            ctx.arc(x-10, y+10, 10, 0, 1.6*Math.PI);
            ctx.fillStyle = "Green";
            ctx.strokeStyle = "Green";
            ctx.arc(x+10, y+10, 10, 1.5*Math.PI, Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y-4, 10, 0, 2*Math.PI);
            ctx.fill()
            ctx.stroke()
            ctx.beginPath();
            ctx.arc(x-20, y+10, 20, 0, 0.5*Math.PI);
            ctx.lineTo(x+20, y+30);
            ctx.arc(x+20, y+10, 20, 0.5*Math.PI, Math.PI);
            ctx.fillStyle = "Green";
            ctx.fill();
            ctx.strokeStyle = "Green";
            ctx.stroke();
        }
        function drawDiamond(x, y) {
            ctx.beginPath();
            ctx.moveTo(x, y-10);
            ctx.quadraticCurveTo(x+4, y+6, x+15, y+10);
            ctx.quadraticCurveTo(x+4, y+14, x, y+30);
            ctx.quadraticCurveTo(x-4, y+14, x-15, y+10);
            ctx.quadraticCurveTo(x-4, y+6, x, y-10);
            ctx.fillStyle = "Blue";
            ctx.fill();
            ctx.strokeStyle = "Blue";
            ctx.stroke();
        }
        function drawFrame(x, y) {
            ctx.beginPath();
            ctx.roundRect(x-40, y-43, 80, 100, 5);
            ctx.strokeStyle = "Black";
            ctx.stroke();
        }
        switch (suit) {
            case "Hearts":
                drawHeart(x, y);
                ctx.font = "28px Arial";
                ctx.fillStyle = "Tomato";
                break;

            case "Spades":
                drawSpade(x, y);
                ctx.font = "28px Arial";
                ctx.fillStyle = "Black";
                break;

            case "Diamonds": 
                drawDiamond(x, y);
                ctx.font = "28px Arial";
                ctx.fillStyle = "Blue";
                break;

            case "Clubs": 
                drawClub(x, y);
                ctx.font = "28px Arial";
                ctx.fillStyle = "Green";
                break;
            
            case "FaceDown":
            case "Frame":
                drawFrame(x, y)
                return;
        }
        ctx.fillText(value, x - 34, y - 20);
    }
    drawFaceDown(x, y) {
        this.drawCard("FaceDown", 69, x, y);
    }
    draw(suit, value, x, y) {
        this.drawFaceDown(x, y);
        this.drawCard(suit, value, x, y);
    }
    drawFace(suit, value, x, y) {
        this.drawCard(suit, value, x, y);
    }
}

function switchUser() {
    tempuser++;
    if(tempuser >= playerCount + 1) {
        tempuser = 1;
    }
    user = `player${tempuser}`;
    return;
}

function refillCards() {
    // creates an array of n objects 1-n (n being the amount of cards)
    n = 52 /*+ doublePCount*/;
    aCards = [n];
    for (i = n; i >= 1; i--) {
        aCards[i] = i;
    }
    aCards.shift();
}

function startGame() {
    myGameArea.start();
    endRound();
    refillCards();
}

function updateGameArea() {
    return;
}

function increasePlayerCount() {
    if (cardsDealt != 0) {
        location.href = "rules.html";
    }
    if (playerCount <= 3) {
        playerCount++;
    }
    doublePCount = playerCount * 2;
    document.getElementById("playercount").innerHTML = "Player Count: " + playerCount;
}

function decreasePlayerCount() {
    if (cardsDealt != 0) {
        location.href = "rules.html";
    }
    if (playerCount >= 3) {
        playerCount--;
    }
    if(tempuser >= playerCount + 1) {
        tempuser = 1;
        user = `player${tempuser}`;
    }
    doublePCount = playerCount * 2;
    document.getElementById("playercount").innerHTML = "Player Count: " + playerCount;
}

function pickCard() {
    let i;
    i = aCards.length;
    let card = aCards[Math.floor(Math.random() * n) % i];
    let daqard = aCards.indexOf(card);
    aCards.splice(daqard, 1);
    let cardID = convertCard(card);
    return cardID
}

function convertCard(card) {
    let suit;
    let value;
    value = Math.floor(card / 4);
    value++;
    if (card >= 53) {
        value = "Joker";
        suit = undefined;
    }
    if (value != "Joker") {
        switch (value) {
            case 11:
                value = "J";
                break;
            case 12:
                value = "Q";
                break;
            case 13:
                value = "K";
                break;
            case 1:
            case 14:
            case 15:
                value = "A";
                break;
        }
        suit = card % 4;
        switch (suit) {
            case 0:
                suit = "Hearts";
                break;
            case 1:
                suit = "Diamonds";
                break;
            case 2:
                suit = "Clubs";
                break;
            case 3:
                suit = "Spades";
                break;
        }
    }
    cardID = new Card(suit, value)
    hands.push(cardID);
    console.log(hands);
    return cardID
}

function generateCards() {
    // button press
    if (aCards.length <= doublePCount + 5) {
        refillCards();
    }

    // sets the amount of cards to deal depending on the turn
    // deal to players
    if (cardsDealt == 0) {
        j = doublePCount;
    } 
    // deal on table
    else if (cardsDealt == doublePCount) {
        j = 3;
    } 
    // one more card
    else if (cardsDealt == doublePCount + 3) {
        j = 1;
    } 
    // another card because it doesnt want to if i do it the way i want
    else if (cardsDealt == doublePCount + 4) {
        j = 1;
    }
    // ends round
    else if (cardsDealt == doublePCount + 5) {
        showCards();
        if(o == 1) {
            endRound();
            return;
        }
        o++;

    }

    // for loop at home:
    while (true) {
        if (j == 0) {
            break;
        }
        let card = pickCard();
        deal(card);
        j--;
    }
}

function deal(card) {
    cardsDealt++;
    
    // see which players turn it is to get a card
    // this is for a variable amount of players
    y = cardsDealt % playerCount;

    // fixes which player to deal to
    playerToDeal = y % doublePCount;
    // makes sure it doesnt deal to the first player last
    playerToDeal--;
    if(playerToDeal == -1) {
        playerToDeal = playerCount - 1;
    }

    // if it hasn't dealt 2 cards per player
    if (cardsDealt <= doublePCount) {
        switch (playerToDeal) {
            case 0:
                giveCard("player1", card.value, card.suit);
                break;
            case 1:
                giveCard("player2", card.value, card.suit);
                break;
            case 2:
                giveCard("player3", card.value, card.suit);
                break;
            case 3:
                giveCard("player4", card.value, card.suit);
                break;
        }
    } else {
        giveCard("table", card.value, card.suit);
    }
}

function giveCard(player, value, suit) {
    if(user == player) {
        cardID.draw(suit, value, cardX, cardY);
    } else if(player == "table") {
        cardID.draw(suit, value, cardX, cardY);
    } else {
        cardID.drawFaceDown(cardX, cardY);
    }
    coords.push({"x":cardX,"y":cardY});
    cardX += 100;
}

function showCards() {
    // cancer
    switch(playerCount) {
        case 2:
            switch(user) {
                case "player1":
                    d = hands[1];
                    cardID.drawFace(d.suit, d.value, coords[1]["x"], coords[1]["y"]);
                    d = hands[3];
                    cardID.drawFace(d.suit, d.value, coords[3]["x"], coords[3]["y"]);
                    break;
                case "player2":
                    d = hands[0];
                    cardID.drawFace(d.suit, d.value, coords[0]["x"], coords[0]["y"]);
                    d = hands[2];
                    cardID.drawFace(d.suit, d.value, coords[2]["x"], coords[2]["y"]);
                    break;
                default:
                    location.href = "rules.html"
            }
            break;
        case 3:
            switch(user) {
                case "player1":
                    d = hands[1];
                    cardID.drawFace(d.suit, d.value, coords[1]["x"], coords[1]["y"]);
                    d = hands[4];
                    cardID.drawFace(d.suit, d.value, coords[4]["x"], coords[4]["y"]);
                    d = hands[2];
                    cardID.drawFace(d.suit, d.value, coords[2]["x"], coords[2]["y"]);
                    d = hands[5];
                    cardID.drawFace(d.suit, d.value, coords[5]["x"], coords[5]["y"]);
                    break;
                case "player2":
                    d = hands[0];
                    cardID.drawFace(d.suit, d.value, coords[0]["x"], coords[0]["y"]);
                    d = hands[2];
                    cardID.drawFace(d.suit, d.value, coords[2]["x"], coords[2]["y"]);
                    d = hands[3];
                    cardID.drawFace(d.suit, d.value, coords[3]["x"], coords[3]["y"]);
                    d = hands[5];
                    cardID.drawFace(d.suit, d.value, coords[5]["x"], coords[5]["y"]);
                    break;
                case "player3":
                    d = hands[0];
                    cardID.drawFace(d.suit, d.value, coords[0]["x"], coords[0]["y"]);
                    d = hands[1];
                    cardID.drawFace(d.suit, d.value, coords[1]["x"], coords[1]["y"]);
                    d = hands[3];
                    cardID.drawFace(d.suit, d.value, coords[3]["x"], coords[3]["y"]);
                    d = hands[4];
                    cardID.drawFace(d.suit, d.value, coords[4]["x"], coords[4]["y"]);
                    break;
                default:
                    location.href = "rules.html"
            }
            break;
        case 4:
            switch(user) {
                case "player1":
                    d = hands[1];
                    cardID.drawFace(d.suit, d.value, coords[1]["x"], coords[1]["y"]);
                    d = hands[3];
                    cardID.drawFace(d.suit, d.value, coords[3]["x"], coords[3]["y"]);
                    d = hands[2];
                    cardID.drawFace(d.suit, d.value, coords[2]["x"], coords[2]["y"]);
                    d = hands[5];
                    cardID.drawFace(d.suit, d.value, coords[5]["x"], coords[5]["y"]);
                    d = hands[6];
                    cardID.drawFace(d.suit, d.value, coords[6]["x"], coords[6]["y"]);
                    d = hands[7];
                    cardID.drawFace(d.suit, d.value, coords[7]["x"], coords[7]["y"]);
                    break;
                case "player2":
                    d = hands[0];
                    cardID.drawFace(d.suit, d.value, coords[0]["x"], coords[0]["y"]);
                    d = hands[2];
                    cardID.drawFace(d.suit, d.value, coords[2]["x"], coords[2]["y"]);
                    d = hands[3];
                    cardID.drawFace(d.suit, d.value, coords[3]["x"], coords[3]["y"]);
                    d = hands[4];
                    cardID.drawFace(d.suit, d.value, coords[4]["x"], coords[4]["y"]);
                    d = hands[6];
                    cardID.drawFace(d.suit, d.value, coords[6]["x"], coords[6]["y"]);
                    d = hands[7];
                    cardID.drawFace(d.suit, d.value, coords[7]["x"], coords[7]["y"]);
                    break;
                case "player3":
                    d = hands[0];
                    cardID.drawFace(d.suit, d.value, coords[0]["x"], coords[0]["y"]);
                    d = hands[1];
                    cardID.drawFace(d.suit, d.value, coords[1]["x"], coords[1]["y"]);
                    d = hands[3];
                    cardID.drawFace(d.suit, d.value, coords[3]["x"], coords[3]["y"]);
                    d = hands[4];
                    cardID.drawFace(d.suit, d.value, coords[4]["x"], coords[4]["y"]);
                    d = hands[5];
                    cardID.drawFace(d.suit, d.value, coords[5]["x"], coords[5]["y"]);
                    d = hands[7];
                    cardID.drawFace(d.suit, d.value, coords[7]["x"], coords[7]["y"]);
                    break;
                case "player4":
                    d = hands[0];
                    cardID.drawFace(d.suit, d.value, coords[0]["x"], coords[0]["y"]);
                    d = hands[1];
                    cardID.drawFace(d.suit, d.value, coords[1]["x"], coords[1]["y"]);
                    d = hands[2];
                    cardID.drawFace(d.suit, d.value, coords[2]["x"], coords[2]["y"]);
                    d = hands[4];
                    cardID.drawFace(d.suit, d.value, coords[4]["x"], coords[4]["y"]);
                    d = hands[5];
                    cardID.drawFace(d.suit, d.value, coords[5]["x"], coords[5]["y"]);
                    d = hands[6];
                    cardID.drawFace(d.suit, d.value, coords[6]["x"], coords[6]["y"]);
                    break;
                default:
                    location.href = "rules.html"
            }
            break;
        default:
            location.href = "rules.html"
    }
}

function endRound() {
    // resets everything
    o = 0;
    j = 0;
    cardsDealt = 0;
    ctx.clearRect(0, 0, c.width, c.height);
    hands = [];
    cardX = 60;
    cardY = 60;
}

function loginRedirect() {
    location.href = "login.html";
}

function loginRedirect2() {
    let loginInfo = { "uname": document.getElementById("uname").value, "pass": document.getElementById("pass").value };
    login(loginInfo);
}

function registerRedirect() {
    cpass = "asdasd";
    let regInfo = { "uname": document.getElementById("uname").value, "pass": document.getElementById("pass").value };
    register(regInfo);
}

function register(info) {
    location.href = "more.html";
}

function login(loginfo) {
    let sendata = { "type": "salt", "value": loginfo.uname };
    salt = send(sendata);
    sendata = { "type": "login", "value": loginfo };
    send(sendata);
}

async function send(data) {
    a = JSON.stringify(data);
    let response = await fetch("https://uxhebxje.ddns.net/", {
        credentials: "same-origin",
        method: "POST",
        body: a,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    console.log(response.text());
}