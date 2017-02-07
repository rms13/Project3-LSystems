
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  var leafMaterial = new THREE.MeshLambertMaterial( {color: 0x3A5F0B, side: THREE.DoubleSide} );
  var objLoader = new THREE.OBJLoader();
  objLoader.load('/leaf.obj', function(obj) {
    var leafOBJ = obj.children[0].geometry;
    var leaf = new THREE.Mesh(leafOBJ, leafMaterial);
    leaf.name="leaf1";
    scene.add(leaf);
    //var leaf = new THREE.Mesh(leafOBJ, lambertWhite);
  });

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.updateAxiom(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'F').onChange(function(newVal) {
    lsys.updateGramF(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'X').onChange(function(newVal) {
    lsys.updateGramX(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'A').onChange(function(newVal) {
    lsys.updateGramA(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'ProbabilityA').onChange(function(newVal) {
    lsys.updateProbA(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'B').onChange(function(newVal) {
    lsys.updateGramB(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'ProbabilityB').onChange(function(newVal) {
    lsys.updateProbB(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });

  // gui.add(turtle, 'angle', 0, 360).step(1).onChange(function(newVal) {
  //   clearScene(turtle);
  //   turtle.updateAngle(newVal);
  //   doLsystem(lsys, lsys.iterations, turtle);
  // });
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i > 3; i--) {
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
}

function doLsystem(lsystem, iterations, turtle) {
    var result = lsystem.doIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene);
    //turtle.printState();
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
