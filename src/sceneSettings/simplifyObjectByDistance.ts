import {
    AbstractMesh, SimplificationType
} from "@babylonjs/core"

export const simplifyObjectByDistance = (mesh: AbstractMesh[]) => {
    setTimeout(function () {
        console.log('test1');
        //@ts-ignore
        mesh[25].optimizeIndices(function () {
            console.log('test2');
            //@ts-ignore
            mesh[25].simplify([{ distance: 10, quality: 1 }, { distance: 50, quality: 0.1 }], false, SimplificationType.QUADRATIC, function () {
                console.log("simplification finished");
            });
        });
    }, 5000);
}