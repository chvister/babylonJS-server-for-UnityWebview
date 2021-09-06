import {
    AbstractMesh, SimplificationType
} from "@babylonjs/core"

export const simplifyObjectByDistance = (mesh: AbstractMesh[]) => {
    console.log('test1');
    //@ts-ignore
    mesh[40].optimizeIndices(function () {
        //@ts-ignore
        mesh[40].simplify([{ distance: 1, quality: 0.9 }, { distance: 10, quality: 0.1 }], false, SimplificationType.QUADRATIC, function () {
            console.log("simplification finished");
        });
    })
};
