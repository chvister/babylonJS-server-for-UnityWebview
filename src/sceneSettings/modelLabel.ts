import {
    HemisphericLight, Scene, Vector3, AbstractMesh
} from "@babylonjs/core";

import {
    AdvancedDynamicTexture, Rectangle,
    TextBlock,
    Ellipse,
    Line
} from '@babylonjs/gui'


export const modelLabel = (model: AbstractMesh, modelTexture: AdvancedDynamicTexture, textSquare: Rectangle, labelModel: TextBlock, targetModel: Ellipse, lineModel: Line) => {
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