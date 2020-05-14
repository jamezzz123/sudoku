const CELLS = document.querySelectorAll(".cell");
const BUTTONS = document.querySelectorAll(".button");
let PUZZLE = [];
let selectedCell;

function plotGrid() {
  let hiddenCells = hideCells();
  let cellIndex = 1;
  PUZZLE.forEach((item, index) => {
    item.forEach((element, index) => {
      if (hiddenCells.includes(cellIndex)) {
        document.getElementById(cellIndex).innerText = null;
        document
          .getElementById(cellIndex)
          .addEventListener("click", handleClick);
      } else {
        document.getElementById(cellIndex).innerText = element;
      }
      cellIndex++;
    });
  });
}
function hideCells() {
  let Hide = [];
  for (let index = 0; index < 10; index++) {
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
  console.log(PUZZLE);
}
function startGame() {
  BUTTONS.forEach((element) => {
    element.addEventListener("click", handleButtonClick);
  });
  generatePuzzle();
  swapCells();
  plotGrid();
}
function swapCells() {
  let swapArray = [];
  for (let index = 0; index < 10; index++) {
    let firstValue = Math.ceil(Math.random() * 9);
    let secondValue = Math.ceil(Math.random() * 9);
    while (firstValue == secondValue) {
      secondValue = Math.ceil(Math.random() * 9);
    }
    swapArray.push([firstValue, secondValue]);
  }
  console.log(swapArray);
  swapArray.forEach((swap) => {
    for (let index = 0; index < PUZZLE.length; index++) {
      for (let index2 = 0; index2 < PUZZLE[index].length; index2++) {
        if (swap.includes(PUZZLE[index][index2])) {
          let elementIndex = swap.indexOf(PUZZLE[index][index2]);
          let replace = elementIndex ? 0 : 1;
          PUZZLE[index][index2] = swap[replace];
        }
      }
    }
  });
  console.log(PUZZLE);
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
  let id = Number(selectedCell.id);
  selectedCell.innerText = e.target.innerText;
  checkDuplicate(id, value);
  checkCurrectValue(id, value);
  console.log(checkWin());
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
  let dx = 1;
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

  // document.getElementById(newSameNumber).classList.add("red");
}
function removeDuplicateClass() {
  console.log(arguments);
  for (var i in arguments) {
    document.getElementById(arguments[i]).classList.remove("red");
  }
  // document.getElementById(newSameNumber).classList.add("red");
}

function checkCurrectValue(id, value) {
  // console.log(value);

  let cellIndex = 1;
  for (let index = 0; index < PUZZLE.length; index++) {
    for (let index2 = 0; index2 < PUZZLE[index].length; index2++) {
      if (cellIndex === id) {
        if (PUZZLE[index][index2] != value) {
          console.log(value, "checkCurrentValue");
          addDuplicateClass(id);
        } else {
          removeDuplicateClass(id);
        }
      }
      cellIndex++;
    }
  }
}

function checkWin() {
  let cellIndex = 1;
  let count = 1;
  console.log(PUZZLE);
  for (let index = 0; index < PUZZLE.length; index++) {
    for (let index2 = 0; index2 < PUZZLE[index].length; index2++) {
      if (
        PUZZLE[index][index2] == document.getElementById(cellIndex).innerText
      ) {
        count++;
      }
      cellIndex++;
    }
  }
  if (count == 81) {
    return "okay";
  }
}

startGame();
