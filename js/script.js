// Globala variabler

var wordList; // Lista med spelets alla ord
var selectedWord; // Ett av orden valt av en slumpgenerator
var letterBoxes; //Rutorna där bokstäverna ska stå
var hangmanImg; //Bild som kommer vid fel svar
var hangmanImgNr; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
var msgElem; // Ger meddelande när spelet är över
var startGameBtn; // Knappen du startar spelet med
var letterButtons; // Knapparna för bokstäverna
var startTime; // Mäter tiden
var answerArray = []; //Lagrar ordet i en array.
var category;
var timer;
var secondTimer;

//Olika objekt med giltiga ord. Och hints.
var samling = {
    category: "Synonym för 'samling'",
    words: [
        "möte",
        "grupp",
        "klunga",
        "svärm",
        "hopsamling",
        "hopbringande",
        "penninginsamling",
        "håvgång",
        "insamling"]
};
    
var collection = {
    category: "Synonym för 'collection' (eng.)",
    words: [
        "aggregation",
        "accumulation",
        "assemblage",
        "compendium",
        "solicitation",
        "appeal",
        "ingathering"]
};

var categoryList = [];
categoryList.push(samling, collection)

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    category = document.getElementById("category");
    letterBoxes = document.getElementById("letterBoxes");
    startGameBtn = document.getElementById("startGameBtn");
    startGameBtn.addEventListener("click", startGame);
    letterButtons = document.getElementById("letterButtons").getElementsByClassName("btn btn--stripe");
    for (let index = 0; index < letterButtons.length; index++) {
        letterButtons[index].addEventListener("click", checkLetter);
    }
    hangmanImg = document.getElementById("hangman");
    msgElem = document.getElementById("message");
    hangmanImgNr = 0;
    hangmanImg.src = "images/h" + hangmanImgNr + ".png";
} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
function startGame() {
    hangmanImgNr = 0;
    answerArray = [];
    randomCategory();
    randomWord();
    createLetterBoxes();
    clearTimeout(timer);
    clearInterval(secondTimer);
    hangmanImg.src = "images/h" + hangmanImgNr + ".png";
    msgElem.innerHTML = "";
    for (let index = 0; index < letterButtons.length; index++) {
        letterButtons[index].disabled = false;
    }
    timer = setTimeout(function () {
        winOrLose("Time is up! You lose!");
        deactivateButtons("all");
    }, 60000);
    countTime();
}

//Funktion för att slumpa fram en kategori.
function randomCategory() {
    let selectedCategory = categoryList[Math.floor(Math.random() * categoryList.length)];
    wordList = selectedCategory.words;
    category.innerHTML = selectedCategory.category;
}

// Funktion som slumpar fram ett ord
function randomWord() {
    selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    for (let i = 0; i < selectedWord.length; i++) {
        answerArray[i] = "&nbsp;";
    }
}

// Funktionen som tar fram bokstävernas rutor, antal beror på vilket ord
function createLetterBoxes() {
    let output = "<ul>";
    //Stega igenom arrayen och skriv ut de bokstäver som vi gissat rätt på.
    for (let i = 0; i < selectedWord.length; i++) {
        output += "<li><input type=\"text\" disabled value=" + answerArray[i] + "></li>";
    }
    output += "</ul>";
    letterBoxes.innerHTML = output;
}
    
// Funktion som körs när du trycker på bokstäverna och gissar bokstav
function checkLetter(event) {
    let found = false;
    let pressedLetter = event.target.innerHTML.toLowerCase();
    //Deaktiverar den knapp man tryckt på.
    for (let index = 0; index < letterButtons.length; index++) {
        if (event.target.innerHTML === letterButtons[index].value) {
            deactivateButtons(index);
        }
    }
    // Gå igenom selectedWord och om pressedLetter motsvarar det som står på den index
    // positionen så lagras pressedLetter i answerArray, 
    for (let index = 0; index < selectedWord.length; index++) {
        if (selectedWord[index] === pressedLetter) {
            answerArray[index] = pressedLetter;
            found = true;
        } 
    }
    // Om vi inte har gissat rätt stega upp bildnumret och visa en bild.
    if (!found) {
        hangmanImgNr += 1;
        hangmanImg.src = "images/h" + hangmanImgNr + ".png";
        // Om vi har gissat för många gånger så har vi förlorat.
        if (hangmanImgNr === 6) {
            winOrLose("You lose!");
            deactivateButtons("all");
        }
        // Annars har vi vunnit! om arrayen innehåller samma sak som strängen.
    } else if (answerArray.join("") === selectedWord) {
        winOrLose("Du har vunnit!");
        hangmanImg.src = "images/fireworks.gif";
        deactivateButtons("all");
    }
    //Kalla på createLetterBoxes för att uppdatera dem med vad vi har gissat rätt på.
    createLetterBoxes();
}

// Funktionen ropas vid vinst eller förlust, gör olika saker beroende av det
function winOrLose(message) {
    msgElem.innerHTML = "<p>" + message + "</p>";
    hangmanImg.src = "images/h6.png";
    clearTimeout(timer);
    clearInterval(secondTimer);
}

// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på
function deactivateButtons(index) {
    if (index === "all") {
        for (let index = 0; index < letterButtons.length; index++) {
            letterButtons[index].disabled = true;
        }
    } else {
        letterButtons[index].disabled = true;
    }
}

//Funktion för att skapa en countdown timer.
function countTime() {
    startTime = new Date()
    var countDownTime = new Date(startTime.getTime() + 60000).getTime();
    // Kör igång själva timern.
    secondTimer = setInterval(function () {
        var timeNow = new Date().getTime();
        var timeDiff = countDownTime - timeNow;
        var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = "Tid kvar: " + seconds + "s ";
        // Om tiden har gått ut uppdatera sidan med text för detta.
        if (timeDiff < 0) {
            clearInterval(secondTimer);
            document.getElementById("timer").innerHTML = "Tiden har gått ut";
        }
    }, 1000);
}