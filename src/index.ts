import {
    Engine,
    Scene,
    SceneLoader, SimplificationType, FreeCamera, Vector3
} from "@babylonjs/core"
import {
    AdvancedDynamicTexture
} from '@babylonjs/gui'

import { cameraSettings, setupCameraForCollisions } from "./sceneSettings/camera"
import { groundSettings } from "./sceneSettings/ground"
import { lightSettings } from "./sceneSettings/light"
import { roomModelLabelOnClick, roomModelLabelOnClickXr } from "./sceneSettings/modelLabel"
import { hideObjectByDistance } from "./sceneSettings/hideObjectByDistance"

import "@babylonjs/loaders/glTF/2.0/glTFLoader"

const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement
const engine = new Engine(canvas, true, undefined, true)
const scene = new Scene(engine)
const camera = new FreeCamera("FreeCamera", new Vector3(0, 2, -5), scene);

// cameraSettings(scene, canvas)
// lightSettings(scene)
// groundSettings(scene)

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
//     "https://www.babylonjs.com/scenes/espilit/",
//     "espilit.incremental.babylon",
//     scene,
//     function (mesh) {
//         console.log(mesh, 'mesh')
//         const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
//         //@ts-ignore
//         scene.activeCamera.attachControl(canvas, true);
//         roomModelLabelOnClick(mesh, scene, modelTexture)

//         // roomModelLabelOnClickXr(mesh, scene, xr, modelTexture)
//         // hideObjectByDistance(mesh)
//         //LOD simplyfy
//         //@ts-ignore
//         // mesh[40].optimizeIndices(function() {
//         //     //@ts-ignore
// 		// 	mesh[40].simplify([{distance:1, quality:0.9}, {distance:10, quality: 0.1}], false, SimplificationType.QUADRATIC, function() {
// 		// 	console.log("simplification finished");
// 		//  });
// 		// })
//     }
// )

SceneLoader.Append("https://www.babylonjs.com/scenes/espilit/",
    "espilit.incremental.babylon", scene, function (mesh) {
        console.log(mesh.meshes, 'mesh');
        const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
        roomModelLabelOnClick(mesh.meshes, scene, modelTexture)
        //@ts-ignore
        scene.activeCamera.attachControl(canvas, true);
        //LOD simplyfy
        //@ts-ignore
        mesh.meshes[27].optimizeIndices(function () {
            //@ts-ignore
            mesh.meshes[27].simplify([{ distance: 1, quality: 0.9 }, { distance: 10, quality: 0.1 }], false, SimplificationType.QUADRATIC, function () {
                console.log("simplification finished");
            });
        });
        hideObjectByDistance(mesh.meshes)
    });
