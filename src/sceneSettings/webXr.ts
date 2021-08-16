import {
    HemisphericLight, Scene, Vector3
} from "@babylonjs/core";

import { setupCameraForCollisions } from "./camera"

//@ts-ignore TODO
const xr = await scene.createDefaultXRExperienceAsync({
    // xrInput: defaultXRExperience.input,  
    // floorMeshes: [environment?.ground] /* Array of meshes to be used as landing points */
});