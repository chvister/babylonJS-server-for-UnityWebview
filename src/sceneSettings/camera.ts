import {
    FreeCamera,
    Vector3,
    Scene
} from "@babylonjs/core";

export const cameraSettings = (scene: Scene, canvas: HTMLCanvasElement) => {
    const camera = new FreeCamera("FreeCamera", new Vector3(7, 10, 7), scene);

    // const camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -5), scene);
//const camera = new FreeCamera("FreeCamera", new Vector3(5.610587520283774, 1.0099999, 1.0099999), scene);
    camera.speed = 0.7
    camera.attachControl(canvas, true);
    camera.inputs.addMouseWheel();
    scene?.activeCamera?.attachControl(canvas, true);
    setupCameraForCollisions(camera);

    return camera;
}

export const setupCameraForCollisions = (camera: FreeCamera) => {
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new Vector3(1.5, 1, 1.5);
}