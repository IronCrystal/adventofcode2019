var fs = require('fs');
var timeStarted = Date.now();

var input = fs.readFileSync('input_5.txt', 'utf-8');

var inputValue = 5;

var inputIntCode = input.split(',').map(function(val) {return parseInt(val)});

console.log(processIntcode(inputIntCode, inputValue));
// console.log(processIntcode([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], inputValue));

process.exit(0);

function processIntcode(intcode, inputValue) {
  let index = 0;
  let isHalted = false;

  while (index < intcode.length && !isHalted) {
    let result = _processChunk(...getChunk(index));
    if (result && result.newPointer) index = result.newPointer;
    else index += result.increase;
  }

  return intcode;

  function _processChunk(a, b, c, d) {
    let x, y;
    let opcodeArray = a.toString().split('').map(val => val = parseInt(val));
    let opcode = parseInt([opcodeArray[opcodeArray.length - 2], opcodeArray[opcodeArray.length - 1]].join(''));
    // console.log('OPCODE', opcode);
    switch(opcode) {
      case 1:
        if (opcodeArray.length > 2) {
          if (opcodeArray[opcodeArray.length - 3]) x = b;
          else x = intcode[b];

          if (opcodeArray[opcodeArray.length - 4]) y = c;
          else y = intcode[c];

          intcode[d] = x + y;
        }
        else intcode[d] = intcode[b] + intcode[c];
        return {increase: 4};
      case 2: 
        if (opcodeArray.length > 2) {
          if (opcodeArray[opcodeArray.length - 3]) x = b;
          else x = intcode[b];

          if (opcodeArray[opcodeArray.length - 4]) y = c;
          else y = intcode[c];
          intcode[d] = x * y;
        }
        else intcode[d] = intcode[b] * intcode[c];
        return {increase: 4};
      case 3:
        intcode[b] = inputValue;
        return {increase: 2};
      case 4:
        console.log(intcode[b]);
        return {increase: 2};
      case 5:
        if (opcodeArray[opcodeArray.length - 3]) x = b;
        else x = intcode[b];

        if (opcodeArray[opcodeArray.length - 4]) y = c;
        else y = intcode[c];
        
        if (x !== 0) return {newPointer: y};
        else return {increase: 3};
      case 6:
        if (opcodeArray[opcodeArray.length - 3]) x = b;
        else x = intcode[b];

        if (opcodeArray[opcodeArray.length - 4]) y = c;
        else y = intcode[c];
        
        if (x === 0) return {newPointer: y};
        else return {increase: 3};
      case 7:
        if (opcodeArray[opcodeArray.length - 3]) x = b;
        else x = intcode[b];

        if (opcodeArray[opcodeArray.length - 4]) y = c;
        else y = intcode[c];
        
        if (x < y) intcode[d] = 1;
        else intcode[d] = 0;
        return {increase: 4};
      case 8:
        if (opcodeArray[opcodeArray.length - 3]) x = b;
        else x = intcode[b];

        if (opcodeArray[opcodeArray.length - 4]) y = c;
        else y = intcode[c];
        
        if (x === y) intcode[d] = 1;
        else intcode[d] = 0;
        return {increase: 4};
      case 99:
        isHalted = true;
        return {increase: 1};
      default:
        console.log('Something went wrong');
        return {increase: 1};
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