module.exports = function (instruction, nextInstruction) {
  this.board.selectAll('.ldSpots')
    .data([])
    .exit()
    .remove();

  let data = instruction.end.rd;

  if (nextInstruction.level > instruction.level && instruction.end) {
    data = instruction.end.rd.reverse();
  }

  const enter = this.leftDiagonalSpots
    .data(data)
    .enter()
    .append('circle');

  enter
    .attr('class', d => (d === '1' ? 'ldSpots' : 'none'))
    .attr('cx', (d, i) => (instruction.level < nextInstruction.level ? (i * 100) + 50 : ((i + 1) * 100) + 50))
    .attr('cy', ((instruction.level - 1) * 100) + 50);

  enter
    .transition()
    .delay(500)
    .duration(500)
    .attr('cx', (d, i) => (instruction.level < nextInstruction.level ? ((i + 1) * 100) + 50 : (i * 100) + 50))
    .attr('cy', instruction.level < nextInstruction.level ? (instruction.level * 100) + 50 : ((instruction.level - 2) * 100) + 50);
};
