// Global variables

// Variable to store the operation
let formula = "";

// Boolean to toggle a minus before the last operand (for symbol +/-)
let converted = false;

// Variables used for the phase 2 --> create a log with all the operations to consult with the browser console.
let result = "";
let operation = "";
let operationsLog = [];

// Constants used for comparison purposes only (to compare with the values registered by button click)
const symbols = "+-*/%";
const digits = "0123456789";

// Main functionality

// Getting elements from the DOM
const container = document.querySelector(".container"); // it's for changing button display system
const digitContainer = document.querySelector(".buttons"); // for displaytext (line below)
const displayText = document.querySelector(".display-text");

// Targeting all the buttons
digitContainer.addEventListener("click", event => {
  const value = event.target.getAttribute("value");

  if (value !== null) {
    // Evaluate every option to click in

    // Digits 0-9
    if (digits.includes(value)) {
 
      formula += value;
      /* Zero as a first character seems to cause problems to "eval"
       ** Example: 021 + 1 = 18 !? Uncomment line below */
      // console.log(eval("021+1")); --> first zero indicates octal numeral system
      
      if (formula[0] === "0" && formula[1] !== ".") {
        formula = formula.substring(1, formula.length);
      }

      // Clear
    } else if (value === "c") {
      formula = "0";

      // Symbol +/- (meaning convert to negative)
    } else if (value === "s") {
 
      // Toggle between inserting and removing a minus symbol before the last operand (if the array is not empty/zero)
      if (formula !== "0" && digits.includes(formula[formula.length - 1])) {
        if (!converted) {
          let insertAt = getLastSymbolIndex(symbols);
          let substring1 = formula.slice(0, insertAt + 1);
          let substring2 = formula.slice(insertAt + 1, formula.length);
          formula = substring1 + "-" + substring2;
          converted = true;
        } else {
          let insertAt = getLastSymbolIndex(symbols);
          let substring1 = formula.slice(0, insertAt);
          let substring2 = formula.slice(insertAt + 1, formula.length);
          formula = substring1 + substring2;
          converted = false;
        }
      }

      // Equal to execute registered operation
    } else if (value === "=") {
      // Re-set converted boolean for the "+/-" operator
      converted = false;

      // Clean the last character if not a number (operator at the end)
      if (!digits.includes(formula[formula.length - 1])) {
        formula = formula.substring(0, formula.length - 1);
      }
  
      formula = formula.replace(",", "");
      operation = formula;
      
      // Before calculating the result with "eval", replace "--" with "+" because apparently eval cannot handle it.
      formula = formula.replace("--", "+");

      // Avoid non-sense results
      if (formula === ".") {
        formula = "0";
      }
      
      formula = eval(formula);
      formula = Math.round(formula * 1000) / 1000;

      // Phase 2 requirement: add a log with the register of operations
      result = operation + " = " + formula;
      operationsLog.push(result);

      // Format the result to thousand separator "," and decimal separator "."
      formula = Intl.NumberFormat("en-US").format(formula);

      // If we considered that "%" means to calculate the percentage of a number:
      //} else if (value === "%") {
      //formula = eval(formula)/100;

      // Not to enter the decimal symbol twice in the array
    } else if (value === ".") {
      
      let insertAt = getLastSymbolIndex(symbols);
      let substr = formula.slice(insertAt + 1, formula.length);
      
      if (!substr.includes(value)) {
        formula += value;
      }

      // Not to repeat two operator symbols in a row
    } else if (symbols.includes(value)) {

      // Re-set the boolean "converted" for the "+/-" operator
      converted = false;

      if (formula !== "") {
        if (
          !symbols.includes(formula[formula.length - 1]) &&
          formula[formula.length - 1] !== "."
        ) {
          formula += value;
        }
      }
    }

    updateDisplay();
  }
});

// Event listener to register numbers entered by keyboard (only numbers 0-9)
document.addEventListener("keydown", event => {
  const key = event.key;

  if (digits.includes(key)) {
    formula += key;
  }

  updateDisplay();
});

// Event listener to switch to dark mode
const checkbox = document.getElementById("toggle");
checkbox.addEventListener("change", () => {
  container.classList.toggle("dark");
});

// Auxiliar functions

// Auxiliar function to show results on screen
function updateDisplay() {
  displayText.textContent = formula ? formula : "0";
  // Formating the text range so that its stay always inside of display
  if (formula.length > 11) {
    displayText.style.fontSize = "30px";
  } else if (formula.length > 7) {
    displayText.style.fontSize = "50px";
  } else {
    displayText.style.fontSize = "80px";
  }
}

/* Auxiliar function to return the position of the last symbol in the array
(to be able to apply the +/- operator only to the last operand) */
function getLastSymbolIndex(stringOfSymbols) {
  let lastSymbolIndex = -1;
  for (let i = 0; i < stringOfSymbols.length; i++) {
    let mySymbol = stringOfSymbols[i];
    if (formula.lastIndexOf(mySymbol) > lastSymbolIndex) {
      lastSymbolIndex = formula.lastIndexOf(mySymbol);
    }
  }
  return lastSymbolIndex;
}

// Call function to see results log
function operations() {
  for (let i in operationsLog) {
    console.log("Operation #" + i + ": " + operationsLog[i]);
  }
}
