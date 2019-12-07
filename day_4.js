// var start = 265275;
let start = 266666;
var end = 781584;

getAllPasswords(start, end);

function getAllPasswords(start, end) {
  let count = 0;
  for (var x = start; x <= end; x = increase(x)) {
    if (_adjacentDigits(x)) {
      console.log('X', x);
      count++;
    }
  }
  console.log('Found', count, 'valid numbers');
}

function _adjacentDigits(x) {
  let number = x.toString().split('').map(val => val = parseInt(val));
  return (number[0] === number[1] && number[1] !== number[2]) || 
         (number[1] === number[2] && number[2] !== number[3] && number[2] !== number[0]) ||
         (number[2] === number[3] && number[3] !== number[4] && number[3] !== number[1]) ||
         (number[3] === number[4] && number[4] !== number[5] && number[4] !== number[2]) ||
         (number[4] === number[5] && number[5] !== number[3]);
  // return number[0] === number[1] || number[1] === number[2] || number[2] === number[3] || number[3] === number[4] || number[4] === number[5];
}

function _noMoreThanDouble(x) {
  let number = x.toString().split('').map(val => val = parseInt(val));
  let isValid = true;
  number.forEach(function(val) {
    let count = 0;
    number.forEach(function(val2) {
      if (val === val2) {
        count++;
        if (count > 2) isValid = false;
      }
    })
  })
  return isValid;
}

function increase(x) {
  if (x % 10 === 9) {
    //The number is about to be increased, but a zero is going to be less than the tens digit.
    let number = x.toString().split('').map(val => val = parseInt(val));

    if (number[4] < 9) {
      number[4] = number[4] + 1;
      number[5] = number[4];
    }
    else if (number[3] < 9) {
      number[3] = number[3] + 1;
      number[4] = number[3];
      number[5] = number[3];
    }
    else if (number[2] < 9) {
      number[2] = number[2] + 1;
      number[3] = number[2];
      number[4] = number[2];
      number[5] = number[2];
    }
    else if (number[1] < 9) {
      number[1] = number[1] + 1;
      number[2] = number[1];
      number[3] = number[1];
      number[4] = number[1];
      number[5] = number[1];
    }
    else if (number[0] < 9) {
      number[0] = number[0] + 1;
      number[1] = number[0];
      number[2] = number[0];
      number[3] = number[0];
      number[4] = number[0];
      number[5] = number[0];
    }
    //else the number just became 7 digits
    return parseInt(number.join(''));
  }
  else return x + 1;
}