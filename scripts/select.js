module.exports = function () {
  d3.select('#startButton').on('click', () => {// eslint-disable-line
    const boardSize = d3.select('#num').node().value;// eslint-disable-line
    const newGame = new NQueenVis(boardSize);// eslint-disable-line
    newGame.play();
  });
};
