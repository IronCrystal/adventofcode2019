var fs = require('fs');
var timeStarted = Date.now();

fs.readFile('input_1.txt', 'utf-8', function(err, text) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  else {
    let inputs = text.trim().split('\n');
    let totalFuel = 0;
    inputs.forEach(function(mass) {
      totalFuel += _calculateFuelRequirement(mass);
    });
    console.log('Total fuel requirement', totalFuel);
    console.log('Processed in', Date.now() - timeStarted, 'ms');
    process.exit(0);
  }
})

function _calculateFuelRequirement(mass) {
  return parseInt(parseInt(mass) / 3) - 2;
}