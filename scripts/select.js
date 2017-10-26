module.exports = function() {

  d3.select("#startButton").on('click', () => {
    let boardSize = d3.select("#num").node().value;
    let newGame = new NQueenVis(boardSize);
    newGame.play();
  });
}
