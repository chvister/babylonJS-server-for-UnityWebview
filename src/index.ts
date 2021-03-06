import {
    Engine,
    Scene,
    SceneLoader, FreeCamera, Vector3,Color4,DeviceOrientationCamera
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
//const camera = new DeviceOrientationCamera("DevOr_camera", new Vector3(0, 0, 0), scene);


const camera = cameraSettings(scene, canvas)
lightSettings(scene)
groundSettings(scene)
//@ts-ignore
window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
    scene.clearColor = new Color4(r, g, b, a);
    console.log(camera)
    camera.position = new Vector3(10,200,10);
    
}


window.addEventListener("resize", () => engine.resize())
engine.runRenderLoop(() => scene.render())



// SceneLoader.Append("scene/babylon-arena/",
// "arena-babylon.incremental.babylon",

//     scene, function (mesh) {
//         console.log(mesh.meshes, 'mesh meshes');
//         console.log(mesh, 'mesh');
//         //scene.clearColor = new Color4(0, 0, 0, 0)
//         //@ts-ignore
//         window.newBackgroundColor = (r: float, g: float, b: float, a: float) => {
//             scene.clearColor = new Color4(r, g, b, a)
//         }

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
