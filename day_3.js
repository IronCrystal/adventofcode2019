var fs = require('fs');

var input = fs.readFileSync('input_3.txt', 'utf-8');

var wire1 = input.split('\n')[0].split(',');
var wire2 = input.split('\n')[1].split(',');

// console.log(getDistanceToClosestIntersection(wire1, wire2));
// console.log(getDistanceToClosestIntersection(['R8','U5','L5','D3'], ['U7','R6','D4','L4']));
// console.log(getDistanceToClosestIntersection(['R75','D30','R83','U83','L12','D49','R71','U7','L72'], ['U62','R66','U55','R34','D71','R55','D58','R83']));
console.log(getDistanceToClosestIntersection(['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51'], ['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']));

/**
  wire1 and wire2 are arrays of strings. each string is a direction and a distance ex R75
**/
function getDistanceToClosestIntersection(wire1, wire2) {
  let positions = [];
  console.log('initialized grid')
  let origin = [0, 0]; //Start somewhere in the center
  let intersections = [];

  console.log('About to process wire1');
  processWire(origin, wire1, 0);
  console.log('processed wire1');
  processWire(origin, wire2, 1);
  console.log('processed wire2');
  console.log('intersections', intersections);

  let closestIntersection = {
    distance: null,
    intersection: null
  }

  intersections.forEach(function(intersection) {
    let distance = stepsRequired(intersection);
    console.log('Distance for intersection', intersection, 'is', distance);
    if (closestIntersection.distance === null || distance < closestIntersection.distance) {
      closestIntersection = {
        distance: distance,
        intersection: intersection
      }
    }
  });

  return closestIntersection.distance;

  function stepsRequired(intersection) {
    let steps1 = positions[0].findIndex(pos => intersection[0] === pos[0] && intersection[1] === pos[1]);
    let steps2 = positions[1].findIndex(pos => intersection[0] === pos[0] && intersection[1] === pos[1]);
    return steps1 + steps2;
  }

  function distanceToOrigin(origin, intersection) {
    return Math.abs(origin[0] - intersection[0]) + Math.abs(origin[1] - intersection[1]);
  }

  function processWire(origin, wire, index) {
    positions.push([origin.slice()]);
    let position = origin.slice();
    wire.forEach(function(path) {
      position = layWire2(position, path.substring(0, 1), parseInt(path.substring(1)), index);
    });
  }

  function layWire2(position, direction, distance, index) {
    console.log('Laying wire starting from', position, 'in direction', direction, 'distance', distance);

    switch(direction) {
      case 'R':
        let a = 1;
        while (a <= distance) {
          position[0] = position[0] + 1;
          if (positionTraveled(position, index)) {
            console.log('FOUND INTERSECTION MOVING RIGHT', position);
            intersections.push(position.slice());
          }
          positions[index].push(position.slice());
          a++;
        }
        break;
      case 'L':
        let b = 1;
        while (b <= distance) {
          position[0] = position[0] - 1;
          if (positionTraveled(position, index)) {
            console.log('FOUND INTERSECTION MOVING LEFT', position);
            intersections.push(position.slice());
          }
          positions[index].push(position.slice());
          b++;
        }
        break;
      case 'U':
        let c = 1;
        while (c <= distance) {
          position[1] = position[1] - 1;
          if (positionTraveled(position, index)) {
            console.log('FOUND INTERSECTION MOVING UP', position);
            intersections.push(position.slice());
          }
          positions[index].push(position.slice());
          c++;
        }
        break;
      case 'D':
        let d = 1;
        while (d <= distance) {
          position[1] = position[1] + 1;
          if (positionTraveled(position, index)) {
            console.log('FOUND INTERSECTION MOVING DOWN', position);
            intersections.push(position.slice());
          }
          positions[index].push(position.slice());
          d++;
        }
        break;
      default:
        console.log('Unkown direction', direction);
    }
    return position;
  }

  function positionTraveled(pos, index) {
    let foundPos = positions.find(function(wirePositions, idx) {
      return wirePositions.find(function(posit) {
        return posit[0] === pos[0] && posit[1] === pos[1] && idx !== index;
      })
    });
    return foundPos;
  }
}