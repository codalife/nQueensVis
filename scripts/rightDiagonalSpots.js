module.exports = function (instruction, nextInstruction) {
  this.board.selectAll('.rdSpots')
    .data([])
    .exit()
    .remove();

  let data = instruction.end.ld;

  if (nextInstruction.level > instruction.level && instruction.end) {
    data = instruction.end.ld.reverse();
  }

  const enter = this.leftDiagonalSpots
    .data(data)
    .enter()
    .append('circle');

  enter
    .attr('class', d => (d === '1' ? 'rdSpots' : 'none'))
    .attr('cx', (d, i) => (instruction.level < nextInstruction.level ? (i * 100) + 50 : ((i - 1) * 100) + 50))
    .attr('cy', ((instruction.level - 1) * 100) + 50);

  enter
    .transition()
    .delay(1000)
    .duration(500)
    .attr('cx', (d, i) => (instruction.level < nextInstruction.level ? ((i - 1) * 100) + 50 : (i * 100) + 50))
    .attr('cy', instruction.level < nextInstruction.level ? (instruction.level * 100) + 50 : ((instruction.level - 2) * 100) + 50);
};
