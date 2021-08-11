// import { CreateSceneClass } from "../createScene";
import {
    Engine, Scene, FreeCamera, UniversalCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, SceneLoader, StandardMaterial, Color3, ActionManager,
    ExecuteCodeAction, CircleEase, EasingFunction
} from "@babylonjs/core";
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

const box = MeshBuilder.CreateBox("box", { height: 1, width: 1, depth: 1 }, scene)
//custom
const tvPlane = Mesh.CreatePlane("plane", 2, scene);

tvPlane.position.x = 2.398400068283081;
tvPlane.position.y = 6.241600036621094;
tvPlane.position.z = -11.3681001663208 + 0.5;//worldmin - worldmax
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

//custom
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
camera.ellipsoid = new Vector3(1.5, 3, 1.5);

ground.checkCollisions = true;

window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => scene.render());

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
        const roomData = m[0]._children
        console.log(roomData, 'roomData');
        for (let i = 0; i < roomData.length; i++) {
            const modelPlanes = Mesh.CreatePlane(roomData[i].name, 2, scene);
            modelPlanes.position.x = roomData[i]._absolutePosition._x;
            modelPlanes.position.y = roomData[i]._absolutePosition._y + 3.5;
            modelPlanes.position.z = roomData[i]._absolutePosition._z;
            modelPlanes.billboardMode = Mesh.BILLBOARDMODE_ALL;
            //@ts-ignore
            const modelTexture = AdvancedDynamicTexture.CreateForMesh(modelPlanes);

            const modelInputs = new InputText();
            modelInputs.width = 1;
            modelInputs.maxWidth = 1;
            modelInputs.height = "500px";
            modelInputs.text = roomData[i].name;
            modelInputs.color = "red";
            modelInputs.fontSize = 100;
            modelInputs.background = "transparent";
            modelTexture.addControl(modelInputs);

            //click on mesh
            roomData[i].actionManager = new ActionManager(scene);
            roomData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                // alert(roomData[i].name);
                console.log(roomData[i].name);
            }));
            //avoid collision
            if(roomData[i].name === 'featureWall' || roomData[i].name === 'Walls'){
                roomData[i].checkCollisions = true;
            }
        }

        //more datas
        const roomData2 = m
        for (let i = 0; i < roomData2.length; i++) {
            roomData2[i].actionManager = new ActionManager(scene);
            //@ts-ignore
            roomData2[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                console.log(roomData2[i].name);
            }));
            if(roomData2[i].name === 'windowGlass'){
                roomData2[i].checkCollisions = true;
            }
            // const lampPlane = Mesh.CreatePlane(roomData2[i].name, 2, scene);
            // // plane.parent = sphere;
            //             //@ts-ignore
            // lampPlane.position.x = roomData2[i]._absolutePosition._x;
            //             //@ts-ignore
            // lampPlane.position.y = roomData2[i]._absolutePosition._y;
            //             //@ts-ignore
            // lampPlane.position.z = roomData2[i]._absolutePosition._z;
            // lampPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;
            // //@ts-ignore
            // const lampTexture = AdvancedDynamicTexture.CreateForMesh(lampPlane);

            // const inputLamp = new InputText();
            // inputLamp.width = 1;
            // inputLamp.maxWidth = 1;
            // inputLamp.height = "500px";
            // inputLamp.text = roomData2[i].name;
            // inputLamp.color = "red";
            // inputLamp.fontSize = 100;
            // inputLamp.background = "transparent";
            // lampTexture.addControl(inputLamp);
        }
    }
);

