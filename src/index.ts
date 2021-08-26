import {
    Engine,
    Scene,
    SceneLoader
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

cameraSettings(scene, canvas)
lightSettings(scene)
groundSettings(scene)

window.addEventListener("resize", () => engine.resize())
engine.runRenderLoop(() => scene.render())

const environment = scene.createDefaultEnvironment()

//@ts-ignore TODO
const xr = await scene.createDefaultXRExperienceAsync({
    // xrInput: defaultXRExperience.input,  
    // floorMeshes: [environment?.ground] /* Array of meshes to be used as landing points */
})

setupCameraForCollisions(xr.input.xrCamera)

const roomModel = SceneLoader.ImportMesh(
    "",
    "scene/",
    "scene.glb",
    scene,
    function (mesh) {
        console.log(mesh, 'mesh')
        const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI")
        roomModelLabelOnClick(mesh, scene, modelTexture)
        roomModelLabelOnClickXr(mesh, scene, xr, modelTexture)
        hideObjectByDistance(mesh)
    }
)
