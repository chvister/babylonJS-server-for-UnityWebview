import { CreateSceneClass } from "../createScene";
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders/glTF/2.0/glTFLoader";
export class DefaultSceneWithTexture implements CreateSceneClass {

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        const camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -10), scene);

        camera.attachControl(canvas, true);
        camera.inputs.addMouseWheel();

        camera.setTarget(Vector3.Zero());

        camera.attachControl(canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        light.intensity = 0.7;

        SceneLoader.ImportMesh(
            "",
            "http://127.0.0.1:5502/",
            "scenes/interior/scene.glb",
            scene,
            function (m) {
                console.log(m);
            }
        );

        return scene;
    };
}

export default new DefaultSceneWithTexture();