
const possibleResponses = ["CCCC", "CCCW", "CCCX", "CCWW", "CCWX", "CCXX", "CWWW", "CWWX", "CWXX", "CXXX", "WWWW", "WWWX", "WWXX", "WXXX", "XXXX"]

const possibleCodes = new Set()

let workingSet = new Set()

const colorMap = new Map()

initialize();

let currentGuess = "1122";

let currentResponse = "";

console.log("Let's play Mastermind! Make your code, and no cheating please!");

document.getElementById("currGuessLine").textContent = "I guess: " + translateNumberCode(currentGuess);

possibleCodes.delete(currentGuess);
console.log("I guess: " + translateNumberCode(currentGuess));
console.log("Please input the response for this guess (Use 'C' for colored, 'W' for white, and 'X' for blank");
console.log(`CurrentResponse: ` + currentResponse);


function initialize() {
    //setup digit to color name reference
    colorMap.set(1, "Black");
    colorMap.set(2, "White");
    colorMap.set(3, "Red");
    colorMap.set(4, "Yellow");
    colorMap.set(5, "Green");
    colorMap.set(6, "Blue");

    //populate possible codes with all possible combinations of 1-6 of length 4
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            for (let k = 0; k < 7; k++) {
                for (let l = 0; l < 7; l++) {
                    let newCode = i.toString() + j.toString() + k.toString() + l.toString();
                    //console.log(`Adding %s to possible codes\n`, newCode);
                    possibleCodes.add(newCode);
                }
            }
        }
    }

    //initialize the working set as a clone of possibleCodes
    workingSet = new Set(possibleCodes);

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

function onSubmitClicked() {
    let receivedResponse = document.getElementById("inputBox").value;
    document.getElementById("responseLine").textContent = "Last received response: " + receivedResponse;
    document.getElementById("inputBox").value = "";
    console.log(receivedResponse);
}
