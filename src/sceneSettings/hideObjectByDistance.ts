import {
    AbstractMesh,
} from "@babylonjs/core"

export const hideObjectByDistance = (mesh: AbstractMesh[]) => {
    mesh.forEach((model, index) => {
        if(index === 105 || index === 66){
            //@ts-ignore TODO
            model.addLODLevel(15, null)
        }
    })
}