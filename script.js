/******************\
 * Author: Mocoma *
\******************/

var balance;
var bet = 0;
var card, nextCard;

var notifyOn = false;

var currClass;

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

class Class {
    constructor(name, unlockText, text, srcImage, unlockAction, gameAction, pregameAction, unlocked) {
        this.name = name;
        this.unlockText = unlockText;
        this.text = text;
        this.srcImage = srcImage;
        this.unlockAction = unlockAction;
        this.gameAction = gameAction;
        this.pregameAction = pregameAction;
        this.unlocked = unlocked;
    }
}

var objectives = [
    new Objective("Start Point", 200, "Now you can do some things", false),
    new Objective("Computer boi", 1000, "Woah, with this you could have a very GOOD computer", false),
    new Objective("Lets go somewhere", 5000, "Now you could go spend a weekend somewhere in the world", false),
    new Objective("Small stop", 10000, "Keep going, yo will archieve much more than this", false),
    new Objective("Earth-level orbit", 50000, "Ever dreamed about seeing every place in the world? now you can", false),
    new Objective("Tesla maniac", 80000, "Now you can buy a Tesla model X, one of the most futuristic cars in the world", false),
    new Objective("Living in the sea", 100000, "Do you want a island for your own? just buy it", false),
    new Objective("Manhattan man", 1000000, "Now you can live in manhattan", false),
    new Objective("The king", 58000000, "Now you can afford a castle from medieval times", false),
    new Objective("I believe you can fly", 90000000, "Buy an Eurofighter and cross the skies", false),
    new Objective("Here we go captain", 500000000, "Do your own trips to the caribean with your newly adquired medium-size cruise", false),
    new Objective("Ruler of the place", 2700000000, "Buy the casino and keep playing", false),
    new Objective("A middle advance", 750000000000, "You are almost there", false),
    new Objective("Be carefull with that", 25000000000, "Now you can afford a gram of antimatter, that explodes at contact with matter", false),
    new Objective("77M kilometers", 1000000000000, "Go make your suitcase, we depart at morning... to mars", false),
    new Objective("EEUU", 1886000000000, "Buy the entire EEUU", false),
    new Objective("The pale blue dot", 5e15, "Buy the entire earth", false),
    new Objective("Long Long", Math.pow(2, 64) - 1, "This is the max number that can be stored in 64 bits with full precision", false),
    new Objective("A big step", 5e24, "Now you can stop you know", false),
    new Objective("A little bit energy", 2.77e32, "Now you could buy all the energy in the entire galaxy", false),
    new Objective("Insanity", 1e40, "Please just stop", false),
    new Objective("Hydrogen", 1.466e56, "Buy every atom of hydrogen that exists in the universe", false),
    new Objective("Ascension", 1e69, "Seriously", false),
    new Objective("Googol", 1e100, "Have 1 googol of dollars", false),
    new Objective("The end", Number.MAX_VALUE.toPrecision(21), "This is the max value javascript can store", false),
    new Objective("The REAL end", Infinity, "Congratulations, now go have a beer with your friends or something", false),
    new Objective("Breaking limits", Number.MAX_SAFE_INTEGER.toFixed(), "This is the last number javascript can store with full-precision", false)
];

var objectivesNotif = [];

var classes = [
    new Class("Peasant", "default class", "this class is the default, loses the 100% of the bet and wins 150%, can surrender with 50%",
        "classesImg/peasantImg.jpg", function(code) { return true; },
        function(code) {
            NormalGame(code, 0, 1.5, 0.5);    
        }, function() {}, true),
    new Class("Experienced", "Play a bit and earn experience", "A class that does not take any risks, and any is ANY, in fact, it keeps 50% if it loses, in exange it only wins 125% of the bet, and loses 100% on surrender",
        "classesImg/experiencedImg.jpg", function(code) { return (gamesWon + gamesLose) >= 10; }, 
        function(code) {
            NormalGame(code, 0.5, 1.25, 0);
        }, function() {},false),
    new Class("Cheater", "Get a 6 when its a 6", "This class knows a way to cheat, so you can win a 300% of what you bet, but there is a 10% chance you get caught and lose all your money, also you lose 100% of the bet and surrender win 50%",
        "classesImg/cheaterImg.jpg", function(code) { return card.value == 5 && nextCard.value == 5; },
        function(code) {
            NormalGame(code, 0, 3, 0.5);

            if(Math.random() <= 0.1 && code != 0) {
                notify("You have been caught", "rgb(250, 100, 100)", "", "", "", "rgb(255, 10, 10)", function() { destroyDiv(); balance = 0; updateBalance(); });
            }
        }, function() {}, false),
    new Class("Mage", "This class does not likes risky situations", "Have magic powers and a 25% of the time predicts the next card, wins with 125% of the bet and loses all, surrenders with 50%",
        "classesImg/mageImg.jpg", function(code) { return (card.value == 0 && nextCard.value == 0 && code == -1) || (card.value == 12 && nextCard.value == 12 && code == 1); },
        function(code) {
            NormalGame(code, 0, 1.25, 0.5);
        }, function() { 
            if(Math.random() < 0.25) notify("","","","", "url(cards.jpg)" + (-349 / 13 * nextCard.value) + "px " + (-36 * nextCard.suit) + "px", "I can predict this will be the next card", "rgb(100, 100, 100)", "");
        }, false),
    new Class("Inventor", "Loss is the key to learning", "This techy class is a really good inventor... of excuses, but can save you, with his 10% of probabilities of recover 100% of the bet on lose, in normal loses it loses with 0% of the bet, and wins 150%, but surrenders with 25%",
        "classesImg/inventorImg.jpg", function() { return gamesLose >= 20; },
        function(code) {
            NormalGame(code, Math.random() <= 0.25 ? 1 : 0, 1.50, 0.25);
        }, function() {}, false),
    new Class("Programmer", "Lost in the code", "This programmer will modify the code so you ALWAYS win, but it has a 50% chance of deleting itself in the process, wins 150%, surrenders with 0%", 
        "classesImg/programmerImg.jpg", function() { return (document.getElementById("programmerP").innerHTML != "Modify this for a free class") && !this.Locked; },
        function(code) {
            NormalGame(code, 0, 1.5, 0);

            if(Math.random() < 0.5) {
                notify("You lose Programmer", "rgb(200, 100, 100)", "", "", "", "", "rgb(255, 10, 10)", "");
                
                var div0 = document.getElementById("class" + this.name);
                div0.style.display = "none";

                SetCurrentClass("Peasant", true);

                this.Locked = true;
            }
        }, function() { nextCard.value = card.value; }, false),
    new Class("Dealer", "Atracted by big amounts of money", "This class lets you choose between 2 cards before starting the game, wins with 175% ands loses with 0% of the bet, can surrender with 75%",
        "classesImg/dealerImg.jpg", function(code) {console.log(bet); console.log(bet > 5000); return (bet > 5000);},
        function(code) {
            NormalGame(code, 0, 1.75, 0.75);
        }, function() {
            var div = document.getElementById("objectivesNotification");

            var card1 = new Card(Math.floor(Math.random() * 13), Math.floor(Math.random() * 4));
            var card2 = new Card(Math.floor(Math.random() * 13), Math.floor(Math.random() * 4));

            var h1 = document.createElement("h1");
            h1.innerHTML = "Select your card";

            var img1 = document.createElement("img");
            img1.style.width = "27px";
            img1.style.height = "36px";
            img1.style.background = "url(cards.jpg) " + (card1.value * -27) + "px " + (card1.suit * -36) + "px";
            img1.onclick = function() { card = card1; destroyDiv(); document.getElementById("cardImg").style.background = "url(cards.jpg)" + (-349 / 13 * card.value) + "px " + (-36 * card.suit) + "px";};

            var img2 = document.createElement("img");
            img2.style.width = "27px";
            img2.style.height = "36px";
            img2.style.background = "url(cards.jpg) " + (card2.value * -27) + "px " + (card2.suit * -36) + "px";
            img2.onclick = function() { card = card2; destroyDiv(); div.style.display = "none"; document.getElementById("cardImg").style.background = "url(cards.jpg)" + (-349 / 13 * card.value) + "px " + (-36 * card.suit) + "px";};
        
            div.appendChild(h1);
            div.appendChild(img1);
            div.appendChild(img2);

            div.style.background = "rgb(200, 200, 100)";
            div.style.display = "block";
        }, false),
    new Class("Blind", "Does not see where it is", "is blind, you cant see the card until results, but it will always be an ace or a king, wins 200%, loses 100%, and surrenders with 100%",
        "classesImg/blindImg.jpg", function() { return Math.random() < 0.01; }, 
        function(code) {
            NormalGame(code, 0, 2, 1);
        }, 
        function() {
            card.value = (Math.random() > 0.5) ? 0 : 12;
            document.getElementById("cardImg").style.background = "";
        }, false),
    new Class("Inversed", "desrevnI", "This class is the default one inversed, nothing else changes", 
        "classesImg/inversedImg.jpg", function() { return gamesWon > 50; }, function(code) {NormalGame(code, 1.5, 0, 0.5);}, function() {}, false),
    new Class("Enraged", "does not like to lose", "This class HATES to lose and will not lose more than 10% of the balance it has, otherwise loses 100%, wins 160%, and surrenders with 90%",
        "classesImg/enragedImg.jpg", function() {
            if(!(this.objectivesLast)) this.objectivesLast = 0;

            var objectivesCount = objectives.map(function(obj) { return obj.done; }).length;

            var result = (this.objectivesLast - 2 > objectivesCount);
            this.objectivesLast = objectivesCount;

            return result;
        }, function(code) {
            if(((card.value < nextCard.value && code == -1) || (card.value > nextCard.value && code == 1)) && bet > (balance * 0.1)) bet = balance * 0.1;
            
            NormalGame(code, 1, 1.6, 0.9);
        }, function() {}, false),
    new Class("Lucky", "Lucky guy", "Is so lucky the entire universe conspires so he will have a 50% more posibilities of win, wins 150%, soles 100%, and surrenders with 50%",
        "classesImg/luckyImg.jpg", function(code) { 
            if(!(this.wonCount)) this.wonCount = 0;

            if((card.value <= nextCard.value && code == 1) || (card.value >= nextCard.value && code == -1)) this.wonCount++; else this.wonCount = 0;

            return this.wonCount > 15;
        }, function(code) {
            if(Math.random() < 0.5) {
                if(code == 1) nextCard.value = card.value + Math.floor(Math.random() * (13 - card.value));
                else if(code == -1) nextCard.value = card.value - Math.floor(Math.random() * 13);
            }

            NormalGame(code, 0, 1.5, 0.5);
        }, function() {}, false),
];

function Start(){
    LoadObjectives();
    LoadClasses();

    SetCurrentClass(classes[0].name, false);

    balance = parseFloat(document.getElementById("balance").innerHTML.substr(1));
}

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

    if(isNaN(balance -= n)) balance = 1;
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
    do { nextCard = new Card(Math.floor(Math.random() * 13), Math.floor(Math.random() * 4)); }while(nextCard.equals(card));

    document.getElementById("resultDiv").style.display = "none";
    document.getElementById("cardImg").style.background = "url(cards.jpg)" + (-349 / 13 * card.value) + "px " + (-36 * card.suit) + "px";

    currClass.pregameAction();

    gameInProcess = true;
}

function Result(code) {
    if(!gameInProcess) {
        alert("You must start a game first");
        return;
    }
    
    document.getElementById("resultDiv").style.display = "block";
    if(code != 0) document.getElementById("resultImg").style.background = "url(cards.jpg)" + (-349 / 13 * nextCard.value) + "px " + (-36 * nextCard.suit) + "px";

    for(var i = 0; i < classes.length; i++) {
        if(!classes[i].unlocked && classes[i].unlockAction(code)) unlock(classes[i]);
    }

    currClass.gameAction(code);

    bet = 0;

    updateBalance();

    if(document.getElementById("gamesPlayed")) {
        document.getElementById("gamesPlayed").innerHTML = gamesLose + gamesWon;
        document.getElementById("gamesWon").innerHTML = gamesWon;
        document.getElementById("gamesLose").innerHTML = gamesLose;
    }

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

function notifObj() {
    if(objectivesNotif.length == 0) return;

        var objective = objectivesNotif.shift();

        notify(objective.done ? "Archievement unlocked!" : "Archievement lost...", objective.done ? "rgb(180, 255, 180)" : "rgb(255, 180, 180)",
             objective.name,"", "", "$" + objective.limit + "<br/>" + objective.text, objective.done ? "rgb(200, 200, 100)" : "rgb(200, 100, 200)", objectivesNotif.length > 0 ? notifObj : destroyDiv);

        document.getElementById("objective" + objective.name).style.textDecoration = objective.done ? "line-through" : "none";
        document.getElementById("objective" + objective.name).style.backgroundColor = objective.done ? "rgb(180, 250, 180)" : "rgb(255, 255, 255)";
}

function destroyDiv() {
    var div = document.getElementById("objectivesNotification");
    while(div.firstChild) div.removeChild(div.firstChild);
    div.style.display = "none";
}

function LoadObjectives() {
    objectives.sort(function(a, b) { return a.limit - b.limit });

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

function LoadClasses() {
    var div = document.getElementById("classDiv");

    for(var i = 0; i < classes.length; i++) {
        var h3 = document.createElement("h3");
        h3.innerHTML = classes[i].name;

        var img = document.createElement("img");
        img.src = classes[i].srcImage;

        var p = document.createElement("p");
        p.innerHTML = classes[i].unlockText;

        var div = document.getElementById("classDiv");
        div.innerHTML += "<div class=" + (classes[i].unlocked ? "classUnlocked" : "classLocked") + " id=class" + classes[i].name + (classes[i].unlocked ? (" onclick=SetCurrentClass('" + classes[i].name + "')") : "") + "></div>";

        var div0 = document.getElementById("class" + classes[i].name);

        div0.appendChild(h3);
        div0.appendChild(img);
        div0.appendChild(p);

        div.appendChild(div0);
    }
}

function SetCurrentClass(newClassName, forced) {
    if(gameInProcess && !forced) {
        alert("Cannot change class while in game");
        return;
    }

    var lastClass = currClass;
    currClass = classes[classes.findIndex(function(c) { return c.name == newClassName; })];
    document.getElementById("class" + currClass.name).className = "currClass";
    document.getElementById("class" + currClass.name).onclick = function() {};
    if(lastClass) {
        document.getElementById("class" + lastClass.name).className = "classUnlocked";
        document.getElementById("class" + lastClass.name).onclick = function() { SetCurrentClass(lastClass.name, false) };
    }
}

function unlock(toUnlock) {
    toUnlock.unlocked = true;

    destroyDiv();

    notify("New class unlocked!", "rgb(200, 255, 200)", toUnlock.name, toUnlock.srcImage, "", toUnlock.text + "<br/>Select it from the class menu", "rgb(10, 255, 10)", "");

    var div0 = document.getElementById("class" + toUnlock.name);
    div0.className = "classUnlocked";
    div0.onclick = function() { SetCurrentClass(toUnlock.name, false) };
}

function NormalGame(code, losePercent, winPercent, surrenderPercent) {
    if(code == 0) {
        balance += bet * surrenderPercent;
        bet = 0;

        return;
    }

    var high = code == 1;

    if((high && nextCard.value >= card.value) || (!high && nextCard.value <= card.value)) {
        document.getElementById("resultText").innerHTML = "You win!";
        document.getElementById("resultText").style.color = "rgb(100,255,100)"; 

        balance += (bet * winPercent);    

        gamesWon++;
    } else { 
        document.getElementById("resultText").innerHTML = "You lose...";
        document.getElementById("resultText").style.color = "rgb(255,100,100)";

        balance += (bet * losePercent);

        gamesLose++;
    }

    bet = 0;
}

function notify(title, titleColor, subtitle, imgSource, imgBackground, text, backgroundColor, specialButtonEffect) {
    if(notifyOn) { 
        setTimeout(function() { notify(title, titleColor, subtitle, imgSource, imgBackground, text, backgroundColor, specialButtonEffect); }, 1000); 
        return;
     }

    notifyOn = true;

    destroyDiv();
    
    if(title != "") {
        var h1 = document.createElement("h1");
        h1.innerHTML = title;
        h1.style.color = titleColor;
    }

    if(subtitle != "" && specialButtonEffect !== undefined) {
        var h2 = document.createElement("h2");
        h2.innerHTML = subtitle;
    }

    if(imgSource != "" && imgSource !== undefined) {
        var img = document.createElement("img");
        img.src = imgSource;
    }

    if(imgBackground != "" && imgBackground !== undefined) {
        if(!(img)) {
            var img = document.createElement("img");
        }
        img.style.background = imgBackground;
        img.style.width = "27px";
        img.style.height = "36px";
    }

    if(text != "" && text !== undefined) {
        var p = document.createElement("p");
        p.innerHTML = text;
        p.className = "infoParagraph";
    }

    var button = document.createElement("button");
    button.innerHTML = "Next";
    button.onclick = function() { notifyOn = false; (specialButtonEffect != "" && specialButtonEffect !== undefined) ? specialButtonEffect() : destroyDiv(); };

    var div = document.getElementById("objectivesNotification");
    if(h1) div.appendChild(h1);
    if(h2) div.appendChild(h2);
    if(img) div.appendChild(img);
    if(p) div.appendChild(p);
    div.appendChild(button);

    div.style.backgroundColor = backgroundColor;
    div.style.display = "block";
}