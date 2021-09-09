import {
    AbstractMesh,
    ActionManager,
    ExecuteCodeAction,
    Scene,
    WebXRDefaultExperience
} from "@babylonjs/core"

import {
    AdvancedDynamicTexture,
    Ellipse,
    Line,
    Rectangle,
    TextBlock
} from '@babylonjs/gui'

export const roomModelLabelOnClick = (roomMeshDatas: AbstractMesh[], scene: Scene, modelTexture: AdvancedDynamicTexture) => {
    roomMeshDatas.forEach((roomMeshData, index) => {
        roomMeshData.actionManager = new ActionManager(scene)
        roomMeshData?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
            console.log(roomMeshData.name)
            if (roomMeshData) {
                modelLabel(roomMeshData, index, modelTexture)
            }
        }))
        avoidModelsCollisions(roomMeshData)
    })
}

const collisionMeshes = () => {
    return ['windowGlass', 'featureWall', 'Walls']
}

const avoidModelsCollisions = (model: AbstractMesh) => {
    if (collisionMeshes().includes(model.name)) {
        model.checkCollisions = true
    }
}

export const roomModelLabelOnClickXr = (roomMeshDatas: AbstractMesh[], scene: Scene, xr: WebXRDefaultExperience, modelTexture: AdvancedDynamicTexture) => {
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
                        if (roomMeshDatas) {
                            createModelLabel(roomMeshDatas, scene, modelTexture)
                        }
                    }
                })
            }
        })
    })
}

const createModelLabel = (roomMeshDatas: AbstractMesh[], scene: Scene, modelTexture: AdvancedDynamicTexture) => {
    // roomMeshDatas.forEach(roomMeshData => {
    roomMeshDatas.forEach((roomMeshData, index) => {
        roomMeshData.actionManager = new ActionManager(scene)
        roomMeshData?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
            console.log(roomMeshData.name)
            modelLabel(roomMeshData, index, modelTexture)
        }))
    })
}

const modelLabel = (model: AbstractMesh, index: number, modelTexture: AdvancedDynamicTexture) => {
    console.log(model, 'model')
    labelTextSquare(model, index, modelTexture)
    labelTargetModel(model, modelTexture)
    labelLineModel(model, modelTexture)
}

const textSquare = new Rectangle()
const labelModel = new TextBlock()
const labelTextSquare = (model: AbstractMesh, index: number, modelTexture: AdvancedDynamicTexture) => {
    modelTexture.idealWidth = 600
    textSquare.width = 0.17
    textSquare.height = "20px"
    textSquare.cornerRadius = 20
    textSquare.color = "black"
    textSquare.thickness = 4
    textSquare.background = "silver"
    modelTexture.addControl(textSquare)
    textSquare.linkWithMesh(model)
    textSquare.linkOffsetY = -50
    if (model) {
        labelModel.text = model?.name + " " + index
    }
    textSquare.addControl(labelModel)
}

const targetModel = new Ellipse()
const labelTargetModel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    targetModel.width = "7px"
    targetModel.height = "7px"
    targetModel.color = "black"
    targetModel.thickness = 2
    targetModel.background = "silver"
    modelTexture.addControl(targetModel)
    if (model) {
        targetModel.linkWithMesh(model)
    }
}

const lineModel = new Line()
const labelLineModel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture) => {
    lineModel.lineWidth = 4
    lineModel.color = "black"
    lineModel.y2 = 10
    lineModel.linkOffsetY = -3
    modelTexture.addControl(lineModel)
    if (model) {
        lineModel.linkWithMesh(model)
    }
    lineModel.connectedControl = textSquare
}