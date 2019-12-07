var fs = require('fs');
var emitter = require('events').EventEmitter;

var input = fs.readFileSync('input_7.txt', 'utf-8');

var inputValue = 43210;

var inputIntCode = input.split(',').map(function(val) {return parseInt(val)});

let code = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

console.log('MAXIUMUM THRUST', _getMaxThrustValue(inputIntCode));

// console.log(_getPhaseCombinations([1, 2, 3]));

function _getMaxThrustValue(code) {
  let combinations = _getPhaseCombinations([5, 6, 7, 8, 9]);

  let maxThrustValue = 0;
  combinations.forEach(function(phaseCombo) {
    let amplifierA = new Intcode(code.slice(), 'A');
    amplifierA.addInput(phaseCombo[0]);
    amplifierA.addInput(0);
    let amplifierB = new Intcode(code.slice(), 'B');
    amplifierB.addInput(phaseCombo[1])
    let amplifierC = new Intcode(code.slice(), 'C');
    amplifierC.addInput(phaseCombo[2]);
    let amplifierD = new Intcode(code.slice(), 'D');
    amplifierD.addInput(phaseCombo[3]);
    let amplifierE = new Intcode(code.slice(), 'E');
    amplifierE.addInput(phaseCombo[4]);

    console.log('About to process');
    amplifierA.processIntcode1();
    amplifierB.processIntcode1();
    amplifierC.processIntcode1();
    amplifierD.processIntcode1();
    amplifierE.processIntcode1();

    amplifierA.emitter.on('output', function(data) {
      console.log('AMPLIFIER A EMITTING DATA FROM THE EVENT LISTENER', data);
      amplifierB.addInput(data);
    });

    amplifierB.emitter.on('output', function(data) {
      console.log('AMPLIFIER B EMITTING DATA FROM THE EVENT LISTENER', data);
      amplifierC.addInput(data);
    });

    amplifierC.emitter.on('output', function(data) {
      console.log('AMPLIFIER C EMITTING DATA FROM THE EVENT LISTENER', data);
      amplifierD.addInput(data);
    });

    amplifierD.emitter.on('output', function(data) {
      console.log('AMPLIFIER D EMITTING DATA FROM THE EVENT LISTENER', data);
      amplifierE.addInput(data);
    });

    amplifierE.emitter.on('output', function(data) {
      console.log('AMPLIFIER E EMITTING DATA FROM THE EVENT LISTENER', data);
      amplifierA.addInput(data);
    });

    amplifierE.emitter.on('finished', function(outputValue) {
      console.log('FINAL THRUST VALUE', outputValue);
      if (outputValue > maxThrustValue) maxThrustValue = outputValue;
      console.log('THRUST VALUES', maxThrustValue);
    })
  });

}

// process.exit(0);

function Intcode(intcode, name) {
  this.intcode = intcode;
  this.emitter = new emitter();
  this.name = name;
  var that = this;

  let index = 0;
  let isHalted = false;
  let isWaitingOnInput = false;
  let outputValue = 0;
  let inputs = [];



  this.addInput = function(input) {
    console.log('ADDING INPUT', input);
    inputs.push(input);
    isWaitingOnInput = false;
    console.log('SETTING WAITING FOR FALSE');
  }

  this.processIntcode1 = function() {
    return new Promise(function(resolve, reject) {
      _processChunk(...getChunk(index))
      .then(function(result) {
        // console.log('RESULT', result);
        if (result && result.newPointer) index = result.newPointer;
        else index += result.increase;
        if (index < intcode.length && !isHalted) return that.processIntcode1(); //recursive?
        else {
          console.log('amplifier', that.name, 'is halted', isHalted);
          that.emitter.emit('finished', outputValue);
          console.log('AMPLIFIER ', that.name, ' IS HALTED');
          console.log('LAST OUTPUT WAS', outputValue);
          resolve();
        }
      })
      .catch(function(err) {
        console.log('Error', err);
      })
    })
  }
 
  //This returns a promise
  this.processIntcode2 = function() {
    return new Promise(function(resolve, reject) {
      while (index < intcode.length && !isHalted) {
        _processChunk(...getChunk(index))
        .then(function(result) {
          // console.log('RESULT', result);
          if (result && result.newPointer) index = result.newPointer;
          else index += result.increase;
        })
        .then(function() {
          console.log('Timing out');
          //maybe a random set timeout will allow addInput to run
          return new Promise(res => {
            setTimeout(() => {
              res();
            }, 1000);
          });
        })
        .catch(function(err) {
          console.log('Something went wrong', err);
          reject(err);
        })
      }
      resolve();
    });
    // while (index < intcode.length && !isHalted) {
    //   if (!isWaitingOnInput) {
    //     let result = _processChunk(...getChunk(index));
    //     if (result && result.newPointer) index = result.newPointer;
    //     else index += result.increase;
    //   }
    //   else {
    //     console.log('waiting...');
    //   }
    // }
  }
  

  // console.log('FINAL INT CODE', intcode);

  // return outputValue;

  function _processChunk(a, b, c, d) {
    return new Promise(function(resolve, reject) {
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
          resolve({increase: 4});
          break;
        case 2: 
          if (opcodeArray.length > 2) {
            if (opcodeArray[opcodeArray.length - 3]) x = b;
            else x = intcode[b];

            if (opcodeArray[opcodeArray.length - 4]) y = c;
            else y = intcode[c];
            intcode[d] = x * y;
          }
          else intcode[d] = intcode[b] * intcode[c];
          resolve({increase: 4});
          break;
        case 3:
          if (!inputs.length) {
            // console.log('Waiting on inputs at index', index);
            // console.log(intcode);
            isWaitingOnInput = true;
            resolve({increase: 0}); //Put the pointer back
            break;
          }
          else {
            console.log('AMPLIFIER', that.name, 'Found one input', inputs[0]);
            intcode[b] = inputs[0];
            inputs.shift();
            console.log('VALUE OF INTCODE[B]', intcode[b]);
            resolve({increase: 2}, 'asdf', 'asgdafgfds');
            break;
          }        
        case 4:
          // console.log('EMITTER', that.emitter);
          that.emitter.emit('output', intcode[b]);
          outputValue = intcode[b];
          resolve({increase: 2});
          break;
        case 5:
          if (opcodeArray[opcodeArray.length - 3]) x = b;
          else x = intcode[b];

          if (opcodeArray[opcodeArray.length - 4]) y = c;
          else y = intcode[c];
          
          if (x !== 0) resolve({newPointer: y});
          else resolve({increase: 3});
          break;
        case 6:
          if (opcodeArray[opcodeArray.length - 3]) x = b;
          else x = intcode[b];

          if (opcodeArray[opcodeArray.length - 4]) y = c;
          else y = intcode[c];
          
          if (x === 0) resolve({newPointer: y});
          else resolve({increase: 3});
          break;
        case 7:
          if (opcodeArray[opcodeArray.length - 3]) x = b;
          else x = intcode[b];

          if (opcodeArray[opcodeArray.length - 4]) y = c;
          else y = intcode[c];
          
          if (x < y) intcode[d] = 1;
          else intcode[d] = 0;
          resolve({increase: 4});
          break;
        case 8:
          if (opcodeArray[opcodeArray.length - 3]) x = b;
          else x = intcode[b];

          if (opcodeArray[opcodeArray.length - 4]) y = c;
          else y = intcode[c];
          
          if (x === y) intcode[d] = 1;
          else intcode[d] = 0;
          resolve({increase: 4});
          break;
        case 99:
          isHalted = true;
          resolve({increase: 1});
          break;
        default:
          console.log('Something went wrong');
          reject({increase: 1});
      }
    });
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