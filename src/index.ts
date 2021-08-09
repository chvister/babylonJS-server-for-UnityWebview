// import { CreateSceneClass } from "../createScene";
import { Engine, Scene, FreeCamera, UniversalCamera, Vector3, HemisphericLight, Mesh, SceneLoader } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, InputText } from '@babylonjs/gui'

import "@babylonjs/loaders/glTF/2.0/glTFLoader";

// Basic setup
const canvas = document.querySelector("#app");
//@ts-ignore
const engine = new Engine(canvas, true, null, true);
const scene = new Scene(engine);

const camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -10),scene);

camera.attachControl(canvas, true);
camera.inputs.addMouseWheel();

// camera.setTarget(Zero());

//@ts-ignore
scene.activeCamera.attachControl(canvas, true);

const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

window.addEventListener("resize", () => engine.resize());

engine.runRenderLoop(() => scene.render());

// var plane =  Mesh.CreatePlane("plane", 2);
// // plane.parent = sphere;
// plane.position.y = 7;
// plane.position.z = 5;
// plane.position.x = 3;
// var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

// var plane2 = BABYLON.Mesh.CreatePlane("plane2", 2);
// // plane.parent = sphere;
// plane2.position.y = 5;
// plane2.position.z = 5;
// plane2.position.x = 3;
// var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane2);

// var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click");
// button1.width = 0.5;
// button1.height = 0.4;
// button1.color = "white";
// button1.fontSize = 80;
// button1.background = "gray";
// button1.onPointerUpObservable.add(function () {
//     // alert("this is bed");
//     button1.background = 'green'
//     button1.textBlock.text = 'BED :)'
// });
// advancedTexture2.addControl(button1);

// var input = new BABYLON.GUI.InputText();
// input.width = 1;
// input.maxWidth = 1;
// input.height = "200px";
// input.text = "napis odkaz";
// input.color = "white";
// input.fontSize = 100;
// input.background = "gray";
// advancedTexture.addControl(input);

SceneLoader.ImportMesh(
  "",
  "http://127.0.0.1:5502/",
  "scenes/interior/scene.glb",
  scene,
  function (m) {
    // console.log(m);
  }
);