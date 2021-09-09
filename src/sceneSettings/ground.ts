import {
    Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3
} from "@babylonjs/core";

export const groundSettings = (scene: Scene) => {
    const ground = Mesh.CreatePlane("ground", 200.0, scene);
    const material = new StandardMaterial("groundMat", scene)
    // const box = MeshBuilder.CreateBox("box", { height: 1, width: 1, depth: 1 }, scene)
    ground.material = material
    material.diffuseColor = new Color3(1, 1, 1);
    material.backFaceCulling = false;
    ground.position = new Vector3(0, -1, 0);
    ground.rotation = new Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;

    scene.gravity = new Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
}