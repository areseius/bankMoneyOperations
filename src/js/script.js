// ------------------------------------------------------- dom assignments

const opButtons = document.querySelectorAll(".opButton");
const moneyInput = document.querySelector(".moneyInput");
const operationTableBody = document.querySelector(".operationTableBody");
const tableRowTemplate = document.querySelector(".tableRowTemplate");
const alertText = document.querySelector(".alertText");
const historyModalArea = document.querySelector(".historyModalArea");
const cursor = document.querySelector(".cursor");

// ------------------------------------------------------- other assignments

let operationHistory = [];
let balance = 0;

// ------------------------------------------------------- alert functions

const incomeAlert = () => {
  alertText.textContent = "Limit exceeded. Limit: 10 000 ₼";
  alertText.classList.add("show");
  setTimeout(() => {
    alertText.classList.remove("show");
  }, 2000);
};

const withdrawAlert = (money) => {
  if (money <= 10000)
    alertText.textContent = `There is not enough money in the balance. Current balance: ${balance} ₼`;
  else alertText.textContent = "Limit exceeded. Limit: 10 000 ₼";
  alertText.classList.add("show");
  setTimeout(() => {
    alertText.classList.remove("show");
  }, 2000);
};

// ------------------------------------------------------- show alert

const showAlert = (opType, optional) => {
  switch (opType) {
    case "income":
      incomeAlert();
      break;
    case "withdraw":
      withdrawAlert(optional);
      break;
  }
};

// ------------------------------------------------------- create table row helper function

const updateElement = (element) => (id) => (content) => {
  element.children[id].textContent = content;
};

// ------------------------------------------------------- create table row

const createTableRow = (opType) => {
  const newRow = tableRowTemplate.content.cloneNode(true).children[0];

  updateElement(newRow)(0)(operationHistory.at(-1).id);
  updateElement(newRow)(1)(operationHistory.at(-1).type);

  if (opType === "income") {
    updateElement(newRow)(2)(`+ ${operationHistory.at(-1).amount} ₼`);
    newRow.children[2].style.color = "rgb(0, 255, 0)";
  } else {
    updateElement(newRow)(2)(`- ${operationHistory.at(-1).amount} ₼`);
    newRow.children[2].style.color = "rgb(255, 24, 24)";
  }

  updateElement(newRow)(3)(`${operationHistory.at(-1).balance} ₼`);
  updateElement(newRow)(4)(operationHistory.at(-1).date);

  newRow.setAttribute("data-operation-id", operationHistory.length - 1);

  return newRow;
};

// ------------------------------------------------------- buttons event listeners

const createOperation = (name, amount) => {
  switch (name) {
    case "income":
      incomeOp(amount);
      break;
    case "withdraw":
      withdrawOp(amount);
      break;
  }
};

// ------------------------------------------------------- operation functions

const incomeOp = (amount) => {
  balance += +amount;
  operationHistory.push({
    id: `#${operationHistory.length + 1}`,
    type: "income",
    amount: +amount,
    balance: balance,
    date: new Date().toLocaleString("az"),
    fee: 0,
  });
};

const withdrawOp = (amount) => {
  balance -= +amount;
  operationHistory.push({
    id: `#${operationHistory.length + 1}`,
    type: "withdraw",
    amount: +amount,
    balance: balance,
    date: new Date().toLocaleString("az"),
    fee: 0,
  });
};

// ------------------------------------------------------- buttons operations

incomeButtonFunction = () => {
  if (moneyInput.value <= 10000) {
    createOperation("income", moneyInput.value);
    operationTableBody.append(createTableRow("income"));
    moneyInput.value = "";
    console.log([...operationTableBody.children].slice(1));
  } else showAlert("income");
};

withdrawButtonFunction = () => {
  if (balance >= +moneyInput.value && +moneyInput.value <= 10000) {
    createOperation("withdraw", moneyInput.value);
    operationTableBody.append(createTableRow("withdraw"));

    moneyInput.value = "";
  } else showAlert("withdraw", +moneyInput.value);
};

// ------------------------------------------------------- buttons event listeners

opButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (moneyInput.value && moneyInput.value > 0) {
      switch (button.classList[0]) {
        case "incomeButton":
          incomeButtonFunction();
          break;
        case "withdrawButton":
          withdrawButtonFunction();
          break;
      }
    }
  });
});

// ------------------------------------------------------- update modal and then open

operationTableBody.addEventListener("click", (e) => {
  historyModalArea.classList.add("add");

  historyModalArea.children[0].classList.add("addModal");

  updateElement(
    historyModalArea.children[0].children[1].children[0].children[0]
  )(1)(operationHistory[+e.target.parentElement.dataset.operationId].id);
  updateElement(
    historyModalArea.children[0].children[1].children[0].children[1]
  )(1)(operationHistory[+e.target.parentElement.dataset.operationId].date);
  updateElement(
    historyModalArea.children[0].children[1].children[0].children[2]
  )(1)(operationHistory[+e.target.parentElement.dataset.operationId].type);

  updateElement(
    historyModalArea.children[0].children[1].children[2].children[0]
  )(1)(
    `${operationHistory[+e.target.parentElement.dataset.operationId].amount} ₼`
  );
  updateElement(
    historyModalArea.children[0].children[1].children[2].children[1]
  )(1)(
    `${operationHistory[+e.target.parentElement.dataset.operationId].fee} ₼`
  );
});

// ------------------------------------------------------- close modal

historyModalArea.querySelector(".doneButton").addEventListener("click", () => {
  historyModalArea.classList.remove("add");
  historyModalArea.children[0].classList.remove("addModal");
});

historyModalArea.addEventListener("click", (e) => {
  if (e.target.classList[0] == "historyModalArea") {
    historyModalArea.classList.remove("add");
    historyModalArea.children[0].classList.remove("addModal");
  }
});

// ------------------------------------------------------- cursor movement

document.addEventListener("mousemove", (e) => {
  cursor.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
});
