// import { CreateSceneClass } from "../createScene";
import { Engine, Scene, FreeCamera, UniversalCamera, Vector3, HemisphericLight, Mesh, SceneLoader, StandardMaterial, Color3, CircleEase, EasingFunction } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, InputText } from '@babylonjs/gui'

import "@babylonjs/loaders/glTF/2.0/glTFLoader";

// Basic setup
const canvas = document.querySelector("#renderCanvas");
//@ts-ignore
const engine = new Engine(canvas, true, null, true);
const scene = new Scene(engine);

const camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -10), scene);
camera.speed = 0.7

camera.attachControl(canvas, true);
camera.inputs.addMouseWheel();

// camera.setTarget(Zero());

//@ts-ignore
scene.activeCamera.attachControl(canvas, true);

const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

const tvPlane = Mesh.CreatePlane("plane", 2, scene);

tvPlane.position.x = 2.398400068283081;
tvPlane.position.y = 6.241600036621094;
tvPlane.position.z = -11.3681001663208 + 1;
tvPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;
// tvPlane.parent

const tvTexture = AdvancedDynamicTexture.CreateForMesh(tvPlane);

const inputTv = new InputText();
inputTv.width = 1;
inputTv.maxWidth = 1;
inputTv.height = "200px";
inputTv.text = "Televizor";
inputTv.color = "green";
inputTv.fontSize = 100;
inputTv.background = "transparent";
tvTexture.addControl(inputTv);

const lampPlane = Mesh.CreatePlane("lampPlane", 2, scene);
// plane.parent = sphere;
lampPlane.position.x = 8.346599578857422;
lampPlane.position.y = 4.164899826049805;
lampPlane.position.z = 10.029600143432617 - 1;
lampPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;
//@ts-ignore
const lampTexture = AdvancedDynamicTexture.CreateForMesh(lampPlane);

const inputLamp = new InputText();
inputLamp.width = 1;
inputLamp.maxWidth = 1;
inputLamp.height = "200px";
inputLamp.text = "Lampa";
inputLamp.color = "green";
inputLamp.fontSize = 100;
inputLamp.background = "transparent";
lampTexture.addControl(inputLamp);


// //Ground
const ground = Mesh.CreatePlane("ground", 200.0, scene);
ground.material = new StandardMaterial("groundMat", scene);
//@ts-ignore
ground.material.diffuseColor = new Color3(1, 1, 1);
ground.material.backFaceCulling = false;
ground.position = new Vector3(0, 0, 0);
ground.rotation = new Vector3(Math.PI / 2, 0, 0);

scene.gravity = new Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;

camera.checkCollisions = true;
camera.applyGravity = true;
camera.ellipsoid = new Vector3(1, 3, 1);

ground.checkCollisions = true;

window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => scene.render());
let roomData
const roomModel = SceneLoader.ImportMesh(
    "",
    "http://127.0.0.1:5502/",
    "scenes/interior/scene.glb",
    scene,
    function (m) {
        console.log(m);
        //@ts-ignore
        console.log(m[0]._children[8], 'm[0]._children[tv]');
        //@ts-ignore
        console.log(m[0]._children[10], 'm[0]._children[lamp]');
        //@ts-ignore
        roomData = m[0]._children
        console.log(roomData, 'roomData');
        for (let i = 0; i < roomData.length; i++) {
            const lampPlane = Mesh.CreatePlane(roomData[i].name, 2, scene);
            // plane.parent = sphere;
            lampPlane.position.x = roomData[i]._absolutePosition._x;
            lampPlane.position.y = roomData[i]._absolutePosition._y + 4;
            lampPlane.position.z = roomData[i]._absolutePosition._z;
            lampPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;
            //@ts-ignore
            const lampTexture = AdvancedDynamicTexture.CreateForMesh(lampPlane);
            
            const inputLamp = new InputText();
            inputLamp.width = 1;
            inputLamp.maxWidth = 1;
            inputLamp.height = "500px";
            inputLamp.text = roomData[i].name;
            inputLamp.color = "red";
            inputLamp.fontSize = 100;
            inputLamp.background = "transparent";
            lampTexture.addControl(inputLamp);
        }
        roomData[8]._absolutePosition._x = 6
        console.log(roomData[8],'roomData[8]._absolutePosition._x'); 
    }
);

