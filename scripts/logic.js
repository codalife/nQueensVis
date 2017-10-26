// Shout Out to Greg Trowbridge
// for the biwise solution for the nQueens used in this project
// http://gregtrowbridge.com/a-bitwise-solution-to-the-n-queens-problem-in-javascript/


const getArrOfBitsFromNum = function (num) {
  const binary = num.toString(2);
  return binary.split('');
};

const convertBaseTenToBinary = (...args) => {
  const colOrDiag = { 0: 'ld', 1: 'col', 2: 'rd' };

  return args.reduce((accumulator, arg, index) => {
    accumulator[colOrDiag[index]] = getArrOfBitsFromNum(arg);// eslint-disable-line
    return accumulator;
  }, {});
};

const countNQueensSolutions = function (n) {
  // Helps identify valid solutions
  const done = (2 ** n) - 1;
  let level = 1;

  const solution = [];

  let count = 0;// eslint-disable-line
  // Checks all possible board configurations
  const innerRecurse = function (ld, col, rd) {

    solution.push({ LEVEL: level, start: convertBaseTenToBinary(ld, col, rd) });

    if (col === done) {
    // All columns are occupied,
    // so the solution must be complete
      solution.push({ STATUS: '!SOLUTION!' });
      count += 1;
      return;
    }

    // Gets a bit sequence with "1"s
    // whereever there is an open "slot"
    let poss = ~(ld | rd | col);// eslint-disable-line

    // Loops as long as there is a valid
    // place to put another queen.

    if (!(poss & done)) {// eslint-disable-line
      solution.push({ STATUS: 'Dead end' });
      solution.push({ start: convertBaseTenToBinary(ld, col, rd) });
    }

    while (poss & done) {// eslint-disable-line
      const bit = poss & -poss;// eslint-disable-line
      poss -= bit;

      solution.push({ bit: Math.log2(bit) });

      solution.push({ end: convertBaseTenToBinary((ld | bit), col | bit, (rd | bit)) });// eslint-disable-line
      level += 1;

      innerRecurse((ld | bit) >> 1, col | bit, (rd | bit) << 1);// eslint-disable-line
      level -= 1;

      solution.push({ LEVEL: level, end: convertBaseTenToBinary((ld | bit), col | bit, (rd | bit)) });// eslint-disable-line
    }
  };

  innerRecurse(0, 0, 0);

  const flattened = [];

  let i = 0;
  let increment = true;

  while (i < solution.length) {
    if (solution[i].LEVEL) {
      level = { level: solution[i].LEVEL };

      i += 1;
      if (i === solution.length) {
        break;
      }
      increment = false;
      while (!solution[i].LEVEL) {
        for (const key of Object.keys(solution[i])) {// eslint-disable-line
          level[key] = solution[i][key];
        }
        if (i < solution.length - 1) {
          i += 1;
        }
      }
      flattened.push(level);
    }
    if (increment) {
      i += 1;
    } else {
      increment = true;
    }
  }

  return flattened;
};

module.exports = countNQueensSolutions;
