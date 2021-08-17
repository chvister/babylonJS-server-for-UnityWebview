import {
    Scene,
    AbstractMesh,
    ActionManager,
    ExecuteCodeAction,
    WebXRDefaultExperience
} from "@babylonjs/core";

import {
    AdvancedDynamicTexture, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'

export const modelLabelOnClick = (mesh: AbstractMesh[], scene: Scene, modelTexture: AdvancedDynamicTexture) => {
    const roomFullData = mesh

    for (let i = 0; i < roomFullData.length; i++) {
        roomFullData[i].actionManager = new ActionManager(scene);
        roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
            console.log(roomFullData[i].name);
            modelLabel(roomFullData[i], modelTexture)
        }));

        if (roomFullData[i].name === 'windowGlass' || roomFullData[i].name === 'featureWall' || roomFullData[i].name === 'Walls') {
            roomFullData[i].checkCollisions = true;
        }
    }
}

// export const roomData = (mesh: any, scene: any) => {
//     const roomFullData = mesh
//     const actualModel = { model: undefined }
//     for (let i = 0; i < roomFullData.length; i++) {
//         roomFullData[i].actionManager = new ActionManager(scene);
//         roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function () {
//             // roomFullData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
//             console.log(roomFullData[i].name);
//             // actualModelClick = roomFullData[i]
//             // console.log(roomFullData[i]);
//             // return roomFullData[i]
//             // return "a"
//             actualModel.model = roomFullData[i]
//         }));
//         return actualModel.model
//     }
// }

const textSquare = new Rectangle();
const labelModel = new TextBlock();
const targetModel = new Ellipse();
const lineModel = new Line();

export const modelLabel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    console.log(model, 'model');
    labelTextSquare(model, modelTexture)
    labelTargetModel(model, modelTexture)
    labelLineModel(model, modelTexture)
}

const labelTextSquare = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    modelTexture.idealWidth = 600;
    textSquare.width = 0.14;
    textSquare.height = "20px";
    textSquare.cornerRadius = 20;
    textSquare.color = "Orange";
    textSquare.thickness = 4;
    textSquare.background = "green";
    modelTexture.addControl(textSquare);
    textSquare.linkWithMesh(model);
    textSquare.linkOffsetY = -50;
    if (model) {
        labelModel.text = model?.name;
    }
    textSquare.addControl(labelModel);
}

const labelTargetModel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    targetModel.width = "7px";
    targetModel.height = "7px";
    targetModel.color = "Orange";
    targetModel.thickness = 2;
    targetModel.background = "green";
    modelTexture.addControl(targetModel);
    targetModel.linkWithMesh(model);
}

const labelLineModel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    lineModel.lineWidth = 4;
    lineModel.color = "Orange";
    lineModel.y2 = 10;
    lineModel.linkOffsetY = -3;
    modelTexture.addControl(lineModel);
    lineModel.linkWithMesh(model);
    lineModel.connectedControl = textSquare;
}

export const modelLabelOnClickXr = (mesh: AbstractMesh[], scene: Scene, xr: WebXRDefaultExperience, modelTexture: AdvancedDynamicTexture) => {
    const roomFullData = mesh
    xr.input.onControllerAddedObservable.add((controller) => {
        console.log(xr.input, 'xr.input');
        controller.onMotionControllerInitObservable.add((motionController) => {
            console.log(motionController, 'motionController');
            console.log(controller, 'controller');

            if (motionController.handness === 'right') {
                const xr_ids = motionController.getComponentIds();
                console.log(xr_ids, 'xr_ids');
                let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                triggerComponent.onButtonStateChangedObservable.add(() => {
                    if (triggerComponent.pressed) {
                        console.log('pressed');
                    } else {
                        for (let i = 0; i < roomFullData.length; i++) {
                            roomFullData[i].actionManager = new ActionManager(scene);
                            roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                                console.log(roomFullData[i].name);
                                modelLabel(roomFullData[i], modelTexture)
                            }));
                        }
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
}