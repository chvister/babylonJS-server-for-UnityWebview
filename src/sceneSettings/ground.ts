import {
    Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3
} from "@babylonjs/core";

export const groundSettings = (scene: Scene) => {
    const ground = Mesh.CreatePlane("ground", 4.36, scene);
    const material = new StandardMaterial("groundMat", scene)
    ground.material = material
    
    material.diffuseColor = new Color3(1, 1, 1);
    material.backFaceCulling = false;
    ground.position = new Vector3(0, -0.73, 0);
    ground.rotation = new Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;

    scene.gravity = new Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
}