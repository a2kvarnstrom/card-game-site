let aCards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]

function pickCard() {
    let i;
    i = aCards.length;
    let card = aCards[Math.floor(Math.random() * 56) % i];
    let daqard = aCards.indexOf(card);
    aCards.splice(daqard, 1);
    let norlequb = convertCard(card);
    return norlequb
}

function convertCard(card) {
    console.log(card)
    let valor;
    let caard = card % 4;
    let ccard = card % 14;
    caard++;
    ccard++;
    switch(caard) {
        case 1:
            valor = "Spades";
            break;
        case 2:
            valor = "Hearts";
            break;
        case 3:
            valor = "Clubs";
            break;
        case 4:
            valor = "Diamonds";
            break;
    }
    let value = ccard
    if(value == 14) {
        value == "j";
    }
    let globble = {"valor":valor,"value":value}
    return globble
}

function deal() {
    j = 56;
    while(true){
        let car = pickCard();
        console.log(car);
        if(j == 1) {
            break;
        }
        j--;
    }
}