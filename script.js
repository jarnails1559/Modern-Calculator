const output = document.querySelector("[data-output]");
const history = document.querySelector("[data-history]");
const keypad = document.querySelector(".keypad");
const themeToggle = document.querySelector(".theme-toggle");

let firstValue = "";
let operator = "";
let awaitingNext = false;

const updateOutput = (value) => {
  output.textContent = value || "0";
};

const updateHistory = (text) => {
  history.textContent = text || "";
};

const appendNumber = (number) => {
  if (awaitingNext) {
    firstValue = number;
    awaitingNext = false;
  } else {
    firstValue = firstValue === "0" ? number : firstValue + number;
  }
  updateOutput(firstValue);
};

const addDecimal = () => {
  if (awaitingNext) {
    firstValue = "0.";
    awaitingNext = false;
    updateOutput(firstValue);
    return;
  }
  if (!firstValue.includes(".")) {
    firstValue = firstValue ? `${firstValue}.` : "0.";
    updateOutput(firstValue);
  }
};

const calculate = (value1, value2, operation) => {
  const num1 = parseFloat(value1);
  const num2 = parseFloat(value2);

  if (Number.isNaN(num1) || Number.isNaN(num2)) return "0";

  switch (operation) {
    case "+":
      return `${num1 + num2}`;
    case "-":
      return `${num1 - num2}`;
    case "*":
      return `${num1 * num2}`;
    case "/":
      return num2 === 0 ? "Error" : `${num1 / num2}`;
    default:
      return `${num2}`;
  }
};

const handleOperator = (nextOperator) => {
  const value = firstValue || "0";

  if (operator && !awaitingNext) {
    const result = calculate(history.dataset.value || value, value, operator);
    updateOutput(result);
    history.dataset.value = result;
  } else {
    history.dataset.value = value;
  }

  operator = nextOperator;
  awaitingNext = true;
  updateHistory(`${history.dataset.value} ${nextOperator}`);
};

const handleEquals = () => {
  if (!operator) return;
  const value = firstValue || "0";
  const result = calculate(history.dataset.value || "0", value, operator);
  updateOutput(result);
  updateHistory(`${history.dataset.value} ${operator} ${value}`);
  history.dataset.value = result;
  operator = "";
  awaitingNext = true;
};

const clearAll = () => {
  firstValue = "";
  operator = "";
  awaitingNext = false;
  updateOutput("0");
  updateHistory("Ready");
  delete history.dataset.value;
};

const toggleSign = () => {
  if (!firstValue) return;
  firstValue = `${parseFloat(firstValue) * -1}`;
  updateOutput(firstValue);
};

const toPercent = () => {
  if (!firstValue) return;
  firstValue = `${parseFloat(firstValue) / 100}`;
  updateOutput(firstValue);
};

keypad.addEventListener("click", (event) => {
  const key = event.target.closest("button");
  if (!key) return;

  if (key.dataset.number) {
    appendNumber(key.dataset.number);
    return;
  }

  if (key.dataset.operator) {
    handleOperator(key.dataset.operator);
    return;
  }

  switch (key.dataset.action) {
    case "decimal":
      addDecimal();
      break;
    case "clear":
      clearAll();
      break;
    case "negate":
      toggleSign();
      break;
    case "percent":
      toPercent();
      break;
    case "equals":
      handleEquals();
      break;
    default:
      break;
  }
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.setAttribute("aria-pressed", `${isDark}`);
  themeToggle.querySelector(".theme-toggle__icon").textContent = isDark
    ? "🌙"
    : "☀️";
  themeToggle.querySelector(".theme-toggle__text").textContent = isDark
    ? "Dark"
    : "Light";
});
