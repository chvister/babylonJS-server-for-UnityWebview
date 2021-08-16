import {
    Engine,
    Scene,
    SceneLoader,
    ActionManager,
    ExecuteCodeAction
} from "@babylonjs/core";
import {
    AdvancedDynamicTexture, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'

import { cameraSettings, setupCameraForCollisions } from "./sceneSettings/camera"
import { groundSettings } from "./sceneSettings/ground"
import { lightSettings } from "./sceneSettings/light"
import { modelLabelOnClick } from "./sceneSettings/modelLabel"

import "@babylonjs/loaders/glTF/2.0/glTFLoader";

const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, undefined, true);
const scene = new Scene(engine);

cameraSettings(scene, canvas)
lightSettings(scene)
groundSettings(scene)

window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => scene.render());

//add xr
const env = scene.createDefaultEnvironment();

//@ts-ignore TODO
const xr = await scene.createDefaultXRExperienceAsync({
    // xrInput: defaultXRExperience.input,  
    // floorMeshes: [environment?.ground] /* Array of meshes to be used as landing points */
});

setupCameraForCollisions(xr.input.xrCamera);

const roomModel = SceneLoader.ImportMesh(
    "",
    "scene/",
    "scene.glb",
    scene,
    function (mesh) {
        console.log(mesh);
        console.log(mesh, 'mesh');

        const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
        modelLabelOnClick(mesh, scene, modelTexture);

        //controller input
        // xr.input.onControllerAddedObservable.add((controller) => {
        //     console.log(xr.input, 'xr.input');
        //     controller.onMotionControllerInitObservable.add((motionController) => {
        //         console.log(motionController, 'motionController');
        //         console.log(controller, 'controller');

        //         if (motionController.handness === 'right') {
        //             const xr_ids = motionController.getComponentIds();
        //             console.log(xr_ids, 'xr_ids');
        //             console.log(xr_ids, 'xr_ids');
        //             let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
        //             triggerComponent.onButtonStateChangedObservable.add(() => {
        //                 if (triggerComponent.pressed) {
        //                     // for (let i = 0; i < roomFullData.length; i++) {

        //                 } else {
        //                     console.log(actualModelClick);
        //                     console.log('off');
        //                     modelTexture.idealWidth = 600;
        //                     textSquare.width = 0.14;
        //                     textSquare.height = "20px";
        //                     textSquare.cornerRadius = 20;
        //                     textSquare.color = "Orange";
        //                     textSquare.thickness = 4;
        //                     textSquare.background = "green";
        //                     modelTexture.addControl(textSquare);
        //                     textSquare.linkWithMesh(actualModelClick);
        //                     textSquare.linkOffsetY = -50;

        //                     if (actualModelClick) {
        //                         labelModel.text = actualModelClick.name;
        //                     }
        //                     textSquare.addControl(labelModel);

        //                     targetModel.width = "7px";
        //                     targetModel.height = "7px";
        //                     targetModel.color = "Orange";
        //                     targetModel.thickness = 2;
        //                     targetModel.background = "green";
        //                     modelTexture.addControl(targetModel);
        //                     targetModel.linkWithMesh(actualModelClick);

        //                     lineModel.lineWidth = 4;
        //                     lineModel.color = "Orange";
        //                     lineModel.y2 = 10;
        //                     lineModel.linkOffsetY = -3;
        //                     modelTexture.addControl(lineModel);
        //                     lineModel.linkWithMesh(actualModelClick);
        //                     lineModel.connectedControl = textSquare;
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
        //TODO remove rotate lamp
        const lamp = mesh[38];
        lamp.rotationQuaternion = null;

        scene.beforeRender = () => {
            lamp.rotation.y += 0.01;
        };
    }
);
