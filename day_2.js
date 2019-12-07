var fs = require('fs');
var timeStarted = Date.now();

var input = fs.readFileSync('input_2.txt', 'utf-8');

var inputIntCode = input.split(',').map(function(val) {return parseInt(val)});

//First steps
// inputIntCode[1] = 12;
// inputIntCode[2] = 2;

let x = 0, y = 0;

//Brute force find the inputs
while (x < 100) {
  while (y < 100) {
    let newIntcode = inputIntCode.slice();
    newIntcode[1] = x;
    newIntcode[2] = y;
    let output = processIntcode(newIntcode)[0];
    if (output === 19690720) {
      console.log('x', x, 'y', y);
    }
    y++;
  }
  y = 0;
  x++;
}

process.exit(0);

function processIntcode(intcode) {
  let index = 0;
  let isHalted = false;

  while (index < intcode.length && !isHalted) {
    _processChunk(...getChunk(index));
    index += 4;
  }

  return intcode;

  function _processChunk(a, b, c, d) {
    switch(a) {
      case 1: 
        intcode[d] = intcode[b] + intcode[c];
        break;
      case 2: 
        intcode[d] = intcode[b] * intcode[c];
        break;
      case 99:
        isHalted = true;
        break;
      default:
        console.log('Something went wrong');
    }
  }

  function getChunk(startingIndex) {
    let returnValues = [];
    var x = 0;
    while (startingIndex + x < intcode.length && x < 4) {
      returnValues.push(intcode[startingIndex + x]);
      x++;
    }
    return returnValues;
  }
}