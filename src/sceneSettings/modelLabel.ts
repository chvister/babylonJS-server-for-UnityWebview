import {
    Engine,
    Scene,
    SceneLoader,
    ActionManager,
    ExecuteCodeAction
} from "@babylonjs/core";

import {
    AdvancedDynamicTexture, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'


// const modelTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
const textSquare = new Rectangle();
const labelModel = new TextBlock();
const targetModel = new Ellipse();
const lineModel = new Line();

export const modelLabelOnClick = (mesh: any, scene: any, modelTexture: any) => {
    const roomFullData = mesh
    let actualModelClick: any
    //do for cyklu staci poslat funkciu a vrati premennu nemusi byt vsetko vo for

    for (let i = 0; i < roomFullData.length; i++) {

        roomFullData[i].actionManager = new ActionManager(scene);
        roomFullData[i]?.actionManager?.registerAction(new ExecuteCodeAction(ActionManager.OnDoublePickTrigger, function () {
            // roomFullData[i].actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
            console.log(roomFullData[i].name);
            modelLabel(roomFullData[i], modelTexture)
            // modelLabel(roomFullData[i])
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
}

export const modelLabel = (model: any, modelTexture: any) => {
    console.log(model, 'model');
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

    labelModel.text = model.name;
    textSquare.addControl(labelModel);

    targetModel.width = "7px";
    targetModel.height = "7px";
    targetModel.color = "Orange";
    targetModel.thickness = 2;
    targetModel.background = "green";
    modelTexture.addControl(targetModel);
    targetModel.linkWithMesh(model);

    lineModel.lineWidth = 4;
    lineModel.color = "Orange";
    lineModel.y2 = 10;
    lineModel.linkOffsetY = -3;
    modelTexture.addControl(lineModel);
    lineModel.linkWithMesh(model);
    lineModel.connectedControl = textSquare;
}