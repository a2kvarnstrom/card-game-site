let state = 0;
let playerCount = 2;
let doublePCount = playerCount * 2;
let n = 52 + doublePCount;
let aCards = [n];
let cardsDealt = 0;
let cardAmount = doublePCount;
let j = cardAmount;
let p1username = undefined;
let p2username = undefined;
let p3username = undefined;
let p4username = undefined;

for (i = n; i >= 1; i--) {
    aCards[i] = i;
}
aCards.shift();

function increasePlayerCount() {
    if(playerCount <= 3) {
        playerCount++;
    }
    doublePCount = playerCount * 2;
    document.getElementById("playercount").innerHTML = "Player Count: " + playerCount;
}

function decreasePlayerCount() {
    if(playerCount >= 3) {
        playerCount--;
    }
    doublePCount = playerCount * 2;
    document.getElementById("playercount").innerHTML = "Player Count: " + playerCount;
}

function refillCards() {
    n = 52 + doublePCount;
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
    if(card >= 53) {
        value = "Joker";
        suit = undefined;
    }
    if(value != "Joker") {
        switch(value) {
            case 1:
                value = "Ace";
                break;
            case 11:
                value = "Jack";
                break;
            case 12:
                value = "Queen";
                break;
            case 13:
                value = "King";
                break;
            case 14:
                value = "Ace";
                break;
            case 15:
                value = "Ace";
            default:
                break;
        }
    }
    suit = card % 4;
    suit++;
    switch(suit) {
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
    let cardID = {"suit":suit, "value":value};
    return cardID
}

function generateCards() {
    // button press
    if(aCards.length <= doublePCount + 3) {
        refillCards();
    }
    if(cardsDealt == 0) {
        j = doublePCount;
    } else if(cardsDealt == doublePCount) {
        j = 3;
    } else if(cardsDealt == doublePCount + 3) {
        j = 1;
    } else if(cardsDealt == doublePCount + 4) {
        endRound();
    }
    while(true) {
        if(j == 0) {
            break;
        }
        let cadr = pickCard();
        deal(cadr);
        j--;
    }
    if(cardsDealt == doublePCount + 4) {
        j = doublePCount;
    }
}

function deal(card) {
    cardsDealt++;
    y = cardsDealt % playerCount;
    if(card.value != "Joker") {
        var name = card.value + " of " + card.suit;
    } else {
        var name = "Joker";
    }
    if(cardsDealt <= doublePCount) {
        switch(y % doublePCount) {
            case 0:
                receiveCard("player1", name);
                break;
            case 1:
                receiveCard("player2", name);
                break;
            case 2:
                receiveCard("player3", name);
                break;
            case 3:
                receiveCard("player4", name);
                break;
        }
    } else {
        receiveCard("table", name);
    }
}

function receiveCard(player, card) {
    document.getElementById(`${player}`).innerHTML += card + " | ";
}

function endRound() {
    j = 0;
    cardsDealt = 0;
    document.getElementById("player1").innerHTML = "empty - ";
    document.getElementById("player2").innerHTML = "empty - ";
    document.getElementById("player3").innerHTML = "empty - ";
    document.getElementById("player4").innerHTML = "empty - ";
    document.getElementById("table").innerHTML = "table - ";
}