var fs = require('fs');
var input = fs.readFileSync('input_6.txt', 'utf-8');
var inputMap = input.trim().split('\n');

// var testmap = ['COM)B','B)C','C)D','D)E','E)F','B)G','G)H','D)I','E)J','J)K','K)L'];
// var testmap2 = ['COM)B','B)C','C)D','D)E','E)F','B)G','G)H','D)I','E)J','J)K','K)L','K)YOU','I)SAN'];

// getTotalOrbitCount(inputMap);

getDistanceToSanta(inputMap);

function getTotalOrbitCount(map) {
  let objectMap = {};
  map.forEach(function(orbit) {
    let orbitingObject = orbit.split(')')[1];
    let mass = orbit.split(')')[0];
    objectMap[orbitingObject] = mass;
  });
  console.log(objectMap);

  let total = 0;
  Object.keys(objectMap).forEach(function(key) {
    console.log(key, getTotalOrbits(key));
    total += getTotalOrbits(key);
  });

  console.log('TOTAL ORBITS', total);

  function getTotalOrbits(object) {
    if (object === 'COM') return 0;
    else return 1 + getTotalOrbits(objectMap[object]);
  }
}

//This is an n-ary tree I have to traverse
function getDistanceToSanta(map) {
  let objectMap = {};
  map.forEach(function(orbit) {
    let orbitingObject = orbit.split(')')[1];
    let mass = orbit.split(')')[0];
    objectMap[orbitingObject] = mass;
  });

  var treeMap = new Tree('COM');

  let youNode = null;

  getChildNodes(treeMap.root);

  console.log('TREE MAP', JSON.stringify(treeMap));

  console.log('DISTANCE', distance(treeMap.root, 'YOU', 'SAN'));

  function getChildNodes(node) {
    //Find all the values that have this key as a parent
    Object.keys(objectMap).forEach(function(orbitingObject) {
      if (objectMap[orbitingObject] === node.name) {
        let newNode = new Node(orbitingObject);
        if (orbitingObject === 'YOU') {
          youNode = newNode;
        }
        node.children.push(newNode);
        getChildNodes(newNode);
      }
    })
  }

  //https://www.geeksforgeeks.org/find-distance-between-two-nodes-of-a-binary-tree/
  function pathToNode(root, path, k) {
    if (!root) return false;
    path.push(root.name);

    if (root.name === k) {
      return true;
    }
    
    let isCorrectPath = root.children.some(function(node) {
      return pathToNode(node, path, k);
    });

    if (isCorrectPath) return isCorrectPath;
    else {
      path.pop();
      return false;
    }
  }

  function distance(root, name1, name2) {
    if (root) {
      var path1 = [];
      pathToNode(root, path1, name1);

      var path2 = [];
      pathToNode(root, path2, name2);

      let i = 0;

      while (i < path1.length && i < path2.length) {
        if (path1[i] !== path2[i]) {
          break;
        }
        i = i + 1;
      }
      return path1.length + path2.length - 2 * i - 2;
    }
    else return 0;
  }
}

//https://medium.com/@khushboo.taneja_61450/implementing-binary-search-tree-and-n-ary-tree-in-javascript-ba3e2081d345
function Node(name) {
  this.name = name;
  this.parent = null;
  this.children = [];
}

function Tree(name) {
  var node = new Node(name);
  this.root = node;
}