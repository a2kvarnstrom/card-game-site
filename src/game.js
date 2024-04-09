let state = 0;
let playerCount = 2;
let doublePCount = playerCount * 2;
let n = 52 + doublePCount;
n = 52;
let aCards = [n];
let cardsDealt = 0;
let cardAmount = doublePCount;
let j = cardAmount;
let p1username = undefined;
let p2username = undefined;
let p3username = undefined;
let p4username = undefined;
let c;
let ctx;
let cardX;
let cardY;
let hands;

function getCanvas() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    cardX = 60;
    cardY = 60;
}

for (i = n; i >= 1; i--) {
    aCards[i] = i;
}
aCards.shift();

function increasePlayerCount() {
    if (playerCount <= 3) {
        playerCount++;
    }
    doublePCount = playerCount * 2;
    document.getElementById("playercount").innerHTML = "Player Count: " + playerCount;
}

function decreasePlayerCount() {
    if (playerCount >= 3) {
        playerCount--;
    }
    doublePCount = playerCount * 2;
    document.getElementById("playercount").innerHTML = "Player Count: " + playerCount;
}

function refillCards() {
    n = 52 + doublePCount;
    n = 52;
    aCards = [n];
    for (i = n; i >= 1; i--) {
        aCards[i] = i;
    }
    aCards.shift();
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
            case 1:
                value = "A";
                break;
            case 11:
                value = "J";
                break;
            case 12:
                value = "Q";
                break;
            case 13:
                value = "K";
                break;
            case 14:
                value = "A";
                break;
            case 15:
                value = "A";
            default:
                break;
        }
    }
    suit = card % 4;
    suit++;
    switch (suit) {
        case 1:
            suit = "Hearts";
            break;
        case 2:
            suit = "Diamonds";
            break;
        case 3:
            suit = "Clubs";
            break;
        case 4:
            suit = "Spades";
            break;
    }
    let cardID = { "suit": suit, "value": value };
    return cardID
}

function generateCards() {
    // button press
    if (aCards.length <= doublePCount + 3) {
        refillCards();
    }
    if (cardsDealt == 0) {
        j = doublePCount;
    } else if (cardsDealt == doublePCount) {
        j = 3;
    } else if (cardsDealt == doublePCount + 3) {
        j = 1;
    } else if (cardsDealt == doublePCount + 4) {
        endRound();
    }
    while (true) {
        if (j == 0) {
            break;
        }
        let cadr = pickCard();
        deal(cadr);
        j--;
    }
    if (cardsDealt == doublePCount + 4) {
        j = doublePCount;
    }
}

function deal(card) {
    cardsDealt++;
    // see which players turn it is to get a card
    // this is for a variable amount of players
    y = cardsDealt % playerCount;
    // check if joker
    if (card.value != "Joker") {
        var name = card.value + " of " + card.suit;
    } else {
        var name = "Joker";
    }
    // if it hasn't dealt 2 cards per player
    if (cardsDealt <= doublePCount) {
        // see which player gets the card
        switch (y % doublePCount) {
            case 0:
                giveCard("player1", name, card.value, card.suit);
                break;
            case 1:
                giveCard("player2", name, card.value, card.suit);
                break;
            case 2:
                giveCard("player3", name, card.value, card.suit);
                break;
            case 3:
                giveCard("player4", name, card.value, card.suit);
                break;
        }
    } else {
        giveCard("table", name, card.value, card.suit);
    }
}

function giveCard(player, card, value, suit) {
    document.getElementById(`${player}`).innerHTML += card + " | ";
    newCard(suit, value, cardX, cardY);
    cardX += 100;
}

function endRound() {
    // resets everything
    j = 0;
    cardsDealt = 0;
    document.getElementById("player1").innerHTML = "empty - ";
    document.getElementById("player2").innerHTML = "empty - ";
    document.getElementById("player3").innerHTML = "empty - ";
    document.getElementById("player4").innerHTML = "empty - ";
    document.getElementById("table").innerHTML = "table - ";
    ctx.clearRect(0, 0, c.width, c.height);
    cardX = 60;
    cardY = 60;
}

function newCard(suit, value, x, y) {
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
        ctx.beginPath();
        ctx.roundRect(x - 40, y - 43, 80, 100, 5);
        ctx.strokeStyle = "Black";
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
        ctx.roundRect(x - 40, y - 43, 80, 100, 5);
        ctx.strokeStyle = "Black";
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
        ctx.roundRect(x-40, y-43, 80, 100, 5);
        ctx.strokeStyle ="Black";
        ctx.stroke();
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
     	ctx.roundRect(x-40, y-43, 80, 100, 5);
        ctx.strokeStyle ="Black";
        ctx.stroke();
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

    switch (suit) {
        case "Hearts": {
            drawHeart(x, y);
            ctx.font = "28px Arial";
            ctx.fillStyle = "Tomato";
        }
        break;
        case "Spades": {
            drawSpade(x, y);
            ctx.font = "28px Arial";
            ctx.fillStyle = "Black";
        }
        break;
        case "Diamonds": {
            drawDiamond(x, y);
            ctx.font = "28px Arial";
            ctx.fillStyle = "Blue";      
        }
        break;
        case "Clubs": {
            drawClub(x, y);
            ctx.font = "28px Arial";
            ctx.fillStyle = "Green";
        }
        break;
    }
    ctx.fillText(value, x - 34, y - 20);
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
    var salt = send(sendata);
    sendata = { "type": "login", "value": loginfo };
    send(sendata);
}

async function send(data) {
    a = JSON.stringify(data);
    let response = await fetch("http://uxhebxje.ddns.net/", {
        credentials: "same-origin",
        method: "POST",
        body: a,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    console.log(response.text());
}