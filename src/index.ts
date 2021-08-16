import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    SceneLoader,
    StandardMaterial,
    Color3,
    ActionManager,
    ExecuteCodeAction
} from "@babylonjs/core";
import {
    AdvancedDynamicTexture, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'

import "@babylonjs/loaders/glTF/2.0/glTFLoader";

const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, undefined, true);
const scene = new Scene(engine);

function setupCameraForCollisions(camera: FreeCamera) {
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new Vector3(1.5, 3, 1.5);
}

const camera = new FreeCamera("FreeCamera", new Vector3(0, 5, -5), scene);
camera.speed = 0.7

camera.attachControl(canvas, true);
camera.inputs.addMouseWheel();
setupCameraForCollisions(camera);

scene?.activeCamera?.attachControl(canvas, true);

const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

const ground = Mesh.CreatePlane("ground", 200.0, scene);
const material = new StandardMaterial("groundMat", scene)
ground.material = material
material.diffuseColor = new Color3(1, 1, 1);
material.backFaceCulling = false;
ground.position = new Vector3(0, 0, 0);
ground.rotation = new Vector3(Math.PI / 2, 0, 0);
ground.checkCollisions = true;

scene.gravity = new Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;

window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => scene.render());

//add xr
const env = scene.createDefaultEnvironment();

//@ts-ignore TODO
const xr = await scene.createDefaultXRExperienceAsync({
    // xrInput: defaultXRExperience.input,  
    // floorMeshes: [environment?.ground] /* Array of meshes to be used as landing points */
});

setupCameraForCollisions(xr.input.xrCamera);

const roomModel = SceneLoader.ImportMesh(
    "",
    "scene/",
    "scene.glb",
    scene,
    function (m) {
        console.log(m);
        console.log(m, 'm');

        const roomFullData = m
        const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textSquare = new Rectangle();
        const labelModel = new TextBlock();
        const targetModel = new Ellipse();
        const lineModel = new Line();
        let actualModelClick: any
        //do for cyklu staci poslat funkciu a vrati premennu nemusi byt vsetko vo for
        for (let i = 0; i < roomFullData.length; i++) {
            console.log(roomFullData[i].name + i);

            roomFullData[i].actionManager = new ActionManager(scene);
            roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
                // roomFullData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                console.log(roomFullData[i].name);
                modelTexture.idealWidth = 600;
                textSquare.width = 0.14;
                textSquare.height = "20px";
                textSquare.cornerRadius = 20;
                textSquare.color = "Orange";
                textSquare.thickness = 4;
                textSquare.background = "green";
                modelTexture.addControl(textSquare);
                textSquare.linkWithMesh(roomFullData[i]);
                textSquare.linkOffsetY = -50;

                labelModel.text = roomFullData[i].name;
                textSquare.addControl(labelModel);

                targetModel.width = "7px";
                targetModel.height = "7px";
                targetModel.color = "Orange";
                targetModel.thickness = 2;
                targetModel.background = "green";
                modelTexture.addControl(targetModel);
                targetModel.linkWithMesh(roomFullData[i]);

                lineModel.lineWidth = 4;
                lineModel.color = "Orange";
                lineModel.y2 = 10;
                lineModel.linkOffsetY = -3;
                modelTexture.addControl(lineModel);
                lineModel.linkWithMesh(roomFullData[i]);
                lineModel.connectedControl = textSquare;
            }));

            if (roomFullData[i].name === 'windowGlass' || roomFullData[i].name === 'featureWall' || roomFullData[i].name === 'Walls') {
                roomFullData[i].checkCollisions = true;
            }
            //on hold ?
            roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function () {
                // roomFullData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                console.log(roomFullData[i].name);
                actualModelClick = roomFullData[i]
                console.log(roomFullData[i]);
            }));
        }

        //controller input
        xr.input.onControllerAddedObservable.add((controller) => {
            console.log(xr.input, 'xr.input');
            controller.onMotionControllerInitObservable.add((motionController) => {
                console.log(motionController, 'motionController');
                console.log(controller, 'controller');

                if (motionController.handness === 'right') {
                    const xr_ids = motionController.getComponentIds();
                    console.log(xr_ids, 'xr_ids');
                    console.log(xr_ids, 'xr_ids');
                    let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                    triggerComponent.onButtonStateChangedObservable.add(() => {
                        if (triggerComponent.pressed) {
                            // for (let i = 0; i < roomFullData.length; i++) {

                        } else {
                            console.log(actualModelClick);
                            console.log('off');
                            modelTexture.idealWidth = 600;
                            textSquare.width = 0.14;
                            textSquare.height = "20px";
                            textSquare.cornerRadius = 20;
                            textSquare.color = "Orange";
                            textSquare.thickness = 4;
                            textSquare.background = "green";
                            modelTexture.addControl(textSquare);
                            textSquare.linkWithMesh(actualModelClick);
                            textSquare.linkOffsetY = -50;

                            if (actualModelClick) {
                                labelModel.text = actualModelClick.name;
                            }
                            textSquare.addControl(labelModel);

                            targetModel.width = "7px";
                            targetModel.height = "7px";
                            targetModel.color = "Orange";
                            targetModel.thickness = 2;
                            targetModel.background = "green";
                            modelTexture.addControl(targetModel);
                            targetModel.linkWithMesh(actualModelClick);

                            lineModel.lineWidth = 4;
                            lineModel.color = "Orange";
                            lineModel.y2 = 10;
                            lineModel.linkOffsetY = -3;
                            modelTexture.addControl(lineModel);
                            lineModel.linkWithMesh(actualModelClick);
                            lineModel.connectedControl = textSquare;
                        }
                    });
                    let squeezeComponent = motionController.getComponent(xr_ids[1]);//xr-standard-squeeze
                    squeezeComponent.onButtonStateChangedObservable.add(() => {
                        if (squeezeComponent.pressed) {
                            console.log('squeezeComponent');
                        } else {
                            console.log('squeezeComponent');
                        }
                    });
                    let thumbstickComponent = motionController.getComponent(xr_ids[2]);//xr-standard-thumbstick
                    thumbstickComponent.onButtonStateChangedObservable.add(() => {
                        if (thumbstickComponent.pressed) {
                            console.log('thumbstickComponent');
                        } else {
                            console.log('thumbstickComponent');
                        }

                    });

                    let abuttonComponent = motionController.getComponent(xr_ids[3]);//a-button
                    abuttonComponent.onButtonStateChangedObservable.add(() => {
                        if (abuttonComponent.pressed) {
                            console.log('abuttonComponent');
                        } else {
                            console.log('abuttonComponent');
                        }
                    });
                    let bbuttonComponent = motionController.getComponent(xr_ids[4]);//b-button
                    bbuttonComponent.onButtonStateChangedObservable.add(() => {
                        if (bbuttonComponent.pressed) {
                            console.log('bbuttonComponent');

                        } else {
                            console.log('bbuttonComponent');
                        }
                    });
                }
            })
        });
        //TODO remove rotate lamp
        const lamp = m[38];
        lamp.rotationQuaternion = null;

        scene.beforeRender = () => {
            lamp.rotation.y += 0.01;
        };
    }
);
