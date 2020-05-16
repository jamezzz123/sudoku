const CELLS = document.querySelectorAll(".cell");
const BUTTONS = document.querySelectorAll(".button");
const Message = document.querySelector(".message");
const messageImg = document.getElementById("messageImg");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartGame");
const messageText = document.getElementById("messageText");
const diff = document.getElementsByName("diff");
const standardHideDiff = 22;
let difficulty;

let PUZZLE = [];
let PUZZLE2 = [];
let selectedCell;
let clock;

function plotGrid() {
  let hiddenCells = hideCells();
  PUZZLE2.forEach((element, index) => {
    if (hiddenCells.includes(index)) {
      document.getElementById(index + 1).innerText = null;
      document.getElementById(index + 1).addEventListener("click", handleClick);
      document.getElementById(index + 1).classList.add("selectable");
    } else {
      document.getElementById(index + 1).innerText = element;
    }
  });
}

function hideCells() {
  let Hide = [];
  let hiddenSpaces = standardHideDiff * difficulty;
  for (let index = 0; index < hiddenSpaces; index++) {
    let value = Math.ceil(Math.random() * 81);
    if (Hide.includes(value)) {
      index--;
    } else {
      Hide.push(value);
    }
  }
  return Hide;
}

function generatePuzzle() {
  let start = Math.ceil(Math.random() * 9);
  let notInclude = [];
  for (let index = 0; index < 9; index++) {
    PUZZLE.push([]);
    for (let index2 = 0; index2 < 9; index2++) {
      PUZZLE[index].push(start);
      start++;
      start = start > 9 ? 1 : start;
    }
    start = PUZZLE[index][2] + 1;
    start = start > 9 ? 1 : start;
    notInclude.push(PUZZLE[index][0]);

    if (index == 2 || index == 5) {
      while (notInclude.includes(start)) {
        start = Math.ceil(Math.random() * 9);
      }
    }
  }
  // console.log(PUZZLE);
}

function genPuz() {
  let notInclude = [];
  let start = Math.ceil(Math.random() * 9);
  for (let index = 0; index < 3; index++) {
    for (let index2 = 0; index2 < 3; index2++) {
      let ROW = [];
      for (let index3 = 0; index3 < 9; index3++) {
        ROW.push(start);
        start++;
        start = start > 9 ? 1 : start;
      }
      start = ROW[2] + 1;
      start = start > 9 ? 1 : start;
      PUZZLE2.push(...ROW);
      notInclude.push(ROW[0]);
    }
    if (index < 2) {
      while (notInclude.includes(start)) {
        start = Math.ceil(Math.random() * 9);
      }
    }
  }
}

function restartGame() {
  clearInterval(clock);
  messageText.innerText = "";
  Message.classList.add("show");
}

function startGame() {
  PUZZLE2 = [];
  for (let index = 0; index < diff.length; index++) {
    if (diff[index].checked) {
      difficulty = diff[index].value;
    }
  }
  CELLS.forEach((element) => {
    element.innerText = null;
    element.classList.remove("selected");
    element.classList.remove("selectable");
  });
  BUTTONS.forEach((element) => {
    element.removeEventListener("click", handleButtonClick);
  });
  BUTTONS.forEach((element) => {
    element.addEventListener("click", handleButtonClick);
  });
  // document.getElementById("seconds").innerHTML = '';
  // document.getElementById("minutes").innerHTML = '';
  // document.getElementById("hours").innerHTML = '';
  Message.classList.remove("show");
  genPuz();
  swapCells();
  plotGrid();
  anime({
    targets: ".cell",
    opacity: 1,
    scale: [{
        value: 0.1,
        easing: "easeOutSine",
        duration: 1000,
      },
      {
        value: 1,
        easing: "easeInOutQuad",
        duration: 10,
      },
    ],
    delay: anime.stagger(100, {
      grid: [9, 9],
      from: "center",
    }),
  });
  timer();
}

function swapCells() {
  let swapArray = [];
  let swapTimes = 10 * difficulty;
  for (let index = 0; index < 10; index++) {
    let firstValue = Math.ceil(Math.random() * 9);
    let secondValue = Math.ceil(Math.random() * 9);
    while (firstValue == secondValue) {
      secondValue = Math.ceil(Math.random() * 9);
    }
    swapArray.push([firstValue, secondValue]);
  }
  // console.log(swapArray);
  swapArray.forEach((swap) => {
    for (let index = 0; index < PUZZLE2.length; index++) {
      if (swap.includes(PUZZLE2[index])) {
        let elementIndex = swap.indexOf(PUZZLE2[index]);
        let replace = elementIndex ? 0 : 1;
        PUZZLE2[index] = swap[replace];
      }
    }
  });
  // console.log(PUZZLE2);
}

function handleClick(e) {
  CELLS.forEach((element) => {
    element.classList.remove("selected");
  });
  e.target.classList.add("selected");
  selectedCell = e.target;
}

function handleButtonClick(e) {
  let value = e.target.innerText;
  if (selectedCell.id == undefined) return;
  let id = Number(selectedCell.id);
  selectedCell.innerText = e.target.innerText;
  // if (e.target.innerText == "") {
  //   selectedCell.classList.remove('red')
  //   return
  // }
  checkDuplicate(id, value);
  checkCurrectValue(id, value);
  if (checkWin()) {
    messageText.innerText = "YOU WIN";
    messageImg.style.display = "block";
    // Message.
    Message.classList.add("show");
    clearInterval(clock);
  }
}

function getDuplicateArrayElements(arr) {
  var sorted_arr = arr.slice().sort();
  var results = [];
  for (var i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] === sorted_arr[i] && sorted_arr[i] != "") {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}

function duplicatesLogic(Arr) {
  let rowValues = [];
  Arr.forEach((element) => {
    let rowValue = document.getElementById(element).innerText;
    rowValues.push(rowValue);
  });

  let duplicatesArray = getDuplicateArrayElements(rowValues);
  let results = [];
  let index;

  duplicatesArray.forEach((item) => {
    while ((index = rowValues.indexOf(item)) != -1) {
      results.push(index + results.length);
      rowValues.splice(index, 1);
    }
  });

  let indexx = results.map((element) => {
    return Arr[element];
  });

  return indexx;
}

function checkDuplicate(id, value) {
  CELLS.forEach((item) => {
    item.classList.remove("red");
  });

  //CHECK DUPLICATE ROW
  // debugger;

  for (let index = 1; index <= 81; index = index + 9) {
    let ROW = [];
    let Vals = [];
    for (let i = index; i < 9 + index; i++) {
      ROW.push(i);
    }
    let deplicateIndex = duplicatesLogic(ROW);

    if (deplicateIndex.length) {
      addDuplicateClass(...deplicateIndex);
    }
  }

  // CHECK DUPILICATE COLUMNS
  for (let index = 1; index <= 9; index++) {
    // console.log(index)
    let COL = [];
    for (let i = index; i <= 9 * 8 + index; i = i + 9) {
      COL.push(i);
    }

    let deplicateIndex = duplicatesLogic(COL);
    if (deplicateIndex.length) {
      addDuplicateClass(...deplicateIndex);
    }
  }
  // CHECK DUPLICATE BLOCK
  let start = 1;
  for (let index = 1; index <= 9; index++) {
    let block = [];
    let val = start;
    for (let Kndex = 1; Kndex <= 9; Kndex++) {
      block.push(val);
      if (val % 3 == 0) {
        val = val + 7;
      } else {
        val++;
      }
    }
    let deplicateIndex = duplicatesLogic(block);
    if (deplicateIndex.length) {
      addDuplicateClass(...deplicateIndex);
    }

    if (start == 7 || start == 34) {
      start = start + 21;
    } else {
      start = start + 3;
    }
  }
}

function addDuplicateClass() {
  for (var i in arguments) {
    document.getElementById(arguments[i]).classList.add("red");
  }
}

function removeDuplicateClass() {
  // console.log(arguments);
  for (var i in arguments) {
    document.getElementById(arguments[i]).classList.remove("red");
  }
  // document.getElementById(newSameNumber).classList.add("red");
}

function checkCurrectValue(id, value) {
  for (let index = 0; index < PUZZLE2.length; index++) {
    if (index + 1 == id) {
      if (PUZZLE2[index] != value && value != '') {
        addDuplicateClass(id);
      } else {
        removeDuplicateClass(id);
      }
    }
  }
}

function checkWin() {
  // console.log(PUZZLE2);
  for (let index = 0; index < PUZZLE2.length; index++) {
    if (PUZZLE2[index] != document.getElementById(index + 1).innerText) {
      return false;
    }
  }
  return true;
}

function timer() {
  var sec = 0;

  function pad(val) {
    return val > 9 ? val : "0" + val;
  }
  clock = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(
      parseInt((sec / 60) % 60, 10)
    );
    document.getElementById("hours").innerHTML = pad(
      parseInt(sec / (60 * 60), 10)
    );
  }, 1000);
}

messageText.innerText = "WELCOME TO SUDOKU WEB";
startButton.addEventListener("click", startGame);
startButton.innerText = "START GAME";
restartButton.addEventListener("click", restartGame);