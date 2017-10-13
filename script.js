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

class Objective {
    constructor(name, limit, text, done) {
        this.name = name;
        this.limit = limit;
        this.text = text;
        this.done = done;
    }
}

var objectives = [
    new Objective("Start Point", 200, "Now you can do some things", false),
    new Objective("Computer boi", 1000, "Woah, with this you could have a very GOOD computer", false),
    new Objective("Lets go somewhere", 5000, "Now you could go spend a weekend somewhere in the world", false),
    new Objective("World tour", 50000, "Ever dreamed about seeing every place in the world? now you can", false),
    new Objective("Tesla maniac", 80000, "Now you can buy a Tesla model X, one of the most futuristic cars in the world", false),
    new Objective("An island", 100000, "Do you want a island for your own? just buy it", false),
    new Objective("Manhattan house", 1000000, "Now you can live in manhattan", false),
    new Objective("A Mansion", 45000000, "Have a mansion for your efforts", false),
    new Objective("A Eurofighter", 90000000, "How can you do not want an eurofighter", false),
    new Objective("A small cruise", 500000000, "Do your own trips to the caribean", false),
    new Objective("The casino", 2700000000, "Buy the casino and keep playing", false),
    new Objective("Antimatter", 25000000000, "Now you can afford a gram of antimatter", false),
    new Objective("EEUU", 1886000000000, "Buy the entire EEUU", false),
    new Objective("Earth", 5e15, "Buy the entire earth", false),
    new Objective("A big step", 5e17, "Now you can stop you know", false),
    new Objective("Ascension", 1e20, "Seriously", false),
    new Objective("Insanity", 1e50, "Please just stop", false),
    new Objective("Hydrogen", 1.466e56, "Buy every atom of hydrogen tha exists in the universe", false),
    new Objective("Googol", 1e100, "Have 1 googol of dollars", false),
    new Objective("The end", 1e1000, ". . .", false)
]

var objectivesNotif = [];

function Bet(n){ //In this function, n == -1 means "Use the value from he field" and n== -2 means "bet all"
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

    if(n == -2) {
        n = balance;
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

    updateBalance();

    document.getElementById("gamesPlayed").innerHTML = gamesLose + gamesWon;
    document.getElementById("gamesWon").innerHTML = gamesWon;
    document.getElementById("gamesLose").innerHTML = gamesLose;

    gameInProcess = false;
}

function updateBalance() {
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

    var someObjDone = false;

    for(var i = 0; i < objectives.length; i++) {
        if((balance >= objectives[i].limit && !objectives[i].done) || (balance < objectives[i].limit && objectives[i].done))  { 
            objectives[i].done = balance >= objectives[i].limit;
            if(objectives[i].done) objectivesNotif.push(objectives[i]);
            else objectivesNotif.unshift(objectives[i]);
        }
    }

    if(objectivesNotif.length > 0) notifObj();
}

function Surrender() {
    if(!gameInProcess) {
        alert("You must start a game first");
        return;
    }

    balance += bet * 0.5;
    bet = 0;

    updateBalance();

    gameInProcess = false;
}

function notifObj() {
    if(objectivesNotif.length == 0) return;

    destroyDiv();

    var objective = objectivesNotif.shift();

    var div = document.getElementById("objectivesNotification");
    div.style.display = "block";
    div.style.backgroundColor = objective.done ? "rgb(200, 200, 100)" : "rgb(255, 180, 180)";

    var h2 = document.createElement("h2");
    h2.innerHTML = objective.name;

    var p1 = document.createElement("p");
    p1.innerHTML = "$" + objective.limit;

    var p2 = document.createElement("p");
    p2.innerHTML = objective.text;

    var button = document.createElement("button");
    button.innerHTML = "Next";
    button.onclick = objectivesNotif.length > 0 ? notifObj : destroyDiv;

    div.appendChild(h2);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(button);

    document.getElementById("objective" + objective.name).style.textDecoration = objective.done ? "line-through" : "none";
    document.getElementById("objective" + objective.name).style.backgroundColor = objective.done ? "rgb(180, 250, 180)" : "rgb(255, 255, 255)";
}

function destroyDiv() {
    var div = document.getElementById("objectivesNotification");
    while(div.firstChild) div.removeChild(div.firstChild);
    div.style.display = "none";
}

function LoadObjectives() {
    var div = document.getElementById("objectiveDiv");
    for(var i = 0; i < objectives.length; i++) {
        var h3 = document.createElement("h3");
        h3.innerHTML = objectives[i].name;

        var span = document.createElement("span");
        span.innerHTML = "$" + objectives[i].limit;
        span.className = "objSpan";
        
        var div0 = document.createElement("div");
        div0.className = "objDiv";
        div0.id = "objective" + objectives[i].name;
        div0.appendChild(h3);
        div0.appendChild(span);

        div.appendChild(div0);
    }
}