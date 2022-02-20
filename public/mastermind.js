let inputBox = document.getElementById("inputBox")
let currGuessLine = document.getElementById("currGuessLine")
let responseLine = document.getElementById("responseLine");
let winLine = document.getElementById("winLine")


const possibleResponses = ["CCCC", "CCCW", "CCCX", "CCWW", "CCWX", "CCXX", "CWWW", "CWWX", "CWXX", "CXXX", "WWWW", "WWWX", "WWXX", "WXXX", "XXXX"]

const possibleCodes = new Set()

let workingSet = new Set()

const colorMap = new Map()

initialize();

let currentGuess = "1122";

let currentResponse = "";

console.log("Let's play Mastermind! Make your code, and no cheating please!");

currGuessLine.textContent = "I guess: " + translateNumberCode(currentGuess);

possibleCodes.delete(currentGuess);
console.log("I guess: " + translateNumberCode(currentGuess));
console.log("Please input the response for this guess (Use 'C' for colored, 'W' for white, and 'X' for blank");
console.log(`CurrentResponse: ` + currentResponse);

/*console.log(generateResponse("1111", "1122"));
console.log(generateResponse("1111", "2222"));
console.log(generateResponse("1111", "1111"));
console.log(generateResponse("3456", "6543"));*/


function initialize() {
    //hide winner line
    winLine.style.display = 'none';
    //setup digit to color name reference
    colorMap.set(1, "Black");
    colorMap.set(2, "White");
    colorMap.set(3, "Red");
    colorMap.set(4, "Yellow");
    colorMap.set(5, "Green");
    colorMap.set(6, "Blue");

    //populate possible codes with all possible combinations of 1-6 of length 4
    for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 7; j++) {
            for (let k = 1; k < 7; k++) {
                for (let l = 1; l < 7; l++) {
                    let newCode = i.toString() + j.toString() + k.toString() + l.toString();
                    //console.log(`Adding %s to possible codes\n`, newCode);
                    possibleCodes.add(newCode);
                }
            }
        }
    }

    //initialize the working set as a clone of possibleCodes
    workingSet = new Set(possibleCodes)

}

function onSubmitClicked() {
    let receivedResponse = inputBox.value.toUpperCase();
    responseLine.textContent = "Last received response: " + receivedResponse;
    inputBox.value = "";
    //console.log(receivedResponse);

    if (receivedResponse == "CCCC") {
        winLine.style.display = 'block';
        return;
    }

    currentResponse = receivedResponse;
    console.log("starting filter");
    workingSet.forEach(function (s) {
        //console.log("Checking " + s);
        let thisResponse = generateResponse(s, currentGuess);
        if (!(thisResponse == currentResponse)) {
            console.log("Removing " + s + " because it got response " + thisResponse + " instead of " + currentResponse);
            workingSet.delete(s);
        }
    })

    currentGuess = minimaxNextGuess();

    console.log("finished minimax, new guess: " + currentGuess);

    console.log(workingSet.has("2222"));

    possibleCodes.delete(currentGuess);

    currGuessLine.textContent = "I guess: " + translateNumberCode(currentGuess);

}

function minimaxNextGuess() {
    scoreArr = new Array(1300);
    for (let i = 0; i < 1300; i++) {
        scoreArr[i] = new Array();
    }

    possibleCodes.forEach(function (possibleGuess) {
        let score = getMinimaxScore(possibleGuess);
        scoreArr[score].push(possibleGuess);
    })

    for (let i = 1299; i >= 0; i--) {
        if (scoreArr[i].length > 0) {
            console.log("found score of " + i);
            scoreArr[i].sort();
            scoreArr[i].forEach(function (s) {
                if (workingSet.has(s))
                    return s;
            })
            return scoreArr[i][0];
        }
    }

}

function getMinimaxScore(possibleGuess) {
    let maxHits = 0;

    possibleResponses.forEach(function (response) {
        let hits = 0;

        workingSet.forEach(function (s) {
            let thisResponse = generateResponse(s, possibleGuess);
            if (thisResponse == response) {
                hits++;
            }
        })
        if (hits > maxHits) {
            maxHits = hits;
        }
    })
    return workingSet.size - maxHits;
}

function generateResponse(guess, code) {
    let countArray = [0, 0, 0, 0, 0, 0];

    let retString = "";

    let correctIndices = new Array();

    for (let i = 0; i < 4; i++) {
        let guessChar = guess.charAt(i);
        let codeChar = code.charAt(i);

        if (guessChar == codeChar) {
            correctIndices.push(i);
            retString += "C";
            continue;
        }
        else {
            countArray[codeChar - 1]++;
        }
    }

    //console.log("Budgets: " + countArray.toString());

    for (let i = 0; i < 4; i++) {
        if (correctIndices.includes(i)) {
            continue;
        }
        let guessChar = guess.charAt(i);
        if (countArray[guessChar - 1] > 0) {
            retString += "W";
            countArray[guessChar - 1]--;
        }
        else {
            retString += "X"
        }
    }
    let retArr = Array.from(retString);
    retArr.sort();
    return retArr.join("");
}

function translateNumberCode(code) {
    let retString = ""
    for (let i = 0; i < 4; i++) {
        let currInt = parseInt(code.charAt(i));
        let colorString = colorMap.get(currInt);
        retString += (colorString + " ");
    }
    return retString;
}