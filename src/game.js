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

let cardsShown = false;
let cardToDeal = 0;
let isChoosing;
let pRaised = true;
let aiRaised = 0;
let o = 0;
let playerCount = 4;
let doublePCount = playerCount * 2;
let n = 52 /*+ doublePCount*/;
let availableCards;
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
let chips = {1:50, 2:50, 3:50, 4:50};
let bet = {1:0, 2:0, 3:0, 4:0};
let minBet = 2;
let pot = 0;
let currentBet = 0;
let sBlind = minBet;
let bBlind = minBet * 2;
let folded = {1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
let currentPlayer = 1;
let cards = {
    "player1" : [],
    "player2" : [],
    "player3" : [],
    "player4" : [],
    "player5" : [],
    "player6" : [],
    "table" : []
};
let cw;
let ch;
let pword;

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
    availableCards = [n];
    for (i = n; i >= 1; i--) {
        availableCards[i] = i;
    }
    availableCards.shift();
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
    catch(ReferenceError) {}
}

function allScale() {
    try {
        for(let x = 0; x != cardsDealt; x++) {
            hands[x].scale();
        }
    }
    catch(ReferenceError) {}
}

function reDraw() {
    function handfoldcomp(a) {
        a = a.substr(6, 1);
        if(folded[a] != undefined) {
            return folded[a];
        }
        return false;
    }
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
                if(handfoldcomp(hands[u].player) == true && hands[u].player != "player1") {
                    hands[u].drawFaceDown();
                } else {
                    hands[u].draw();
                }
            }
            u++;
            if(u == cardsDealt) {
                return;
            }
        }
    }
    catch(ReferenceError) {}
}

function updateGameArea() {
    document.getElementById("chips").innerHTML = chips[1];
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
    n = availableCards.length;
    let card = availableCards[Math.floor(Math.random() * n)];
    let cardIndex = availableCards.indexOf(card);
    availableCards.splice(cardIndex, 1);
    //card = Math.floor(Math.random() * 20); // for debug, maxes cards at like 5
    let cardID = convertCard(card);
    return cardID
}

async function convertCard(card) {
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
    //suit = "Diamonds";
    cardID = new Card(suit, value, cardX, cardY);
    hands.push(cardID);
    return cardID
}

async function generateCards() {
    if(cardsDealt == doublePCount + 5) {
        return;
    }
    let o = 0;
        // button press
    if (n <= doublePCount + 5) {
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
        let card = await pickCard();
        await deal(card);
        j--;
    }
    if(cardsDealt == doublePCount + 5) {
        o++;
        console.log("what the fuck is happening")
        //await sleep(1000);
        let winner = winCondition();
        console.log("Winner: " + winner);
        cardsShown = true;
        await sleep(1000);
        //endRound();
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
            case 4:
                giveCard("player5");
                cards.player4.push(card);
                break;
            case 5:
                giveCard("player6");
                cards.player4.push(card);
                break;
        }
    } else {
        giveCard("table", card.value, card.suit);
        cards.table.push(card);
    }
    return sleep(350);
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

async function endRound() {
    // resets everything
    cardsShown = false;
    currentPlayer = 1;
    bet = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
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
        "player5" : [],
        "player6" : [],
        "table" : []
    };
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
        fold();
        return;
    }
    nextTurn();
}

function fold() {
    console.log(currentPlayer + ": fold");
    if(folded[currentPlayer] == true) {
        nextTurn();
        return;
    }
    pRaised = false;
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
        fold();
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
    console.log("Current Bet: " + currentBet);
    for(let i = 0; i <= playerCount; i++) {
        if(chips[i] == 0) {
            folded[i] = true;
        }
    }
    if(num) {
        bet[currentPlayer] = 0;
        currentBet = 0;
        pRaised = false;
        bet = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
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
        bet = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
        currentBet = 0;
        pRaised = false;
        aiRaised = 0;
        currentPlayer = 1;
        generateCards();
        return;
    } else {
        if(aiRaised != currentPlayer && aiRaised != 0) {
            console.log("autocall");
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

async function ai() {
    await sleep(250);
    let randomNumber = Math.floor((Math.random() * 10) + 1);
    if(randomNumber >= 5) {
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

function winCondition() {
    // absolute cancer ahead
    // for your own sanity, just ignore what follows
    function pairComp(a, b) {
        let value;
        let player;
        if(a.value === b.value) {
            value = true;
        } else {
            value = false;
        }
        if(a.player === b.player) {
            player = true;
        } else {
            player = false;
        }
        if(value === true && player === true) {
            return true;
        } else {
            return false;
        }
    }
    function arrComp(a, b) {
        let value;
        let player;
        if(a[0] === b[0]) {
            value = true;
        } else {
            value = false;
        }
        if(a[1] === b[1]) {
            player = true;
        } else {
            player = false;
        }
        if(value === true && player === true) {
            return true;
        } else {
            return false;
        }
    }
    function convert(c) {
        switch(c) {
            case 'J':
                c = 11;
                break;
            case 'Q':
                c = 12;
                break;
            case 'K':
                c = 13;
                break;
            case 'A':
                c = 14;
                break;
            default:
                c = c;
                break;
        }
        return c;
    }
    function compPush(arr, arr2, x, y) {
        if(arr2[x] != arr2[y]) {
            if(arr2[x] < arr2[y]) {
                arr.push(arr2[y]);
                arr2.splice(y, 1);
            } else if(arr2[x] > arr2[y]) {
                arr.push(arr2[x]);
                arr2.splice(x, 1);
            } else {
                arr.push(arr2[x]);
                arr2.splice(x, 1);
            }
        }
    }
    function highCardCheck() {
        let q = 1;
        let highests = [0, 0, 0, 0, 0, 0];
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
                pCards[i] = convert(pCards[i]);
            }
            for(let i = 0; i <= pCards.length - 2; i++) {
                if(pCards[i] >= highest) {
                    highest = pCards[i];
                }
            }
            highests[q-1] = highest;
            if(q == playerCount) {
                break;
            }
            q++;
        }
        console.log(" ");
        return highests;
    }
    function pairCheck() {
        let push;
        let q = 1; 
        let toak = [];
        let pairs = [];
        let twoPairs = [];
        let fhouse = [];
        let foak = [];
        let pairAmounts = [0, 0, 0, 0];
        let curToak;
        let a;
        while(true) {
            let fPair = undefined;
            let p = `player${q}`;
            let pairval;
            let pairvals = [];
            let pairAmount = 0;
            let tempPairs = [];
            a = true;
            curToak = undefined;
            for(let i = 0; i <= 5; i++) {
                for(let j = i + 1; j <= 6; j++) {
                    if(j <= 1) {
                        if(cards[p][i].value == cards[p][j].value) {
                            pairAmount++;
                            pairval = cards[p][i].value;
                            pairval = convert(pairval);
                            push = {"player":p, "value":pairval};
                            pairs.push(push);
                            pairvals.push(pairval);
                        }
                    } else {
                        if(i <= 1) {
                            if(cards[p][i].value == cards["table"][j-2].value) {
                                pairAmount++;
                                pairval = cards["table"][j-2].value;
                                pairval = convert(pairval);
                                push = {"player":p, "value":pairval};
                                pairs.push(push);
                                pairvals.push(pairval);
                            }
                        } else {
                            if(cards["table"][i-2].value == cards["table"][j-2].value) {
                                pairAmount++;
                                pairval = cards["table"][i-2].value;
                                pairval = convert(pairval);
                                push = {"player":p, "value":pairval};
                                pairs.push(push);
                                pairvals.push(pairval);
                            }
                        }
                    }
                }
            }
            for(let i = 1; i < pairs.length; i++) {
                if(pairComp(pairs[i], pairs[i-1]) == true) {
                    curToak = pairs[i];
                    curToak.value = convert(curToak.value);
                    let pushval = {"player":curToak.player, "value":curToak.value};
                    if(toak.length > 0) {
                        if(pairComp(pushval, toak[toak.length-1]) == false) {
                            console.log(p + " toak");
                            toak.push(pushval);
                        }
                    } else {
                        console.log(p + " toak");
                        toak.push(pushval);
                    }
                    a = false;
                }
            }
            if(pairAmount == 2) {
                console.log(p + " two pairs");
                twoPairs.push({"player":p, "values":[pairvals[0], pairvals[1]]});
            } 
            if(pairAmount == 3 && a) {
                console.log(p + " 3 pairs lol");

                for(let i = 0; i != pairAmount - 1; i++) {
                    compPush(tempPairs, pairvals, 0, 1);
                }
                let pushval = {"player":p, "values":tempPairs};
                
                twoPairs.push(pushval);
            } else if(pairAmount > 3) {
                if(pairAmount == 4) {
                    console.log(p + " full house");

                    pairvals = [...new Set(pairvals)];
                    pairvals.sort();

                    if(curToak.value == pairvals[0]) {
                        fPair = pairvals[1];
                    } else {
                        fPair = pairvals[0];
                    }
                    let pushval = {"player":p, "values":{"toak":curToak.value, "pair":fPair}};
                    
                    fhouse.push(pushval);
                } else if(pairAmount == 5) {
                    console.log(p + " full house + pair lmao");
                    console.log(pairvals);
                    pairvals = [...new Set(pairvals)];
                    pairvals.sort();
                    if(curToak.value == pairvals[0]) {
                        if(pairvals[1] > pairvals[2]) {
                            pushval = {"player":p, "values":{"toak":curToak.value, "pair":pairvals[1]}};
                        } else {
                            pushval = {"player":p, "values":{"toak":curToak.value, "pair":pairvals[2]}};
                        }
                    } else if(curToak.value == pairvals[1]) {
                        if(pairvals[0] > pairvals[2]) {
                            pushval = {"player":p, "values":{"toak":curToak.value, "pair":pairvals[0]}};
                        } else {
                            pushval = {"player":p, "values":{"toak":curToak.value, "pair":pairvals[2]}};
                        }
                    } else {
                        if(pairvals[0] > pairvals[1]) {
                            pushval = {"player":p, "values":{"toak":curToak.value, "pair":pairvals[0]}};
                        } else {
                            pushval = {"player":p, "values":{"toak":curToak.value, "pair":pairvals[1]}};
                        }
                    }
                    fhouse.push(pushval);
                } else if(pairAmount == 6) {
                    let pushval;
                    pairvals = [...new Set(pairvals)];
                    console.log(pairvals);
                    if(pairvals.length == 1) {
                        console.log(p + " lucky ass got a four of a kind");
                        foak.push({"player":p, "value":pairvals[0]});
                    } else {
                        console.log(p + " 2 toaks HOW");
                        if(pairvals[0] > pairvals[1]) {
                            pushval = {"player":p, "values":{"toak":pairvals[0], "pair":pairvals[1]}};
                        } else {
                            pushval = {"player":p, "values":{"toak":pairvals[1], "pair":pairvals[0]}};
                        }
                        fhouse.push(pushval);
                    }
                } else {
                    console.log(p + " got a foak + some more HOW");
                    let pushval;
                    let counts = {};
                    pairvals.forEach(function(x) { counts[x] = (counts[x] || 0) + 1; });
                    let dpairs = [...new Set(pairvals)];
                    let ccounts = Object.keys(counts);
                    console.log(pairvals);
                    for(let i = 0; i < dpairs.length; i++) {
                        if(counts[ccounts[i]] == "6") {
                            pushval = ccounts[i];
                            break;
                        }
                        console.log("len " + dpairs.length);
                        console.log("counts " + counts[ccounts[i]]);
                    }
                    console.log(pushval);
                    pushval = parseInt(pushval);
                    console.log(pushval);
                    foak.push({"player":p, "value":pushval});
                }
            }
            pairAmounts[q-1] = pairAmount;
            if(q == playerCount) {
                break;
            }
            q++;
        }
        let returnn = {"pairs":pairs, "pairAmounts":pairAmounts, "twoPairs":twoPairs, "toak":toak, "fhouse":fhouse, "quads":foak};
        return returnn;
    }
    function straightCheck() {
        let suits = [];
        let straights = [];
        let flushes = [];
        let sflushes = [];
        let q = 1;
        while(true) {
            let straightFlush;
            let temp = [];
            let suiteds = 0;
            let vals = [0, 0];
            let aj = [];
            let ajs = [];
            let p = `player${q}`;
            let d = 0;
            let s = 0;
            let h = 0;
            let c = 0;
            let dHigh = 0;
            let sHigh = 0;
            let hHigh = 0;
            let cHigh = 0;
            let suit = []
            for(let i = 0; i <= 6; i++) {
                if(i <= 1) {
                    temp.push([cards[p][i].suit, cards[p][i].value]);
                    temp[temp.length-1][1] = convert(temp[temp.length-1][1]);
                    if(temp[temp.length-1][1] == 14) {
                        temp.push([temp[temp.length-1][0], 1]);
                    }
                    suit.push(cards[p][i].suit);
                    switch(cards[p][i].suit) {
                        case "Diamonds":
                            if(temp[temp.length-1][1] > dHigh) {
                                dHigh = temp[temp.length-1][1];
                            }
                            d++;
                            break;
                        case "Spades":
                            if(temp[temp.length-1][1] > sHigh) {
                                sHigh = temp[temp.length-1][1];
                            }
                            s++;
                            break;
                        case "Hearts":
                            if(temp[temp.length-1][1] > hHigh) {
                                hHigh = temp[temp.length-1][1];
                            }
                            h++;
                            break;
                        case "Clubs":
                            if(temp[temp.length-1][1] > cHigh) {
                                cHigh = temp[temp.length-1][1];
                            }
                            c++;
                            break;
                    }
                } else {
                    temp.push([cards["table"][i-2].suit, cards["table"][i-2].value]);
                    temp[temp.length-1][1] = convert(temp[temp.length-1][1]);
                    if(temp[temp.length-1][1] == 14) {
                        temp.push([temp[temp.length-1][0], 1]);
                    }
                    suit.push(cards["table"][i-2].suit);
                    switch(cards["table"][i-2].suit) {
                        case "Diamonds":
                            if(temp[temp.length-1][1] > dHigh) {
                                dHigh = temp[temp.length-1][1];
                            }
                            d++;
                            break;
                        case "Spades":
                            if(temp[temp.length-1][1] > sHigh) {
                                sHigh = temp[temp.length-1][1];
                            }
                            s++;
                            break;
                        case "Hearts":
                            if(temp[temp.length-1][1] > hHigh) {
                                hHigh = temp[temp.length-1][1];
                            }
                            h++;
                            break;
                        case "Clubs":
                            if(temp[temp.length-1][1] > cHigh) {
                                cHigh = temp[temp.length-1][1];
                            }
                            c++;
                            break;
                    }
                }
            }
            if(d >= 5) {
                console.log(p + " flush");
                let cards = [];
                for(let i = 0; i < temp.length; i++) {
                    if(temp[i][0] == "Diamonds") {
                        cards.push(temp[i][1]);
                    }
                }
                flushes.push({"player":p, "suit":"Diamonds", "high":dHigh, "cards":cards});
            } else if(s >= 5) {
                console.log(p + " flush");
                let cards = [];
                for(let i = 0; i < temp.length; i++) {
                    if(temp[i][0] == "Spades") {
                        cards.push(temp[i][1]);
                    }
                }
                flushes.push({"player":p, "suit":"Spades", "high":sHigh, "cards":cards});
            } else if(h >= 5) {
                console.log(p + " flush");
                let cards = [];
                for(let i = 0; i < temp.length; i++) {
                    if(temp[i][0] == "Hearts") {
                        cards.push(temp[i][1]);
                    }
                }
                flushes.push({"player":p, "suit":"Hearts", "high":hHigh, "cards":cards});
            } else if(c >= 5) {
                console.log(p + " flush");
                let cards = [];
                for(let i = 0; i < temp.length; i++) {
                    if(temp[i][0] == "Clubs") {
                        cards.push(temp[i][1]);
                    }
                }
                flushes.push({"player":p, "suit":"Clubs", "high":cHigh, "cards":cards});
            }
            suits.push(suit);
            //inefficient ass sort
            for(let i = 0; i < temp.length-1; i++) {
                for(let j = 1; j < temp.length; j++) {
                    if(temp[i][1] == temp[j][1]-1 || temp[i][1] == temp[j][1]+1) {
                        aj.push(temp[i]);
                        aj.push(temp[j]);
                        aj.sort((a, b) => {
                            const aa = a[1];
                            const bb = b[1];
                            return aa - bb;
                        });
                    }
                }
            }
            for(let i = 0; i < aj.length-1; i++) {
                if(aj[i][1] == aj[i+1][1]-1) {
                    vals.splice(0, 1);
                    vals.push(i+1);
                    let newVal = aj.slice(vals[0], vals[1]);
                    ajs.push(newVal[0]);
                }
            }
            for(let i = 0; i < ajs.length; i++) {
                if(ajs.length >= 5) {
                    console.log(p + " straight");
                    if(ajs.length > 5) {
                        ajs.splice(0, ajs.length-5);
                    }
                    for(let i = 0; i < straights.length; i++) {
                        compPush(straights, straights, i, i-1);
                    }
                    straights.push({"player":p, "cards":ajs, "high":ajs[ajs.length-1][0][1]});
                }
            }
            for(let i = 0; i < ajs.length; i++) {
                try{
                    for(let j = 0; j < flushes[flushes.length-1].cards.length; j++) {
                        if(ajs[i] == flushes[flushes.length-1].cards[j]) {
                            suiteds++;
                        }
                    }
                } catch(TypeError) {}
            }
            if(suiteds >= 5) {
                straightFlush = true;
            }
            if(straightFlush == true) {
                console.log(p + " straight flush");
                sflushes.push({"player":p, "suit":flushes[flushes.length-1].suit, "cards":straights[straights.length-1].cards, "high":straights[straights.length-1].high});
            }
            if(q == playerCount) {
                break;
            }
            q++;
        }
        return {"straight":straights, "flush":flushes, "sflush":sflushes};
    }
    function highComp(wantHigh, highArr, s) {
        if(wantHigh > highArr[s]) {
            highArr[s] = wantHigh;
        }
        return highArr;
    }
    let high = highCardCheck();
    let check2 = pairCheck();
    let check3 = straightCheck();
    let w = [];
    let pair = check2.pairs;
    let twoPair = check2.twoPairs;
    let toak = check2.toak;
    let straight = check3.straight;
    let flush = check3.flush;
    let fhouse = check2.fhouse;
    let quads = check2.quads;
    let sflush = check3.sflush;
    
    let hPair = {
        "player1":0,
        "player2":0,
        "player3":0,
        "player4":0,
        "player5":0,
        "player6":0
    };
    let hTwoPair = {
        "player1":[],
        "player2":[],
        "player3":[],
        "player4":[],
        "player5":[],
        "player6":[]
    };
    let hToak = {
        "player1":0,
        "player2":0,
        "player3":0,
        "player4":0,
        "player5":0,
        "player6":0
    };
    let hStraight = {
        "player1":0,
        "player2":0,
        "player3":0,
        "player4":0,
        "player5":0,
        "player6":0
    };
    let hFlush = {
        "player1":0,
        "player2":0,
        "player3":0,
        "player4":0,
        "player5":0,
        "player6":0
    };
    let hFhouse = {
        "player1":{},
        "player2":{},
        "player3":{},
        "player4":{},
        "player5":{},
        "player6":{}
    };
    let hQuads = {
        "player1":0,
        "player2":0,
        "player3":0,
        "player4":0,
        "player5":0,
        "player6":0
    };
    let hSflush = {
        "player1":0,
        "player2":0,
        "player3":0,
        "player4":0,
        "player5":0,
        "player6":0
    };
    for(let i = 0; i < pair.length; i++) {
        hPair = highComp(pair[i].value, hPair, pair[i].player);
    }
    for(let i = 0; i < twoPair.length; i++) {
        hTwoPair = highComp(twoPair[i].values, hTwoPair, twoPair[i].player);
    }
    for(let i = 0; i < toak.length; i++) {
        hToak = highComp(toak[i].value, hToak, toak[i].player);
    }
    for(let i = 0; i < straight.length; i++) {
        hStraight = highComp(straight[i].high, hStraight, straight[i].player);
    }
    for(let i = 0; i < flush.length; i++) {
        hFlush = highComp(flush[i].high, hFlush, flush[i].player);
    }
    for(let i = 0; i < fhouse.length; i++) {
        hFhouse = highComp(fhouse[i].values, hFhouse, fhouse[i].player);
    }
    for(let i = 0; i < quads.length; i++) {
        hQuads = highComp(quads[i].value, hQuads, quads[i].player);
    }
    for(let i = 0; i < sflush.length; i++) {
        hSflush = highComp(sflush[i].high, hSflush, sflush[i].player);
    }

    let everything = [{"player1":high[0], "player2":high[1], "player3":high[2], "player4":high[3]}, hPair, hTwoPair, hToak, hStraight, hFlush, hFhouse, hQuads, hSflush];

    console.log(" ");
    console.log(everything);
    console.log(" ");

    for(let i = 0; i < everything.length-1; i++) {
        for(let j = 0; j < playerCount-1; j++) {
            
        }
    }

    let winner = dealChips(w);
    return winner;
}

function dealChips(w) {
    let winner = w;
    return winner;
}