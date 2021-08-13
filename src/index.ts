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

const camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -5), scene);
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

//add xr
const env = scene.createDefaultEnvironment();

//@ts-ignore
const xr = await scene.createDefaultXRExperienceAsync({
    //@ts-ignore
    // floorMeshes: [env.ground]
    //    xrInput: defaultXRExperience.input,
    //@ts-ignore   
    floorMeshes: [env.ground] /* Array of meshes to be used as landing points */
});

const roomModel = SceneLoader.ImportMesh(
    "",
    "scene/",
    "scene.glb",
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
                roomData[i].checkCollisions = true;
            }
        }
        //more datas
        const roomFullData = m
        for (let i = 0; i < roomFullData.length; i++) {
            roomFullData[i].actionManager = new ActionManager(scene);
            //@ts-ignore
            // roomFullData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
                roomFullData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                console.log(roomFullData[i].name);
                const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
                modelTexture.idealWidth = 600;
                const textSquare = new Rectangle();
                textSquare.width = 0.14;
                textSquare.height = "20px";
                textSquare.cornerRadius = 20;
                textSquare.color = "Orange";
                textSquare.thickness = 4;
                textSquare.background = "green";
                modelTexture.addControl(textSquare);
                //@ts-ignore
                textSquare.linkWithMesh(roomFullData[i]);
                textSquare.linkOffsetY = -50;

                const labelModel = new TextBlock();
                //@ts-ignore
                labelModel.text = roomFullData[i].name;
                textSquare.addControl(labelModel);

                const targetModel = new Ellipse();
                targetModel.width = "7px";
                targetModel.height = "7px";
                targetModel.color = "Orange";
                targetModel.thickness = 2;
                targetModel.background = "green";
                modelTexture.addControl(targetModel);
                //@ts-ignore
                targetModel.linkWithMesh(roomFullData[i]);

                const lineModel = new Line();
                lineModel.lineWidth = 4;
                lineModel.color = "Orange";
                lineModel.y2 = 10;
                lineModel.linkOffsetY = -3;
                modelTexture.addControl(lineModel);
                //@ts-ignore
                lineModel.linkWithMesh(roomFullData[i]);
                lineModel.connectedControl = textSquare;
            }));

            if (roomFullData[i].name === 'windowGlass') {
                roomFullData[i].checkCollisions = true;
            }
        }

        
        // //controller input
        // xr.input.onControllerAddedObservable.add((controller) => {
        //     console.log(xr.input,'xr.input'); 
        //     controller.onMotionControllerInitObservable.add((motionController) => {
        //         console.log(motionController,'motionController'); 
        //         console.log(controller,'controller'); 
                                  
        //         if (motionController.handness === 'right') {
        //             const xr_ids = motionController.getComponentIds();
        //             console.log(xr_ids,'xr_ids'); 
        //             console.log(xr_ids,'xr_ids'); 
        //             let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
        //             triggerComponent.onButtonStateChangedObservable.add(() => {
        //                 if (triggerComponent.pressed) {
        //                     // for (let i = 0; i < roomFullData.length; i++) {
        //                     const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        //                     modelTexture.idealWidth = 600;
        //                     const textSquare = new Rectangle();
        //                     textSquare.width = 0.14;
        //                     textSquare.height = "20px";
        //                     textSquare.cornerRadius = 20;
        //                     textSquare.color = "Orange";
        //                     textSquare.thickness = 4;
        //                     textSquare.background = "green";
        //                     modelTexture.addControl(textSquare);
        //                     //@ts-ignore
        //                     textSquare.linkWithMesh(roomFullData[40]);
        //                     // textSquare.linkWithMesh(roomFullData[i]);
        //                     textSquare.linkOffsetY = -50;

        //                     const labelModel = new TextBlock();
        //                     //@ts-ignore
        //                     labelModel.text = roomFullData[40].name;
        //                     // labelModel.text = roomFullData[i].name;
        //                     textSquare.addControl(labelModel);

        //                     const targetModel = new Ellipse();
        //                     targetModel.width = "7px";
        //                     targetModel.height = "7px";
        //                     targetModel.color = "Orange";
        //                     targetModel.thickness = 2;
        //                     targetModel.background = "green";
        //                     modelTexture.addControl(targetModel);
        //                     //@ts-ignore
        //                     targetModel.linkWithMesh(roomFullData[40]);
        //                     // targetModel.linkWithMesh(roomFullData[i]);

        //                     const lineModel = new Line();
        //                     lineModel.lineWidth = 4;
        //                     lineModel.color = "Orange";
        //                     lineModel.y2 = 10;
        //                     lineModel.linkOffsetY = -3;
        //                     modelTexture.addControl(lineModel);
        //                     //@ts-ignore
        //                     lineModel.linkWithMesh(roomFullData[40]);
        //                     // lineModel.linkWithMesh(roomFullData[i]);
        //                     lineModel.connectedControl = textSquare;
        //                 } else {
        //                     console.log('triggerComponent off');
        //                 }
        //             });
        //             let squeezeComponent = motionController.getComponent(xr_ids[1]);//xr-standard-squeeze
        //             squeezeComponent.onButtonStateChangedObservable.add(() => {
        //                 if (squeezeComponent.pressed) {
        //                     console.log('squeezeComponent');
        //                 } else {
        //                     console.log('squeezeComponent');
        //                 }
        //             });
        //             let thumbstickComponent = motionController.getComponent(xr_ids[2]);//xr-standard-thumbstick
        //             thumbstickComponent.onButtonStateChangedObservable.add(() => {
        //                 if (thumbstickComponent.pressed) {
        //                     console.log('thumbstickComponent');
        //                 } else {
        //                     console.log('thumbstickComponent');
        //                 }

        //             });

        //             let abuttonComponent = motionController.getComponent(xr_ids[3]);//a-button
        //             abuttonComponent.onButtonStateChangedObservable.add(() => {
        //                 if (abuttonComponent.pressed) {
        //                     console.log('abuttonComponent');
        //                 } else {
        //                     console.log('abuttonComponent');
        //                 }
        //             });
        //             let bbuttonComponent = motionController.getComponent(xr_ids[4]);//b-button
        //             bbuttonComponent.onButtonStateChangedObservable.add(() => {
        //                 if (bbuttonComponent.pressed) {
        //                     console.log('bbuttonComponent');

        //                 } else {
        //                     console.log('bbuttonComponent');
        //                 }
        //             });
        //         }
        //     })
        // });
        //roteate lamp
        //@ts-ignore
        const lamp = m[0]._children[10];
        lamp.rotationQuaternion = undefined;

        scene.beforeRender = () => {
            lamp.rotation.y += 0.01;
        };
    }
);
