/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const countNQueensSolutions = __webpack_require__(1);
const queens = __webpack_require__(2);
const leftDiagonalSpots = __webpack_require__(3);
const rightDiagonalSpots = __webpack_require__(4);
const infoBoard = __webpack_require__(6);
const columnSpots = __webpack_require__(5);
const startBar = __webpack_require__(7);

((global) => {

	document.addEventListener("DOMContentLoaded", function(e) {
      startBar();

	   	class NQueenVis {
	   		constructor(n){
					this.n = n;
					this.playBook = countNQueensSolutions(n);
	   			this.board = d3.select('#board')
            .html('')
	   				.append('svg')
	   					.attr('class', 'board')
	   					.attr('width', 100 * n)
	   					.attr('height', 100 * n);
	   			this.queens = [];
					this.queensOnBoard = this.board.selectAll('.queen');
	   			this.currentLevel = 1;
	   			this.whites = [];
					this.stack = [];

					for (let r = 0; r < n; r++) {
						for (let c = 0; c < n; c++) {
							if ( (r + c)%2) {
								this.whites.push({x: r * 100, y: c * 100});
							}
						}
					}

					this.board.selectAll('.block')
						.data(this.whites)
						.enter()
						.append('rect')
							.attr('class', 'block')
							.attr('x', d => d.x)
							.attr('y', d => d.y);

					this.leftDiagonalSpots = this.board.selectAll('.ldSpots');
	   		}

	   		play() {
					let step = 0;

					const loop = setInterval(() => {
						let instruction = this.playBook[step];
						const nextInstruction = this.playBook[step + 1];
						const prevInstruction = this.playBook[step - 1];

						if (instruction.level < nextInstruction.level) {
							this.stack.push(instruction);
						} else {
							const popped = this.stack.pop()
							if (instruction.end === undefined) {
								instruction.end = popped.end;
							}
						}

						infoBoard(instruction);

						columnSpots.call(this, instruction, nextInstruction, prevInstruction)
						leftDiagonalSpots.call(this, instruction, nextInstruction, prevInstruction);
						rightDiagonalSpots.call(this, instruction, nextInstruction, prevInstruction);

					  queens.call(this, instruction, nextInstruction);

						step++;

						if (step === this.playBook.length - 1) {
							clearInterval(loop);
						}
	   			}, 2000);
				}
	   	}

	   	global.NQueenVis = NQueenVis;
	});
})(window)


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Shout Out to Greg Trowbridge
// for the biwise solution for the nQueens used in this project
// http://gregtrowbridge.com/a-bitwise-solution-to-the-n-queens-problem-in-javascript/


const getArrOfBitsFromNum = function(num) {
  let binary = num.toString(2);
  return binary.split('');
}

const convertBaseTenToBinary = (...args) => {
  const colOrDiag = {0: 'ld', 1: 'col', 2: 'rd'}

  return args.reduce((obj, arg, index) => {
    obj[colOrDiag[index]] = getArrOfBitsFromNum(arg);
    return obj;
  }, {});
}

 const countNQueensSolutions = function (n) {

  //Keeps track of the # of valid solutions
  var count = 0;

  //Helps identify valid solutions
  var done = Math.pow(2,n) - 1;
  var level = 1

  var solution = [];

  //Checks all possible board configurations
  var innerRecurse = function(ld, col, rd, w) {
    //All columns are occupied,
    //so the solution must be complete

    solution.push({LEVEL: level, start: convertBaseTenToBinary(ld, col, rd)})
    
    if (col === done) {
      solution.push({STATUS: '!SOLUTION!'});
      count++;
      return;
    }

    //Gets a bit sequence with "1"s
    //whereever there is an open "slot"
    var poss = ~(ld | rd | col);

    //Loops as long as there is a valid
    //place to put another queen.

    if (! (poss & done)) {
      solution.push({'STATUS': 'Dead end'} );
      solution.push({start: convertBaseTenToBinary(ld, col, rd)});
    }

    while ( poss & done ) {
      var bit = poss & -poss;
      poss -= bit;
      // solution.push({start: convertBaseTenToBinary(ld, col, rd)});

      solution.push({bit: Math.log2(bit)});

      solution.push({end: convertBaseTenToBinary((ld|bit), col|bit, (rd|bit))})
      level++

      innerRecurse((ld|bit)>>1, col|bit, (rd|bit)<<1);
      level --;
      solution.push({LEVEL: level, end: convertBaseTenToBinary((ld|bit), col|bit, (rd|bit))});
    }
  };

  innerRecurse(0,0,0);

  const flattened = [];

  let i = 0;
  let increment = true;

  while (i < solution.length) {
    if (solution[i]['LEVEL']) {
      var level = {level: solution[i]['LEVEL']};

      i++;
      if (i === solution.length) {
        break;
      }
      increment = false;
      while (!solution[i]['LEVEL']) {
        for (let key of Object.keys(solution[i])){
          level[key] = solution[i][key];
        }
        if (i < solution.length - 1) {
          i++;
        }
      }
      flattened.push(level)
    }
    if (increment) {
      i++;
    } else {
      increment = true;
    }
  }

  return flattened;
};

module.exports = countNQueensSolutions;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(instruction, nextInstruction) {
    if (instruction.bit !== undefined) {
      this.queens.push(instruction);
    }

    this.queens = this.queens.filter(q => q.level < nextInstruction.level );;

  	const queensOnBoard = this.board.selectAll('.queen')
  		.data(this.queens);

    queensOnBoard
      .exit()
        .transition()
        .delay(1000)
        .remove();

    queensOnBoard
      .enter()
      .append('g')
      .append('image')
        .attr('xlink:href','./assets/queen.png')
        .attr('class', 'queen')
        .attr('height', '100')
        .attr('width', '100')
        .attr('y', data => (data.level - 1) * 100)
        .attr('x', data => data.bit * 100 );
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function(instruction, nextInstruction, prevInstruction) {
  this.board.selectAll('.ldSpots')
    .data([])
      .exit()
      .remove();

  let data = instruction.end.rd;

  if (nextInstruction.level > instruction.level && instruction.end) {
    data = instruction.end.rd.reverse();
  }

  let enter = this.leftDiagonalSpots
    .data(data)
      .enter()
      .append('circle');

  enter
        .attr('class', d => d === '1' ? 'ldSpots' : 'none')
        .attr('cx', (d, i) => instruction.level < nextInstruction.level ? i * 100 + 50 : (i + 1) * 100 + 50)
        .attr('cy', (instruction.level - 1) * 100 + 50);

  enter
      .transition()
      .delay(500)
      .duration(500)
        .attr('cx', (d, i) => instruction.level < nextInstruction.level ? (i + 1) * 100 + 50 : i * 100 + 50)
        .attr('cy', instruction.level < nextInstruction.level ? instruction.level * 100 + 50 : (instruction.level - 2) * 100 + 50);
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(instruction, nextInstruction, prevInstruction) {
  this.board.selectAll('.rdSpots')
    .data([])
      .exit()
      .remove();

  let data = instruction.end.ld;

  if (nextInstruction.level > instruction.level && instruction.end) {
    data = instruction.end.ld.reverse();
  }

  let enter = this.leftDiagonalSpots
    .data(data)
      .enter()
      .append('circle');

  enter
        .attr('class', d => d === '1' ? 'rdSpots' : 'none')
        .attr('cx', (d, i) => instruction.level < nextInstruction.level ? i * 100 + 50 : (i - 1) * 100 + 50)
        .attr('cy', (instruction.level - 1) * 100 + 50);

  enter
      .transition()
      .delay(1000)
      .duration(500)
        .attr('cx', (d, i) => instruction.level < nextInstruction.level ? (i - 1) * 100 + 50 : i * 100 + 50)
        .attr('cy', instruction.level < nextInstruction.level ? instruction.level * 100 + 50 : (instruction.level - 2) * 100 + 50);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// TODO!!!
// I am working on this!!!

module.exports = function(instruction, nextInstruction, prevInstruction) {
  this.board.selectAll('.clSpots')
    .data([])
      .exit()
      .remove();

  let data = instruction.end.col;

  if (nextInstruction.level > instruction.level && instruction.end) {
    data = instruction.end.col.reverse();
  }

  let enter = this.leftDiagonalSpots
    .data(data)
      .enter()
      .append('circle');

  enter
        .attr('class', d => d === '1' ? 'clSpots' : 'none')
        .attr('cx', (d, i) => i * 100 + 50)
        .attr('cy', (instruction.level - 1) * 100 + 50);

  enter
      .transition()
      .duration(500)
        .attr('cx', (d, i) =>  i * 100 + 50)
        .attr('cy', instruction.level < nextInstruction.level ? instruction.level * 100 + 50 : (instruction.level - 2) * 100 + 50);
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function(instruction) {
  if (instruction.STATUS === "Dead end") {
    document.getElementById('alert').innerHTML = "Dead end";
  } else if (instruction.STATUS === "!SOLUTION!") {
    document.getElementById('alert').innerHTML = "Solution";
  } else {
    document.getElementById('alert').innerHTML = "Chilling";
  }

  document.getElementById('bit').innerHTML = instruction.bit ? instruction.bit.toString(2) : 'pending';
  document.getElementById('start').innerHTML = instruction.start ? instruction.start : 'pending';
  document.getElementById('end').innerHTML = instruction.end ? instruction.end : 'pending';
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function() {

  d3.select("#startButton").on('click', () => {
    let boardSize = d3.select("#num").node().value;
    let newGame = new NQueenVis(boardSize);
    newGame.play();
  });
}


/***/ })
/******/ ]);