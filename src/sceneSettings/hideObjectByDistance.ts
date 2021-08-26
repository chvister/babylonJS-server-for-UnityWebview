import {
    AbstractMesh,
} from "@babylonjs/core"

export const hideObjectByDistance = (mesh: AbstractMesh[]) => {
    mesh.forEach((model, index) => {
        if(index > 20 && index < 30){
            //@ts-ignore TODO
            model.addLODLevel(15, null)
        }
    })
}