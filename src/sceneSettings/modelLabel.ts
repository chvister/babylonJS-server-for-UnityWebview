import {
    Scene,
    AbstractMesh,
    ActionManager,
    ExecuteCodeAction,
    WebXRDefaultExperience
} from "@babylonjs/core"

import {
    AdvancedDynamicTexture, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'

export const modelLabelOnClick = (mesh: AbstractMesh[], scene: Scene, modelTexture: AdvancedDynamicTexture) => {
    const roomFullData = mesh
    for (let i = 0; i < roomFullData.length; i++) {
        roomFullData[i].actionManager = new ActionManager(scene)
        roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
            console.log(roomFullData[i].name)
            modelLabel(roomFullData[i], modelTexture)
        }))

        avoidModelsCollisions(roomFullData[i])
    }
}

const avoidModelsCollisions = (mesh: AbstractMesh) => {
    if (mesh.name === 'windowGlass' || mesh.name === 'featureWall' || mesh.name === 'Walls') {
        mesh.checkCollisions = true
    }
}

export const modelLabelOnClickXr = (mesh: AbstractMesh[], scene: Scene, xr: WebXRDefaultExperience, modelTexture: AdvancedDynamicTexture) => {
    const roomFullData = mesh
    xr.input.onControllerAddedObservable.add((controller) => {
        console.log(xr.input, 'xr.input')
        controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === 'right') {
                const xr_ids = motionController.getComponentIds()
                const squeezeComponent = motionController.getComponent(xr_ids[0])
                squeezeComponent.onButtonStateChangedObservable.add(() => {
                    if (squeezeComponent.pressed) {
                        console.log('pressed')
                    } else {
                        createModelLabel(roomFullData, scene, modelTexture)
                    }
                })
                //TODO other controller button events
                // const squeezeComponent = motionController.getComponent(xr_ids[1])
                // squeezeComponent.onButtonStateChangedObservable.add(() => {
                //     if (squeezeComponent.pressed) {
                //         console.log('squeezeComponent')
                //     } else {
                //         console.log('squeezeComponent')
                //     }
                // })
                // const thumbstickComponent = motionController.getComponent(xr_ids[2])
                // thumbstickComponent.onButtonStateChangedObservable.add(() => {
                //     if (thumbstickComponent.pressed) {
                //         console.log('thumbstickComponent')
                //     } else {
                //         console.log('thumbstickComponent')
                //     }

                // })

                // const abuttonComponent = motionController.getComponent(xr_ids[3])
                // abuttonComponent.onButtonStateChangedObservable.add(() => {
                //     if (abuttonComponent.pressed) {
                //         console.log('abuttonComponent')
                //     } else {
                //         console.log('abuttonComponent')
                //     }
                // })
                // const bbuttonComponent = motionController.getComponent(xr_ids[4])
                // bbuttonComponent.onButtonStateChangedObservable.add(() => {
                //     if (bbuttonComponent.pressed) {
                //         console.log('bbuttonComponent')

                //     } else {
                //         console.log('bbuttonComponent')
                //     }
                // })
            }
        })
    })
}

const createModelLabel = (roomFullData: any, scene:any, modelTexture: any) => {
    for (let i = 0; i < roomFullData.length; i++) {
        roomFullData[i].actionManager = new ActionManager(scene)
        roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
            console.log(roomFullData[i].name)
            modelLabel(roomFullData[i], modelTexture)
        }))
    }
}


const modelLabel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    console.log(model, 'model')
    labelTextSquare(model, modelTexture)
    labelTargetModel(model, modelTexture)
    labelLineModel(model, modelTexture)
}

const textSquare = new Rectangle()
const labelModel = new TextBlock()
const labelTextSquare = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    modelTexture.idealWidth = 600
    textSquare.width = 0.14
    textSquare.height = "20px"
    textSquare.cornerRadius = 20
    textSquare.color = "Orange"
    textSquare.thickness = 4
    textSquare.background = "green"
    modelTexture.addControl(textSquare)
    textSquare.linkWithMesh(model)
    textSquare.linkOffsetY = -50
    if (model) {
        labelModel.text = model?.name
    }
    textSquare.addControl(labelModel)
}

const targetModel = new Ellipse()
const labelTargetModel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    targetModel.width = "7px"
    targetModel.height = "7px"
    targetModel.color = "Orange"
    targetModel.thickness = 2
    targetModel.background = "green"
    modelTexture.addControl(targetModel)
    targetModel.linkWithMesh(model)
}

const lineModel = new Line()
const labelLineModel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    lineModel.lineWidth = 4
    lineModel.color = "Orange"
    lineModel.y2 = 10
    lineModel.linkOffsetY = -3
    modelTexture.addControl(lineModel)
    lineModel.linkWithMesh(model)
    lineModel.connectedControl = textSquare
}