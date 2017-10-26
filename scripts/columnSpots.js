// TODO!!!
// I am working on this!!!

module.exports = function (instruction, nextInstruction) {
  this.board.selectAll('.clSpots')
    .data([])
    .exit()
    .remove();

  let data = instruction.end.col;

  if (nextInstruction.level > instruction.level && instruction.end) {
    data = instruction.end.col.reverse();
  }

  const enter = this.leftDiagonalSpots
    .data(data)
    .enter()
    .append('circle');

  enter
    .attr('class', d => (d === '1' ? 'clSpots' : 'none'))
    .attr('cx', (d, i) => (i * 100) + 50)
    .attr('cy', ((instruction.level - 1) * 100) + 50);

  enter
    .transition()
    .duration(500)
    .attr('cx', (d, i) => (i * 100) + 50)
    .attr('cy', instruction.level < nextInstruction.level ? (instruction.level * 100) + 50 : ((instruction.level - 2) * 100) + 50);
};
