import {
    Engine,
    Scene,
    SceneLoader, FreeCamera, Vector3
} from "@babylonjs/core"
import {
    AdvancedDynamicTexture
} from '@babylonjs/gui'
//TODO remove inspector
import { Inspector } from "@babylonjs/inspector";

import { cameraSettings, setupCameraForCollisions } from "./sceneSettings/camera"
import { groundSettings } from "./sceneSettings/ground"
import { lightSettings } from "./sceneSettings/light"
import { roomModelLabelOnClick, roomModelLabelOnClickXr } from "./sceneSettings/modelLabel"
import { hideObjectByDistance } from "./sceneSettings/hideObjectByDistance"
import { simplifyObjectByDistance } from "./sceneSettings/simplifyObjectByDistance"

import "@babylonjs/loaders/glTF/2.0/glTFLoader"
import '@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression';

import "@babylonjs/loaders/glTF/2.0/glTFLoader"

const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement
const engine = new Engine(canvas, true, undefined, true)
const scene = new Scene(engine)
// const camera = new FreeCamera("FreeCamera", new Vector3(-11.961, 3.388, -9.275), scene);
//TODO remove inspector
new Inspector()

cameraSettings(scene, canvas)
lightSettings(scene)
groundSettings(scene)

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

// SceneLoader.Append("https://www.babylonjs.com/scenes/espilit/",
//         "espilit.incremental.babylon", scene, function (mesh) {
SceneLoader.Append("scene/babylon-arena/",
    "arena-babylon.incremental.babylon",
    scene, function (mesh) {
        console.log(mesh.meshes, 'mesh meshes');
        console.log(mesh, 'mesh');
        const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
        roomModelLabelOnClick(mesh.meshes, scene, modelTexture)
        //@ts-ignore
        scene.activeCamera.attachControl(canvas, true);
        // setTimeout(function () {
        //     simplifyObjectByDistance(mesh.meshes)
        // }, 8000);
        // hideObjectByDistance(mesh.meshes)
    });
//TODO remove inspector
// scene.debugLayer.show();