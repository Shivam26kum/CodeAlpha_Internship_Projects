const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateScreen(){
  displayEl.textContent = formatNumber(current);
  historyEl.textContent = previous !== null && operator
    ? `${formatNumber(previous)} ${operator}`
    : "\u00A0";
}

function formatNumber(numStr){
  if(numStr === "Error") return numStr;
  const [intPart, decPart] = numStr.split(".");
  const withCommas = Number(intPart).toLocaleString("en-US");
  return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
}

function inputDigit(digit){
  if(justEvaluated){
    current = digit;
    justEvaluated = false;
  } else {
    current = current === "0" ? digit : current + digit;
  }
  updateScreen();
}

function inputDecimal(){
  if(justEvaluated){ current = "0"; justEvaluated = false; }
  if(!current.includes(".")) current += ".";
  updateScreen();
}

function chooseOperator(op){
  if(operator && !justEvaluated) compute();
  previous = parseFloat(current);
  operator = op;
  justEvaluated = false;
  current = "0";
  updateScreen();
}

function compute(){
  if(operator === null || previous === null) return;
  const a = previous;
  const b = parseFloat(current);
  let result;
  switch(operator){
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷": result = b === 0 ? NaN : a / b; break;
    default: return;
  }
  current = Number.isNaN(result) ? "Error" : trimResult(result);
  operator = null;
  previous = null;
  justEvaluated = true;
  updateScreen();
}

function trimResult(num){
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll(){
  current = "0"; previous = null; operator = null; justEvaluated = false;
  updateScreen();
}

function negate(){
  if(current === "0") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  updateScreen();
}

function percent(){
  current = trimResult(parseFloat(current) / 100);
  updateScreen();
}

document.querySelectorAll("[data-num]").forEach(btn =>
  btn.addEventListener("click", () => inputDigit(btn.dataset.num)));

document.querySelectorAll("[data-op]").forEach(btn =>
  btn.addEventListener("click", () => chooseOperator(btn.dataset.op)));

document.querySelector('[data-action="equals"]').addEventListener("click", compute);
document.querySelector('[data-action="clear"]').addEventListener("click", clearAll);
document.querySelector('[data-action="negate"]').addEventListener("click", negate);
document.querySelector('[data-action="percent"]').addEventListener("click", percent);
document.querySelector('[data-action="decimal"]').addEventListener("click", inputDecimal);

const keyMap = { "+":"+", "-":"−", "*":"×", "/":"÷" };
document.addEventListener("keydown", e => {
  if(e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if(e.key === ".") inputDecimal();
  else if(keyMap[e.key]) chooseOperator(keyMap[e.key]);
  else if(e.key === "Enter" || e.key === "=") { e.preventDefault(); compute(); }
  else if(e.key === "Escape") clearAll();
  else if(e.key === "Backspace"){
    current = current.length > 1 ? current.slice(0,-1) : "0";
    updateScreen();
  }
});

updateScreen();
