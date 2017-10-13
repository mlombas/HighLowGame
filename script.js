/******************\
 * Author: Mocoma *
\******************/

var balance = 10;
var bet = 0;
var card;

var gameInProcess = false;

var gamesWon = 0, gamesLose = 0;

class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }

    equals(card) {
        return (card instanceof Card && this.value == card.value && this.suit == card.suit);
    }
}

function Bet(n){ //In this function, n == -1 means "Use the value from he field"
    if(gameInProcess) {
        alert("Cannot bet while in game");
        return;
    }

    if(n == -1) { 
        n = parseFloat(document.getElementById("inputBet").value);
        if(!n) n = 0;
        if(n <= 0) {
            alert("You must bet something greater than 0");
            return;
        }
    }

    if(balance - n < 0) {
        alert("Not enough balance");
        return;
    }

    balance -= n;
    bet += n;

    document.getElementById("balance").innerHTML = "$" + balance;
    document.getElementById("bet").innerHTML = "$" + bet;
    
}

function Game() {
    if(gameInProcess) {
        alert("Cannot start another game 'till you finish this one");
        return;
    }
    
    if(bet == 0) {
        alert("You must bet something");
        return;
    }

    card = new Card(Math.floor(Math.random() * 13), Math.floor(Math.random() * 4));
    document.getElementById("resultDiv").style.display = "none";
    document.getElementById("cardImg").style.background = "url(cards.jpg)" + (-349 / 13 * card.value) + "px " + (-36 * card.suit) + "px";

    gameInProcess = true;
}

function Result(high) {
    if(!gameInProcess) {
        alert("You must start a game first");
        return;
    }

    var num;
    do { num = new Card(Math.floor(Math.random() * 13), Math.floor(Math.random() * 4)); }while(num.equals(card));
    document.getElementById("resultDiv").style.display = "block";
    document.getElementById("resultImg").style.background = "url(cards.jpg)" + (-349 / 13 * num.value) + "px " + (-36 * num.suit) + "px";
    if(num.value == card.value || (high && num.value > card.value) || (!high && num.value < card.value)) {
        document.getElementById("resultText").innerHTML = "You win!";
        document.getElementById("resultText").style.color = "rgb(255,100,100)";

        balance += bet * 1.5;

        gamesWon++;
    } else { 
        document.getElementById("resultText").innerHTML = "You lose...";
        document.getElementById("resultText").style.color = "rgb(255,100,100)";

        gamesLose++;
    }

    bet = 0;

    document.getElementById("balance").innerHTML = "$" + balance;
    document.getElementById("bet").innerHTML = "$" + bet;

    if(balance == 0) 
    {
        while(document.body.firstChild) document.body.removeChild(document.body.firstChild);

        var title = document.createElement("h1");
        title.innerHTML = "Balance: $0";
        title.style.fontSize = "300%";
        title.style.fontFamily = "consolas";
        
        var sub = document.createElement("h2");
        sub.innerHTML = "You lose...";
        sub.style.fontSize = "250%";
        sub.style.fontFamily = "consolas";
        sub.style.color = "rgb(255,100,100)";

        document.body.appendChild(title);
        document.body.appendChild(sub);
        
        document.body.innerHTML += "\n<button onclick='location.reload(true)'>Play again</button>";
    }

    if(balance > 9000) alert("ITS OVER 9000!!");

    document.getElementById("gamesPlayed").innerHTML = gamesLose + gamesWon;
    document.getElementById("gamesWon").innerHTML = gamesWon;
    document.getElementById("gamesLose").innerHTML = gamesLose;

    gameInProcess = false;
}

function Surrender() {
    if(!gameInProcess) {
        alert("You must start a game first");
        return;
    }

    balance += bet * 0.5;
    bet = 0;

    document.getElementById("balance").innerHTML = balance + "$";
    document.getElementById("bet").innerHTML = bet + "$";

    gameInProcess = false;
}