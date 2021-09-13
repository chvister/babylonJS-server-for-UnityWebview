import {
    Engine,
    Scene,
    SceneLoader, FreeCamera, Vector3,Color4
} from "@babylonjs/core"
import {
    AdvancedDynamicTexture
} from '@babylonjs/gui'
//TODO remove inspector
//import { Inspector } from "@babylonjs/inspector";

import { cameraSettings, setupCameraForCollisions } from "./sceneSettings/camera"
import { groundSettings } from "./sceneSettings/ground"
import { lightSettings } from "./sceneSettings/light"
import { roomModelLabelOnClick, roomModelLabelOnClickXr } from "./sceneSettings/modelLabel"
import { hideObjectByDistance } from "./sceneSettings/hideObjectByDistance"
import { simplifyObjectByDistance } from "./sceneSettings/simplifyObjectByDistance"

import "@babylonjs/loaders/glTF/2.0/glTFLoader"

import "@babylonjs/loaders/glTF/2.0/glTFLoader"

const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement
const engine = new Engine(canvas, true, undefined, true)
const scene = new Scene(engine)
// const camera = new FreeCamera("FreeCamera", new Vector3(-11.961, 3.388, -9.275), scene);
//TODO remove inspector
//new Inspector()

const camera = cameraSettings(scene, canvas);
lightSettings(scene)
groundSettings(scene)

//@ts-ignore
window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
    scene.clearColor = new Color4(r, g, b, a);
};

//@ts-ignore
window.newCameraRotationAndPosition = (x: float,y: float,z: float,xp: float,yp: float,zp: float) => {
    camera.rotation = new Vector3(x, y, z).normalize();
    //camera.position = new Vector3(xp, yp, zp);
};


window.addEventListener("resize", () => engine.resize())
engine.runRenderLoop(() => scene.render())

// const environment = scene.createDefaultEnvironment()

//@ts-ignore TODO
// const xr = await scene.createDefaultXRExperienceAsync({
//     // xrInput: defaultXRExperience.input,  
//     // floorMeshes: [environment?.ground] /* Array of meshes to be used as landing points */
// })

// setupCameraForCollisions(xr.input.xrCamera)

// const roomModel = SceneLoader.ImportMesh(
//     "",
//     "scene/",
//     "scene1.babylon",
//     scene,
//     function (mesh) {
//         console.log(mesh, 'mesh')
//         // const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
//         // //@ts-ignore
//         // scene.activeCamera.attachControl(canvas, true);
//         // roomModelLabelOnClick(mesh, scene, modelTexture)

//         // // roomModelLabelOnClickXr(mesh, scene, xr, modelTexture)
//         // // hideObjectByDistance(mesh)
//         // //LOD simplyfy
//         // //@ts-ignore
//         // mesh[105].optimizeIndices(function() {
//         //     //@ts-ignore
// 		// 	mesh[105].simplify([{distance:1, quality:0.9}, {distance:10, quality: 0.1}], false, SimplificationType.QUADRATIC, function() {
// 		// 	console.log("simplification finished");
// 		//  });
// 		// })
//     }
// )

// SceneLoader.Append("scene/babylon-arena/",
//     "arenaBabylonMaterial.incremental.babylon",
    SceneLoader.Append("scene/",
        "arena.glb",
    scene, function (mesh) {
        console.log(mesh.meshes, 'mesh meshes');
        console.log(mesh, 'mesh');
        scene.clearColor = new Color4(0, 0, 0, 0)
        // scene.removeMesh(mesh.meshes[6])
        // scene.removeMesh(mesh.meshes[2])
        //@ts-ignore
        scene.activeCamera.attachControl(canvas, true);
        scene.executeWhenReady(function () {
            hideObjectByDistance(mesh.meshes)
            const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
            roomModelLabelOnClick(mesh.meshes, scene, modelTexture)
            // simplifyObjectByDistance(mesh.meshes)
        });
    });

//TODO remove inspector
//scene.debugLayer.show();


// import {
//     Engine,
//     Scene,
//     SceneLoader,
//     FreeCamera,
//     Vector3,
//     Color4,
//     Mesh,
// } from "@babylonjs/core";
// import { AdvancedDynamicTexture } from "@babylonjs/gui";
// //TODO remove inspector
// import { Inspector } from "@babylonjs/inspector";

// import {
//     cameraSettings,
//     setupCameraForCollisions,
// } from "./sceneSettings/camera";
// import { groundSettings } from "./sceneSettings/ground";
// import { lightSettings } from "./sceneSettings/light";
// import {
//     roomModelLabelOnClick,
//     roomModelLabelOnClickXr,
// } from "./sceneSettings/modelLabel";
// import { hideObjectByDistance } from "./sceneSettings/hideObjectByDistance";
// import { simplifyObjectByDistance } from "./sceneSettings/simplifyObjectByDistance";

// import "@babylonjs/loaders/glTF/2.0/glTFLoader";
// import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression";

// import "@babylonjs/loaders/glTF/2.0/glTFLoader";

// const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement;
// const engine = new Engine(canvas, true, undefined, true);
// const scene = new Scene(engine);
// const camera1 = new FreeCamera("FreeCamera", new Vector3(0, 0, 0), scene);

// const camera = cameraSettings(scene, canvas);
// lightSettings(scene);
// groundSettings(scene);

// //@ts-ignore
// window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
//     scene.clearColor = new Color4(r, g, b, a);
// };

// //@ts-ignore
// window.newCameraRotationAndPosition = (x: float,y: float,z: float,xp: float,yp: float,zp: float) => {
//     camera.rotation = new Vector3(x, y, z).normalize();
//     //camera.position = new Vector3(xp, yp, zp);
// };

// window.addEventListener("resize", () => engine.resize());
// engine.runRenderLoop(() => scene.render());

// //const box = Mesh.CreateBox("box", 1, scene);

// SceneLoader.Append(
//     "scene/",
//     "arena.babylon",
//     scene,
//     function (mesh) {
//         console.log(mesh.meshes, "mesh meshes");
//         console.log(mesh, "mesh");
//         //scene.clearColor = new Color4(0, 0, 0, 0)

//         const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
//         roomModelLabelOnClick(mesh.meshes, scene, modelTexture);
//         scene.removeMesh(mesh.meshes[6]);
//         scene.removeMesh(mesh.meshes[2]);
//         //@ts-ignore
//         scene.activeCamera.attachControl(canvas, true);
//         // scene.createDefaultCamera(true, true, true);
//         // setTimeout(function () {
//         //     simplifyObjectByDistance(mesh.meshes)
//         // }, 8000);
//         // hideObjectByDistance(mesh.meshes)
//     }
// );

// // SceneLoader.Append("scene/",
// // "arena.babylon",

// //     scene, function (mesh) {
// //         console.log(mesh.meshes, 'mesh meshes');
// //         console.log(mesh, 'mesh');
// //         //scene.clearColor = new Color4(0, 0, 0, 0)
// //         // //@ts-ignore
// //         // window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
// //         //     scene.clearColor = new Color4(r, g, b, a)
// //         // }

// //         const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
// //         roomModelLabelOnClick(mesh.meshes, scene, modelTexture)
// //         scene.removeMesh(mesh.meshes[6])
// //         scene.removeMesh(mesh.meshes[2])
// //         //@ts-ignore
// //         scene.activeCamera.attachControl(canvas, true);
// //         // scene.createDefaultCamera(true, true, true);
// //         // setTimeout(function () {
// //         //     simplifyObjectByDistance(mesh.meshes)
// //         // }, 8000);
// //         // hideObjectByDistance(mesh.meshes)
// //     });
