const subdisplay = document.querySelector(".subdisplay p");
const maindisplay = document.querySelector(".maindisplay p");
const numButtons = document.querySelectorAll(".dis");
const operatorButtons = document.querySelectorAll(".op");
const clearBtn = document.querySelector("#alldel");
const equalsBtn = document.querySelector(".equal");
const dotBtn = document.querySelector("#dot");

let currentValue = "";
let previousValue = "";
let displayHistory = "";
let currentOperator = "";

const updateDisplay = () => {
    maindisplay.textContent = currentValue || "0";
    subdisplay.textContent = displayHistory;
};

numButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.value === ".") {
            if (!currentValue.includes(".")) {
                currentValue += ".";
                dotBtn.disabled = true;
            }
        } else {
            if (currentValue.length < 16) {
                currentValue += btn.value;
            }
        }
        updateDisplay();
    });
});

operatorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (currentValue === "") return;
        
        if (previousValue && currentOperator) {
            calculateResult();
        }
        
        previousValue = currentValue;
        currentOperator = btn.value;
        displayHistory = `${previousValue} ${btn.value} `;
        currentValue = "";
        dotBtn.disabled = false;
        updateDisplay();
    });
});

const calculateResult = () => {
    if (!previousValue || !currentOperator || !currentValue) return;

    let result;
    const num1 = parseFloat(previousValue);
    const num2 = parseFloat(currentValue);

    switch (currentOperator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "÷":
            result = num2 !== 0 ? num1 / num2 : "Error";
            break;
        case "%":
            result = (num1 * num2) / 100;
            break;
        case "^":
            result = Math.pow(num1, num2);
            break;
        default:
            return;
    }

    currentValue = result > 9999999999999999 ? "Overflow" : result.toString().slice(0, 16);
    previousValue = "";
    currentOperator = "";
    displayHistory = "";
    dotBtn.disabled = false;
    updateDisplay();
};

equalsBtn.addEventListener("click", calculateResult);

clearBtn.addEventListener("click", () => {
    currentValue = "";
    previousValue = "";
    displayHistory = "";
    currentOperator = "";
    dotBtn.disabled = false;
    updateDisplay();
});