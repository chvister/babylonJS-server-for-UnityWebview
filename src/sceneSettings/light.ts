import {
    HemisphericLight, Scene, Vector3
} from "@babylonjs/core";

export const lightSettings = (scene: Scene) => {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
}