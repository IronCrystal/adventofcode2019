var fs = require('fs');
var timeStarted = Date.now();

var input = fs.readFileSync('input_7.txt', 'utf-8');

var inputValue = 43210;

var inputIntCode = input.split(',').map(function(val) {return parseInt(val)});

let code = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];

console.log('MAXIUMUM THRUST', _getMaxThrustValue(code));

// console.log(_getPhaseCombinations([1, 2, 3]));

function _getMaxThrustValue(code) {
  let combinations = _getPhaseCombinations([5, 6, 7, 8, 9]);

  let maxThrustValue = 0;
  combinations.forEach(function(phaseCombo) {
    let index = 0;
    let output = processIntcode(code.slice(), phaseCombo[index], 0);
    while (output) {
      index++;
      output = processIntcode(code.slice(), phaseCombo[index % 5], output);
      console.log('OUTPUT', output);
    }
    // let v1 = processIntcode(code.slice(), phaseCombo[0], 0);
    // console.log('V1', v1);
    // let v2 = processIntcode(code.slice(), phaseCombo[1], v1);
    // console.log('V2', v2);
    // let v3 = processIntcode(code.slice(), phaseCombo[2], v2);
    // console.log('V3', v3);
    // let v4 = processIntcode(code.slice(), phaseCombo[3], v3);
    // console.log('V4', v4);
    // let thrust = processIntcode(code.slice(), phaseCombo[4], v4);
    // console.log('THRUST', thrust);

    // v1 = processIntcode(code.slice(), phaseCombo[0], thrust);
    // console.log('V1', v1);
    // v2 = processIntcode(code.slice(), phaseCombo[1], v1);
    // console.log('V2', v2);
    // v3 = processIntcode(code.slice(), phaseCombo[2], v2);
    // console.log('V3', v3);
    // v4 = processIntcode(code.slice(), phaseCombo[3], v3);
    // console.log('V4', v4);
    // thrust = processIntcode(code.slice(), phaseCombo[4], v4);
    // console.log('THRUST', thrust);

    // v1 = processIntcode(code.slice(), phaseCombo[0], thrust);
    // console.log('V1', v1);
    // v2 = processIntcode(code.slice(), phaseCombo[1], v1);
    // console.log('V2', v2);
    // v3 = processIntcode(code.slice(), phaseCombo[2], v2);
    // console.log('V3', v3);
    // v4 = processIntcode(code.slice(), phaseCombo[3], v3);
    // console.log('V4', v4);
    // thrust = processIntcode(code.slice(), phaseCombo[4], v4);
    // console.log('THRUST', thrust);

    // v1 = processIntcode(code.slice(), phaseCombo[0], thrust);
    // console.log('V1', v1);
    // v2 = processIntcode(code.slice(), phaseCombo[1], v1);
    // console.log('V2', v2);
    // v3 = processIntcode(code.slice(), phaseCombo[2], v2);
    // console.log('V3', v3);
    // v4 = processIntcode(code.slice(), phaseCombo[3], v3);
    // console.log('V4', v4);
    // thrust = processIntcode(code.slice(), phaseCombo[4], v4);
    // console.log('THRUST', thrust);
    if (thrust > maxThrustValue) maxThrustValue = thrust;
  });

  return maxThrustValue;
}

process.exit(0);

function processIntcode(intcode, inputValue1, inputValue2) {
  let index = 0;
  let hasInsertedValue1 = false;
  let isHalted = false;
  let outputValue = 0;
  while (index < intcode.length && !isHalted) {
    let result = _processChunk(...getChunk(index));
    if (result && result.newPointer) index = result.newPointer;
    else index += result.increase;
  }

  console.log('FINAL INT CODE', intcode);

  return outputValue;

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
        if (!hasInsertedValue1) {
          intcode[b] = inputValue1;
          hasInsertedValue1 = true;
        }
        else {
          intcode[b] = inputValue2;
        }
        return {increase: 2};
      case 4:
        outputValue = intcode[b];
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

//https://stackoverflow.com/questions/37579994/generate-permutations-of-javascript-array
function _getPhaseCombinations(arr) {
  let ret = [];

  for (let i = 0; i < arr.length; i = i + 1) {
    let rest = _getPhaseCombinations(arr.slice(0, i).concat(arr.slice(i + 1)));

    if(!rest.length) {
      ret.push([arr[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([arr[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}