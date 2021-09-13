import {
    Engine,
    Scene,
    SceneLoader,
    FreeCamera,
    Vector3,
    Color4,
    Color3,
    Mesh,
    StandardMaterial,
    MeshBuilder,
    Quaternion,
} from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
//TODO remove inspector
import { Inspector } from "@babylonjs/inspector";

import {
    cameraSettings,
    setupCameraForCollisions,
} from "./sceneSettings/camera";
import { groundSettings } from "./sceneSettings/ground";
import { lightSettings } from "./sceneSettings/light";
import {
    roomModelLabelOnClick,
    roomModelLabelOnClickXr,
} from "./sceneSettings/modelLabel";
import { hideObjectByDistance } from "./sceneSettings/hideObjectByDistance";
import { simplifyObjectByDistance } from "./sceneSettings/simplifyObjectByDistance";

import "@babylonjs/loaders/glTF/2.0/glTFLoader";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression";

import "@babylonjs/loaders/glTF/2.0/glTFLoader";
import { DeviceOrientationCamera } from "@babylonjs/core";
const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, undefined, true);
const scene = new Scene(engine);
const camera = new DeviceOrientationCamera(
    "DevOr_camera",
    new Vector3(0, 0, 0),
    scene
);
// This targets the camera to scene origin
camera.setTarget(new Vector3(0, 0, -10));
// This attaches the camera to the canvas
camera.attachControl(canvas, true);

//const camera = cameraSettings(scene, canvas);
lightSettings(scene);
groundSettings(scene);

//@ts-ignore
window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
    scene.clearColor = new Color4(r, g, b, a);
};

//@ts-ignore
window.newCameraRotation = (x: float, y: float, z: float, w: float) => {
    camera.rotationQuaternion = new Quaternion(x, y, z, w);
    console.log(camera.rotationQuaternion);
};

//@ts-ignore
window.newCameraPosition = (x: float, y: float, z: float) => {
    camera.position = new Vector3(z, y, -x);
    console.log(camera.position);
};

window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => scene.render());


//boxes
var material = new StandardMaterial("color", scene);
material.alpha = 1;
material.diffuseColor = new Color3(1.0, 0.2, 0.7);

var redMat = new StandardMaterial("red", scene);
redMat.diffuseColor = new Color3(1, 0.1, 0.1);
redMat.emissiveColor = new Color3(1, 0.1, 0.1);
redMat.specularColor = new Color3(1, 0.1, 0.1);

var greenMat = new StandardMaterial("green", scene);
greenMat.diffuseColor = new Color3(0, 255, 0);
greenMat.emissiveColor = new Color3(0, 255, 0);
greenMat.specularColor = new Color3(0, 255, 0);

var blueMat = new StandardMaterial("blue", scene);
blueMat.diffuseColor = new Color3(0, 0, 255);
blueMat.emissiveColor = new Color3(0, 0, 255);
blueMat.specularColor = new Color3(0, 0, 255);

var yellowMat = new StandardMaterial("yellow", scene);
yellowMat.diffuseColor = new Color3(255, 255, 0);
yellowMat.emissiveColor = new Color3(255, 255, 0);
yellowMat.specularColor = new Color3(255, 255, 0);

var orangeMat = new StandardMaterial("orange", scene);
orangeMat.diffuseColor = new Color3(1, 0.48, 0);
orangeMat.emissiveColor = new Color3(1, 0.48, 0);
orangeMat.specularColor = new Color3(1, 0.48, 0);

var purpleMat = new StandardMaterial("purple", scene);
purpleMat.diffuseColor = new Color3(255, 0, 255);
purpleMat.emissiveColor = new Color3(255, 0, 255);
purpleMat.specularColor = new Color3(255, 0, 255);

var box2 = MeshBuilder.CreateBox("box2", { size: 1 }, scene);
box2.position = new Vector3(0, 0, -2.5);
box2.material = greenMat;

var box3 = MeshBuilder.CreateBox("box3", { size: 1 }, scene);
box3.position = new Vector3(2.5, 0, 0);
box3.material = blueMat;

var box4 = MeshBuilder.CreateBox("box4", { size: 1 }, scene);
box4.position = new Vector3(-2.5, 0, 0);
box4.material = yellowMat;

var box5 = MeshBuilder.CreateBox("box5", { size: 1 }, scene);
box5.position = new Vector3(0, 0, 2.5);
box5.material = orangeMat;

var box6 = MeshBuilder.CreateBox("box6", { size: 1 }, scene);
box6.position = new Vector3(0, 2.5, 0);
box6.material = purpleMat;

scene.clearColor = new Color4(0, 0, 0, 0);

//    SceneLoader.Append("scene/",
//         "BoomBox.glb",
//          scene, function (mesh) {
//         console.log(mesh.meshes, 'mesh meshes');
//         console.log(mesh, 'mesh');
//         scene.clearColor = new Color4(0, 0, 0, 0)
//         // scene.removeMesh(mesh.meshes[6])
//         // scene.removeMesh(mesh.meshes[2])

//         //@ts-ignore
//         scene.activeCamera.attachControl(canvas, true);
//         scene.executeWhenReady(function () {
//             hideObjectByDistance(mesh.meshes)
//             const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
//             roomModelLabelOnClick(mesh.meshes, scene, modelTexture)
//             // simplifyObjectByDistance(mesh.meshes)
//         });
//     });

// SceneLoader.Append("scene/",
// "arena.babylon",

//     scene, function (mesh) {
//         console.log(mesh.meshes, 'mesh meshes');
//         console.log(mesh, 'mesh');
//         //scene.clearColor = new Color4(0, 0, 0, 0)
//         // //@ts-ignore
//         // window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
//         //     scene.clearColor = new Color4(r, g, b, a)
//         // }

//         const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
//         roomModelLabelOnClick(mesh.meshes, scene, modelTexture)
//         scene.removeMesh(mesh.meshes[6])
//         scene.removeMesh(mesh.meshes[2])
//         //@ts-ignore
//         scene.activeCamera.attachControl(canvas, true);
//         // scene.createDefaultCamera(true, true, true);
//         // setTimeout(function () {
//         //     simplifyObjectByDistance(mesh.meshes)
//         // }, 8000);
//         // hideObjectByDistance(mesh.meshes)
//     });
