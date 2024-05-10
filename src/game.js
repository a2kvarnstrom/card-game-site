let w = window.innerWidth;
let h = window.innerHeight;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.setAttribute("id", "myCanvas");
        this.canvas.width = w * 0.9;
        this.canvas.height = this.canvas.width * 0.42;
        this.context = this.canvas.getContext("2d");
        //puts the canvas above the buttons
        const ol = document.getElementsByTagName("OL")[0];
        ol.insertBefore(this.canvas, ol.children[0]);

        this.interval = setInterval(updateGameArea, 20);
        c = this.canvas;
        ctx = c.getContext("2d");
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let cardsShown;
let cardToDeal = 0;
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
let j = doublePCount;
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
let chips = {1:50, 2:50, 3:50, 4:50};
let bet = {1:0, 2:0, 3:0, 4:0};
let minBet = 2;
let pot = 0;
let currentBet = 0;
let sBlind = minBet;
let bBlind = minBet * 2;
let folded = {1:false, 2:false, 3:false, 4:false};
let currentPlayer = 1;
let cards = {
    "player1" : [],
    "player2" : [],
    "player3" : [],
    "player4" : [],
    "table" : []
};
let cw;
let ch;

class Card {
	constructor(suit, value, x, y) {
    	this.suit = suit;
        this.value = value;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.targetX = this.x;
        this.targetY = this.y;
    }
    drawCard(face) {
        // ion fuckin know
        let suit = this.suit;
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
        function drawSpade() {
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
        function drawClub() {
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
        function drawDiamond() {
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
        function drawFrame() {
            ctx.beginPath();
            ctx.roundRect(x-40, y-43, 80, 100, 5);
            ctx.strokeStyle = "Black";
            ctx.stroke();
            ctx.fillStyle = "White";
            ctx.fill();
        }
        if(face == true) {
            switch (suit) {
                case "Hearts":
                    drawHeart();
                    ctx.font = "28px Arial";
                    ctx.fillStyle = "Tomato";
                    break;

                case "Spades":
                    drawSpade();
                    ctx.font = "28px Arial";
                    ctx.fillStyle = "Black";
                    break;

                case "Diamonds": 
                    drawDiamond();
                    ctx.font = "28px Arial";
                    ctx.fillStyle = "Blue";
                    break;

                case "Clubs": 
                    drawClub();
                    ctx.font = "28px Arial";
                    ctx.fillStyle = "Green";
                    break;
            }
            ctx.fillText(this.value, x - 34, y - 20);
        } else {
            drawFrame()
        }
    }
    drawFaceDown() {
        this.drawCard(false);
    }
    draw() {
        this.drawCard(false);
        this.drawCard(true);
    }
    drawFace() {
        this.drawCard(true);
    }
    setTarget(x, y) {
        this.targetX = cw * x;
        this.targetY = ch * y;
        let xDif = this.targetX - this.x;
        let yDif = this.targetY - this.y;
        this.speedX = xDif / 10;
        this.speedY = yDif / 10;
    }
    changePos() {
    	this.x += this.speedX;
    	this.y += this.speedY;
        if (this.x <= this.targetX + 0.01 && this.x >= this.targetX - 0.01 && this.y <= this.targetY + 0.01 && this.y >= this.targetY - 0.01) {
    	    this.speedX = 0;
    	    this.speedY = 0;
    	}
    }
    scale() {
        let scaleX = myGameArea.canvas.width / cw;
        let scaleY = myGameArea.canvas.height / ch;
        this.x = this.x * scaleX;
        this.y = this.x * scaleY;
        this.targetX = this.targetX * scaleX;
        this.targetY = this.targetY * scaleY;
        this.speedX = this.speedX * scaleX;
        this.speedY = this.speedY * scaleY;
    }
    setPlayer(player) {
        this.player = player;
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
    document.getElementById("betBar").addEventListener("mouseover", () => {
        document.body.style.cursor = "pointer";
    });
    document.getElementById("betBar").addEventListener("mouseout", () => {
        document.body.style.cursor = "default";
    });
    myGameArea.start();
    endRound();
}

function allChangePos() {
    try {
        for(let x = 0; x != cardsDealt; x++) {
            hands[x].changePos();
        }
    }
    catch(referenceError) {}
}

function allScale() {
    try {
        for(let x = 0; x != cardsDealt; x++) {
            hands[x].scale();
        }
    }
    catch(referenceError) {}
}

function reDraw() {
    myGameArea.clear();
    try {
        let u = 0;
        while(true) {
            if(cardsShown == false) {
                if(user == hands[u].player) {
                    hands[u].draw();
                } else if(hands[u].player == "table") {
                    hands[u].draw();
                } else if (user != hands[u].player) {
                    hands[u].drawFaceDown();
                }
            } else {
                hands[u].draw();
            }
            u++;
            if(u == cardsDealt) {
                return;
            }
        }
    }
    catch(referenceError) {}
}

function updateGameArea() {
    w = window.innerWidth;
    h = window.innerHeight;
    myGameArea.canvas.width = w * 0.9;
    myGameArea.canvas.height = myGameArea.canvas.width * 0.42;
    //allScale();
    cw = myGameArea.canvas.width;
    ch = myGameArea.canvas.height;
    cw = Math.floor(cw);
    ch = Math.floor(ch);
    allChangePos();
    reDraw();
}

function increasePlayerCount() {
    if (playerCount <= 3) {
        playerCount++;
    }
    doublePCount = playerCount * 2;
}

function decreasePlayerCount() {
    if (playerCount >= 3) {
        playerCount--;
    }
    if(tempuser >= playerCount + 1) {
        tempuser = 1;
        user = `player${tempuser}`;
    }
    doublePCount = playerCount * 2;
}

function pickCard() {
    let i = aCards.length;
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
        await deal(card);
        j--;
    }
    if(cardsDealt == doublePCount + 5) {
        document.getElementById("ShowCards").hidden = false;
        o++;
        console.log("what the fuck is happening")
        // await sleep(1000);
        let winner = winCondition();
        console.log("Winner: " + winner);
        return;
    }
    if(folded[currentPlayer] == true) {
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
                giveCard("player1");
                cards.player1.push(card);
                break;
            case 1:
                giveCard("player2");
                cards.player2.push(card);
                break;
            case 2:
                giveCard("player3");
                cards.player3.push(card);
                break;
            case 3:
                giveCard("player4");
                cards.player4.push(card);
                break;
        }
    } else {
        giveCard("table", card.value, card.suit);
        cards.table.push(card);
    }
    //return sleep(350);
}

function moveCards() {
    if(playerCount == 4) {
        let x = [0.2, 0.2, 0.75, 0.75, 0.25, 0.25, 0.8, 0.8, 0.4, 0.45, 0.5, 0.55, 0.6];
        let y = [0.9, 0.1, 0.1, 0.9, 0.9, 0.1, 0.1, 0.9, 0.5, 0.5, 0.5, 0.5, 0.5];
        let b = cardToDeal;
        hands[b].setTarget(x[b], y[b]);
        cardToDeal++;
    }
}

async function giveCard(player) {
    cardID.setPlayer(player);
    if(user == player) {
        cardID.draw();
    } else if(player == "table") {
        cardID.draw();
    } else if (user != player) {
        cardID.drawFaceDown();
    }
    
    moveCards();
}

function showCards() {
    let j;
    cardsShown = true;
    // cancer
    switch(playerCount) {
        case 2:
            switch(user) {
                case "player1":
                    j = [1, 3];
                    for(let i = 1; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;  
                case "player2":
                    j = [0, 2];
                    for(let i = 1; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                default:
                    location.href = "rules.html";
            }
            break;
        case 3:
            switch(user) {
                case "player1":
                    j = [1, 2, 4, 5];
                    for(let i = 3; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                case "player2":
                    j = [0, 2, 3, 5];
                    for(let i = 3; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                case "player3":
                    j = [0, 1, 3, 4];
                    for(let i = 3; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                default:
                    location.href = "rules.html";
            }
            break;
        case 4:
            switch(user) {
                case "player1":
                    j = [1, 2, 3, 5, 6, 7];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                case "player2":
                    j = [0, 2, 3, 4, 6, 7];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                case "player3":
                    j = [0, 1, 3, 4, 5, 7];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                case "player4":
                    j = [0, 1, 2, 4, 5, 6];
                    for(let i = 5; i > -1; i--) {
                        d = hands[j[i]];
                        d.drawFace();
                    }
                    break;
                default:
                    location.href = "rules.html";
            }
            break;
        default:
            location.href = "rules.html";
    }
}

async function endRound() {
    // resets everything
    cardsShown = false;
    currentPlayer = 1;
    bet = {1:0, 2:0, 3:0, 4:0};
    cardToDeal = 0;
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
        "player1" : [],
        "player2" : [],
        "player3" : [],
        "player4" : [],
        "table" : []
    };
    document.getElementById("ShowCards").hidden = true;
    if(chips[currentPlayer] != 0) {
        folded[currentPlayer] = false;
    } else {
        alert("you lose lol");
        location.href = "index.html";
    }
    pRaised = 0;
    aiRaised = 0;
    pot = 0;
    o = 0;
    j = doublePCount;
    cardsDealt = 0;
    myGameArea.clear();
    hands = [];
    await sleep(20);
    cardX = cw * 0.5;
    cardY = ch * 0.9;
    refillCards();
    nextTurn();
}

function call() {
    if(folded[currentPlayer] == true) {
        nextTurn();
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
    bet[currentPlayer] = currentBet - bet[currentPlayer];
    if(currentBet >= chips[currentPlayer] + 1) {
        bet[currentPlayer] = chips[currentPlayer];
        folded[currentPlayer] = true;
    }
    nextTurn();
}

function fold() {
    if(folded[currentPlayer] == true) {
        nextTurn();
        return;
    }
    pRaised = false;
    console.log(currentPlayer + ": fold");
    folded[currentPlayer] = true;
    nextTurn();
}

function check() {
    if(folded[currentPlayer] == true) {
        nextTurn();
        return;
    }
    console.log(currentPlayer + ": check");
    if(currentBet == 0) {
        bet[currentPlayer] = 0;
        nextTurn();
    }
}

function raise(amount) {
    if(folded[currentPlayer] == true) {
        nextTurn();
        return;
    }
    if(amount) {
        aiRaised = currentPlayer;
        if(aiRaised == 1) {
            aiRaised = 0;
        }
        bet[currentPlayer] = currentBet - bet[currentPlayer];
        bet[currentPlayer] += amount;
        currentBet = bet[currentPlayer]
        console.log(currentPlayer + ": raise -> " + currentBet);
        nextTurn();
        return;
    }
    // for player
    pRaised = true;
    if(chips[currentPlayer] == 0) {
        folded[currentPlayer] = true;
        nextTurn();
        return;
    }
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
    // sorry for the comments i didnt understand what i made (while still making it)
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

async function nextTurn(num) {
    //console.log("Current Bet: " + currentBet);
    for(let i = 0; i <= playerCount; i++) {
        if(chips[i] == 0) {
            folded[i] = true;
        }
    }
    if(num) {
        bet[currentPlayer] = 0;
        currentBet = 0;
        pRaised = false;
        bet = {1:0, 2:0, 3:0, 4:0};
        aiRaised = 0;
        currentPlayer = 1;
        generateCards();
        return;
    }
    document.getElementById("betBar").hidden = true;
    document.getElementById("bet").hidden = true;
    chips[currentPlayer] = chips[currentPlayer] - bet[currentPlayer];
    pot = pot + bet[currentPlayer];
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
            call();
            return;
        }
        bet = {1:0, 2:0, 3:0, 4:0};
        currentBet = 0;
        pRaised = false;
        aiRaised = 0;
        currentPlayer = 1;
        generateCards();
        return;
    } else {
        if(aiRaised != currentPlayer && aiRaised != 0) {
            console.log("autocall")
            call();
            return;
        }
        if(aiRaised == currentPlayer) {
            aiRaised = 0;
            nextTurn(1);
            return;
        }
    }
    if(aiRaised == 0) {
        ai();
    }
}

function playerTurn() {
    while(true) {
        if(true) {
            return;
        }
    }
}

function ai() {
    let randomNumber = Math.floor((Math.random() * 10) + 1);
    if(randomNumber >= 11) {
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

async function winCondition() {
    function highCardCheck() {
        let q = 1;
        let highests = [];
        while(true) {
            let highest = 0;
            let pCards = [];
            let p = `player${q}`;
            let i = 0;
            while(true) {
                if(i == 7) {
                    break;
                }
                if(i <= 1) {
                    pCards.push(cards[p][i].value);
                } else {
                    pCards.push(cards["table"][i-2].value);
                }
                i++;
            }
            console.log(pCards);
            for(let i = 0; i <= pCards.length - 1; i++) {
                switch(pCards[i]) {
                    case 'A':
                        pCards[i] = 14;
                        break;
                    case 'K':
                        pCards[i] = 13;
                        break;
                    case 'Q':
                        pCards[i] = 12;
                        break;
                    case 'J':
                        pCards[i] = 11;
                        break;
                }
            }
            for(let i = 0; i <= pCards.length - 2; i++) {
                if(pCards[i] >= highest) {
                    highest = pCards[i];
                }
            }
            highests.push(highest);
            if(q == 4) {
                break;
            }
            q++;
        }
        return highests;
    }
    function pairCheck() {
        function uniq(a) {
            const unique = new Map(
                a.map(c => [c.id, c])
            );
            const returna = [...unique.values()];
            return returna;
        }
        let push;
        let q = 1; 
        let toak = [];
        let pairs = [];
        let twoPairs = [];
        let pairAmounts = [0, 0, 0, 0];
        while(true) {
            let p = `player${q}`;
            let pairval;
            let pairvals = [];
            let pairAmount = 0;
            let tempPairs = []
            for(let i = 0; i <= 5; i++) {
                for(let j = i + 1; j <= 6; j++) {
                    if(j <= 1) {
                        if(cards[p][i].value == cards[p][j].value) {
                            pairAmount++;
                            pairval = cards[p][i].value;
                            push = {"player":p, "value":pairval};
                            pairs.push(push);
                            pairvals.push(pairval);
                        }
                    } else {
                        if(i <= 1) {
                            if(cards[p][i].value == cards["table"][j-2].value) {
                                pairAmount++;
                                pairval = cards["table"][j-2].value;
                                push = {"player":p, "value":pairval};
                                pairs.push(push);
                                pairvals.push(pairval);
                            }
                        } else {
                            if(cards["table"][i-2].value == cards["table"][j-2].value) {
                                pairAmount++;
                                pairval = cards["table"][i-2].value;
                                push = {"player":p, "value":pairval};
                                pairs.push(push);
                                pairvals.push(pairval);
                            }
                        }
                    }
                }
            }
            console.log(pairs);
            console.log(uniq(pairs));
            for(let i = 0; i <= pairs.length - 1; i++) {
                switch(pairs[i][1]) {
                    case 'A':
                        pairs[i][1] = 14;
                        break;
                    case 'K':
                        pairs[i][1] = 13;
                        break;
                    case 'Q':
                        pairs[i][1] = 12;
                        break;
                    case 'J':
                        pairs[i][1] = 11;
                        break;
                }
            }
            for(let i = 0; i <= pairvals.length - 1; i++) {
                switch(pairvals[i]) {
                    case 'A':
                        pairvals[i] = 14;
                        break;
                    case 'K':
                        pairvals[i] = 13;
                        break;
                    case 'Q':
                        pairvals[i] = 12;
                        break;
                    case 'J':
                        pairvals[i] = 11;
                        break;
                }
            }
            for(let i = 1; i < pairs.length; i++) {
                if(pairs[i] == pairs[i-1]) {
                    console.log(p + " toak");
                    if(pairs[i] != toak.slice(-1)) {
                        toak.push({"player":p, "value":pairs[i]});
                    }
                }
            }
            if(pairAmount == 2) {
                twoPairs.push({"player":p, "values":[pairvals[0], pairvals[1]]});
            } else if(pairAmount >= 3) {
                console.log(p + " three pairs lol");
                console.log(pairvals);
                for(let i = 1; i < pairvals.length; i++) {
                    if(pairvals[i] != pairvals[i-1]) {
                        if(pairvals.length >= 2) {
                            if(pairvals[i] > pairvals[i-1]) {
                                console.log("fau");
                                tempPairs.push(pairvals[i]);
                                pairvals.splice(i, 1);
                                console.log(pairvals);
                            } else if(pairvals[i-1] > pairvals[i]) {
                                console.log("ypsilon");
                                tempPairs.push(pairvals[i-1]);
                                pairvals.splice(i-1, 1);
                                console.log(pairvals);
                            }
                        }
                    }
                }
                console.log("temp:")
                console.log(tempPairs);
            }
            pairAmounts[q-1] = pairAmount;
            if(q == 4) {
                break;
            }
            q++;
        }
        let returnn = {"pairs":pairs, "pairAmounts":pairAmounts, "twoPairs":twoPairs, "toak":toak};
        return returnn;
    }
    function straightCheck() {
        return "Unfinished";
    }
    function flushCheck() {
        return "Unfinished";
    }
    let high = highCardCheck();
    let pair = pairCheck();
    let straight = straightCheck();
    let flush = flushCheck();
    console.log(" ");
    console.log(high);
    console.log(pair);
    console.log(straight);
    console.log(flush);
    console.log(" ");
    let winner = "ur mom";
    return winner;
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