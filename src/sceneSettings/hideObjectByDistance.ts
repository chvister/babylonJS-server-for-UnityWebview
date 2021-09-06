import {
    AbstractMesh,
} from "@babylonjs/core"

export const hideObjectByDistance = (mesh: AbstractMesh[]) => {
    mesh.forEach((model, index) => {
        if(index > 21 && index < 23){
            //@ts-ignore TODO
            model.addLODLevel(15, null)
        }
    })
}