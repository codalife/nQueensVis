module.exports = function (instruction) {
  if (instruction.STATUS === 'Dead end') {
    document.getElementById('alert').innerHTML = 'Dead end';// eslint-disable-line
  } else if (instruction.STATUS === '!SOLUTION!') {
    document.getElementById('alert').innerHTML = 'Solution';// eslint-disable-line
  } else {
    document.getElementById('alert').innerHTML = 'Chilling';// eslint-disable-line
  }

  document.getElementById('bit').innerHTML = instruction.bit ? instruction.bit.toString(2) : 'pending';// eslint-disable-line
  document.getElementById('start').innerHTML = instruction.start ? instruction.start : 'pending';// eslint-disable-line
  document.getElementById('end').innerHTML = instruction.end ? instruction.end : 'pending';// eslint-disable-line
};
