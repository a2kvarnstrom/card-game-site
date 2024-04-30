try {
    document.getElementById("betBar").addEventListener("mouseover", () => {
        document.body.style.cursor = "pointer";
    });
    document.getElementById("betBar").addEventListener("mouseout", () => {
        document.body.style.cursor = "default";
    });
} catch(referenceError) {}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.setAttribute("id", "myCanvas");
        this.canvas.width = 1500;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0].childNodes[2]);
        this.interval = setInterval(updateGameArea, 20);
        c = this.canvas;
        ctx = c.getContext("2d");
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let isChoosing;
let pRaised = true;
let aiRaised = 0;
let o = 0;
let state = 0;
let playerCount = 4;
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
let salt = undefined;
let coords = [];
let d;
let chips = {
    1:50,
    2:50,
    3:50,
    4:50
};
let bet = {
    1:0,
    2:0,
    3:0,
    4:0
};
let minBet = 2;
let pot = 0;
let currentBet = 0;
let sBlind = minBet;
let bBlind = minBet * 2;
let folded = false;
let currentPlayer = 1;
let cards = {
    "player1" : [

    ],
    "player2" : [

    ],
    "player3" : [

    ],
    "player4" : [

    ],
    "table" : [
            
    ]
};

class Card {
	constructor(suit, value, x, y) {
    	this.suit = suit;
        this.value = value;
        this.x = x;
        this.y = y;
    }
    drawCard(suit, value) {
        // ion fuckin know
        let x = this.x;
        let y = this.y;
        function drawHeart() {
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
    drawFaceDown() {
        this.drawCard("FaceDown", 69);
    }
    draw(suit, value) {
        this.drawCard("Frame", 69);
        this.drawCard(suit, value);
    }
    drawFace(suit, value) {
        this.drawCard(suit, value);
    }
    newPos(x, y) {
    	this.x += x;
    	this.y += y;
    }
    setPlayer(player) {
        this.player = player;
    }
}

function switchUser() {
    if (cardsDealt != 0) {
        location.href = "rules.html";
        return;
    }
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
    refillCards();
    endRound();
}

function reDraw() {
    myGameArea.clear();
    try {
        let x = 0;
        while(true) {
            if(user == hands[x].player) {
                hands[x].draw(hands[x].suit, hands[x].value);
            } else if(hands[x].player == "table") {
                hands[x].draw(hands[x].suit, hands[x].value);
            } else if (user != hands[x].player) {
                hands[x].drawFaceDown();
            }
            x++;
            if(x == cardsDealt) {
                return;
            }
        }
    }
    catch(referenceError) {}
}

function updateGameArea() {
    reDraw();
}

function increasePlayerCount() {
    if (cardsDealt != 0) {
        location.href = "rules.html";
        return;
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
        return;
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
    cardID = new Card(suit, value, cardX, cardY)
    hands.push(cardID);
    return cardID
}

async function generateCards() {
    if(cardsDealt == doublePCount + 5) {
        return;
    }
    let o = 0;
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
    else if (cardsDealt >= doublePCount + 3) {
        j = 1;
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
    if(cardsDealt == doublePCount + 5) {
        document.getElementById("ShowCards").hidden = false;
        o++;
        await sleep(2000);
        endRound();
    }
    if(folded == true) {
        if(o == 0) {
            nextTurn();
        }
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
                cards.player1.push(card);
                break;
            case 1:
                giveCard("player2", card.value, card.suit);
                cards.player2.push(card);
                break;
            case 2:
                giveCard("player3", card.value, card.suit);
                cards.player3.push(card);
                break;
            case 3:
                giveCard("player4", card.value, card.suit);
                cards.player4.push(card);
                break;
        }
    } else {
        giveCard("table", card.value, card.suit);
        cards.table.push(card);
    }
}

function giveCard(player, value, suit) {
    cardID.setPlayer(player);
    if(user == player) {
        cardID.draw(suit, value);
    } else if(player == "table") {
        cardID.draw(suit, value);
    } else if (user != player) {
        cardID.drawFaceDown();
    }
    coords.push({"x":cardX,"y":cardY});
    cardX += 100;
}

function showCards() {
    let j;
    // cancer
    switch(playerCount) {
        case 2:
            switch(user) {
                case "player1":
                    j = [1, 3];
                    for(let i = 1; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                case "player2":
                    j = [0, 2];
                    for(let i = 1; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                default:
                    location.href = "rules.html"
            }
            break;
        case 3:
            switch(user) {
                case "player1":
                    j = [1, 2, 4, 5];
                    for(let i = 3; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                case "player2":
                    j = [0, 2, 3, 5];
                    for(let i = 3; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                case "player3":
                    j = [0, 1, 3, 4];
                    for(let i = 3; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                default:
                    location.href = "rules.html"
            }
            break;
        case 4:
            switch(user) {
                case "player1":
                    j = [1, 2, 3, 5, 6, 7];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                case "player2":
                    j = [0, 2, 3, 4, 6, 7];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                case "player3":
                    j = [0, 1, 3, 4, 5, 7];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
                    break;
                case "player4":
                    j = [0, 1, 2, 4, 5, 6];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        cardID.drawFace(d.suit, d.value, coords[j[i]]["x"], coords[j[i]]["y"]);
                    }
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
    currentPlayer = 1;
    bet = {
        1:0,
        2:0,
        3:0,
        4:0
    };
    currentBet = 0;
    isChoosing = false;
    document.getElementById("betBar").addEventListener('mousedown', (e) => {
        isChoosing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    document.getElementById("betBar").addEventListener('mousedown', choosebet);
    document.getElementById("betBar").addEventListener('mousemove', choosebet);
    document.body.addEventListener('mouseup', () => isChoosing = false);
    cards = {
        "player1" : [
    
        ],
        "player2" : [
    
        ],
        "player3" : [
    
        ],
        "player4" : [
    
        ],
        "table" : [
            
        ]
    };
    document.getElementById("ShowCards").hidden = true;
    if(chips[currentPlayer] != 0) {
        folded = false;
    } else {
        alert("you lose lol");
        location.href = "index.html";
    }
    pRaised = 0;
    aiRaised = 0;
    pot = 0;
    o = 0;
    j = 0;
    cardsDealt = 0;
    ctx.clearRect(0, 0, c.width, c.height);
    hands = [];
    cardX = 60;
    cardY = 60;
    nextTurn();
}

function call() {
    if(folded == true) {
        return;
    }
    if(currentBet == 0) {
        check();
        return;
    }
    if(currentPlayer == tempuser) {
        pRaised = false;
    }
    console.log(currentPlayer + ": call -> " + currentBet);
    if(bet[currentPlayer] == currentBet) {
        bet[currentPlayer] = 0;
        nextTurn();
        return;
    }
    bet[currentPlayer] = currentBet;
    /*if(currentBet >= chips[1] + 1) {
        bet[1] = chips[1];
        folded = true;
    }*/
    nextTurn();
}

function fold() {
    if(folded == true) {
        return;
    }
    pRaised = false;
    console.log(currentPlayer + ": fold");
    folded = true;
    nextTurn();
}

function check() {
    if(folded == true) {
        return;
    }
    console.log(currentPlayer + ": check");
    if(currentBet == 0) {
        bet[currentPlayer] = 0;
        nextTurn();
    }
}

function raise(amount) {
    if(folded == true) {
        return;
    }
    if(amount) {
        aiRaised = currentPlayer;
        if(aiRaised == 1) {
            aiRaised = 2;
        }
        bet[currentPlayer] = currentBet + amount;
        currentBet = bet[currentPlayer];
        console.log(currentPlayer + ": raise -> " + currentBet);
        nextTurn();
        return;
    }
    // for player
    pRaised = true;
    /*if(chips[1] == 0) {
        folded = true;
        nextTurn();
        return;
    }*/
    if(document.getElementById("bet").hidden == false) {
        currentBet = currentBet + bet[currentPlayer];
        bet[currentPlayer] = currentBet;
        console.log(currentPlayer + ": raise -> " + currentBet);
        nextTurn();
        return;
    }
    // shows the "progress" bar with the bet
    // 
    document.getElementById("betBar").hidden = false;
    document.getElementById("bet").hidden = false;
    let j = minBet / chips[currentPlayer];
    bet[currentPlayer] = minBet;
    let width = j * 100;
    if(minBet >> chips[currentPlayer]) {
        bet[currentPlayer] = chips[currentPlayer];
        width = 100;
    }
    document.getElementById("bet").innerHTML = "bet: " + bet[currentPlayer];
    document.getElementById("bar").style.width = width + "%";
}

function choosebet(e) {
    if(!isChoosing) return;
    // sets the bet and how much of the bar it loads
    // 
    let pxval = document.getElementById("betBar").clientWidth;
    let maxWidth = pxval / 100;
    // e = Mouse Click Event
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    // makes the width scaled to 100 (aka into percentage)
    let width = x / maxWidth;
    width = Math.ceil(width);
    // i is width scaled to 1 (so you can multiply with it)
    let i = width / 100;
    // converts click position to bet
    bet[currentPlayer] = chips[currentPlayer] * i;
    bet[currentPlayer] = Math.ceil(bet[currentPlayer]);
    // checks if bet is lower than minimum
    let j = bet[currentPlayer] / chips[currentPlayer];
    // makes one width per bet (you could have less than max width but max bet)
    width = j * 100;
    if(bet[currentPlayer] >= chips[currentPlayer]) {
        bet[currentPlayer] = chips[currentPlayer];
    }
    if(bet[currentPlayer] <= minBet) {
        let j = minBet / chips[currentPlayer];
        bet[currentPlayer] = minBet;
        width = j * 100;
    }
    if(minBet >> chips[currentPlayer]) {
        bet[currentPlayer] = chips[currentPlayer];
        width = 50;
    }
    document.getElementById("bet").innerHTML = "bet: " + bet[currentPlayer];
    document.getElementById("bar").style.width = width + "%";
    if(bet[currentPlayer] == chips[currentPlayer]) {
        document.getElementById("bet").innerHTML = "bet: ALL IN";
    }
}

function nextTurn() {
    if(chips[1] == 0) {
        folded = true;
    }
    document.getElementById("betBar").hidden = true;
    document.getElementById("bet").hidden = true;
    chips[currentPlayer] = chips[currentPlayer] - bet[currentPlayer];
    pot = pot + currentBet;
    document.getElementById("chips").innerHTML = "Chips: " + chips[tempuser];
    document.getElementById("pot").innerHTML = "Pot: " + pot;
    if(currentPlayer != playerCount) {
        currentPlayer++;
    } else {
        currentPlayer = 1;
    }
    if(cardsDealt == 0) {
        currentPlayer = 1;
    }
    if(currentPlayer == tempuser) {
        if(aiRaised != 0) {
            alert("choose again dumbass they raised to " + currentBet);
            return;
        }
        pRaised = true;
        bet[currentPlayer] = 0;
        currentBet = 0;
        pRaised = false;
        aiRaised = 0;
        generateCards();
        return;
    } else {
        if(aiRaised != currentPlayer && aiRaised != 0) {
            call();
            return;
        }
        if(aiRaised == currentPlayer) {
            aiRaised = 0;
            nextTurn();
            return;
        }
    }
    if(aiRaised == 0) {
        ai();
    }
}

function ai() {
    let randomNumber = Math.floor((Math.random() * 10) + 1);
    if(randomNumber >= 1) {
        if(chips[currentPlayer] >= currentBet + 10) {
            raise(10);
        } else {
            call();
        }
    } else{
        if(currentBet == 0) {
            check();
        } else {
            call();
        }
    }
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
    let salt;
    let sendata = { "type": "salt", "value": loginfo.uname };
    salt = send(sendata);
    console.log(salt);
    sendata = { "type": "login", "value": loginfo };
    send(sendata);
}

async function send(data) {
    a = JSON.stringify(data);
    let response = await fetch("http://pokertexas.duckdns.org:2299", {
        credentials: "same-origin",
        method: "POST",
        body: a,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    console.log(response.text());
}