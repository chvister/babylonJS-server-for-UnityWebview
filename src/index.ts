// import { CreateSceneClass } from "../createScene";
import {
    Engine, Scene, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, SceneLoader, StandardMaterial, Color3, ActionManager,
    ExecuteCodeAction
} from "@babylonjs/core";
import {
    AdvancedDynamicTexture, Button, InputText, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'

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
            //click on mesh
            roomData[i].actionManager = new ActionManager(scene);
            roomData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function () {
                // alert(roomData[i].name);
                console.log(roomData[i].name);
            }));
            //avoid collision
            if (roomData[i].name === 'featureWall' || roomData[i].name === 'Walls') {
                // roomData[i].checkCollisions = true;
            }
        }
        //more datas
        const roomData2 = m
        for (let i = 0; i < roomData2.length; i++) {
            roomData2[i].actionManager = new ActionManager(scene);
            //@ts-ignore
            roomData2[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
                console.log(roomData2[i].name);
                var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
                advancedTexture.idealWidth = 600;

                var textSquare = new Rectangle();
                textSquare.width = 0.1;
                textSquare.height = "20px";
                textSquare.cornerRadius = 20;
                textSquare.color = "Orange";
                textSquare.thickness = 4;
                textSquare.background = "green";
                advancedTexture.addControl(textSquare);
                //@ts-ignore
                textSquare.linkWithMesh(roomData2[i]);
                textSquare.linkOffsetY = -150;

                var label = new TextBlock();
                //@ts-ignore
                label.text = roomData2[i].name;
                textSquare.addControl(label);

                var target = new Ellipse();
                target.width = "7px";
                target.height = "7px";
                target.color = "Orange";
                target.thickness = 2;
                target.background = "green";
                advancedTexture.addControl(target);
                //@ts-ignore
                target.linkWithMesh(roomData2[i]);

                var line = new Line();
                line.lineWidth = 4;
                line.color = "Orange";
                line.y2 = 10;
                line.linkOffsetY = -3;
                advancedTexture.addControl(line);
                //@ts-ignore
                line.linkWithMesh(roomData2[i]);
                line.connectedControl = textSquare;
            }));

            if (roomData2[i].name === 'windowGlass') {
                // roomData2[i].checkCollisions = true;
            }
        }
    }
);
