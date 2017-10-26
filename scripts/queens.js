module.exports = function (instruction, nextInstruction) {
  if (instruction.bit !== undefined) {
    this.queens.push(instruction);
  }

  this.queens = this.queens.filter(q => q.level < nextInstruction.level);

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
    .attr('xlink:href', './assets/queen.png')
    .attr('class', 'queen')
    .attr('height', '100')
    .attr('width', '100')
    .attr('y', data => (data.level - 1) * 100)
    .attr('x', data => data.bit * 100);
};
