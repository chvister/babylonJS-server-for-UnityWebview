import {
  AuthorizedBackendRequestContext, BriefcaseDb, BriefcaseManager,
} from "@bentley/imodeljs-backend";
import { LocalBriefcaseProps } from "@bentley/imodeljs-common";
import { IModelHost, SnapshotDb } from "@bentley/imodeljs-backend";
import { assert, ClientRequestContext, DbResult, Id64Array, Logger } from "@bentley/bentleyjs-core";
import {
  ECSqlStatement, ExportGraphicsInfo, GeometricElement3d, IModelDb, Texture, ViewDefinition3d,
} from "@bentley/imodeljs-backend";
import {
  ICameraViewsReply, IElementPropertiesReplyEntry, IElementTooltipReply, IExportMeshesReply,
  IProjectExtentsReply, IReplyWrapper, ITextureReply, ReplyWrapper, RequestWrapper,
} from "./IModelRpc_pb";
import { Angle } from "@bentley/geometry-core";
import { Presentation } from "@bentley/presentation-backend";
import { ElementPropertiesItem } from "@bentley/presentation-common";

let iModel: IModelDb;

//@ts-ignore
window.openIModelFromSnapshotDB = (filePath: string) => {
  if (filePath?.length === 0){
    console.log("No filepath provided");
    return
  }
  console.log("Attempting to open iModel from " + filePath);
  iModel = SnapshotDb.openFile(filePath);
  console.log("iModel opened successfully"); 
};


function encodeReply(requestId: number, reply: IReplyWrapper): Uint8Array {
  reply.requestId = requestId;
  return ReplyWrapper.encode(ReplyWrapper.create(reply)).finish();
}

export function handleSelectElementIdsRequest(wrapper: RequestWrapper) {
  const request = wrapper.selectElementIdsRequest;
  assert(!!request && !!request.selectFilter);

  const sql = `SELECT ECInstanceId ${request.selectFilter}`;
  const elementIds: Id64Array = [];
  iModel.withPreparedStatement(sql, (stmt: ECSqlStatement) => {
    while (stmt.step() === DbResult.BE_SQLITE_ROW)
      elementIds.push(stmt.getValue(0).getId());
  });
  console.log(`Selected ${elementIds.length} elements`);

  //  socket.send(encodeReply(wrapper.requestId, { selectElementIdsReply: { elementIds } }));
  return encodeReply(wrapper.requestId, { selectElementIdsReply: { elementIds } });
}


export function handleTextureRequest( iModel: IModelDb, wrapper: RequestWrapper) {
  const request = wrapper.textureRequest;
  assert(!!request && !!request.textureId);

  const texture = iModel.elements.getElement<Texture>(request.textureId);
  if (!texture) {
    console.log(`Could not load texture ${request.textureId}`);
    return;
  }

  const textureReply: ITextureReply = {
    textureId: request.textureId,
    textureData: texture.data,
  };
  //socket.send(encodeReply(wrapper.requestId, { textureReply }));

  return encodeReply(wrapper.requestId, { textureReply })
}


export function handleExportMeshesRequest(iModel: IModelDb, wrapper: RequestWrapper) {
  const request = wrapper.exportMeshesRequest;
  assert(!!request && !!request.elementIds);
  assert(request.chordTol !== null && request.chordTol !== undefined); // 0 is valid value for chordTol

  iModel.exportGraphics({
    onGraphics: (info) => { return (createMeshReply(info, wrapper.requestId)); },
    elementIdArray: request.elementIds,
    chordTol: request.chordTol,
    angleTol: Angle.degreesToRadians(45),
  });

  // Empty reply finishes stream
  //socket.send(encodeReply(wrapper.requestId, { exportMeshesReply: {} }));

  return encodeReply(wrapper.requestId, { exportMeshesReply: {} });
}


function createMeshReply(info: ExportGraphicsInfo, requestId: number): Uint8Array {
  const indices = info.mesh.indices;
  const points = info.mesh.points;
  const normals = info.mesh.normals;
  const params = info.mesh.params;
  const byteCount = indices.byteLength + points.byteLength + normals.byteLength + params.byteLength;
  const meshData: Buffer = Buffer.allocUnsafe(byteCount);

  let offset = 0;
  Buffer.from(indices.buffer).copy(meshData, offset);
  offset += indices.byteLength;
  Buffer.from(points.buffer).copy(meshData, offset);
  offset += points.byteLength;
  Buffer.from(normals.buffer).copy(meshData, offset);
  offset += normals.byteLength;
  Buffer.from(params.buffer).copy(meshData, offset);

  const exportMeshesReply: IExportMeshesReply = {
    elementId: info.elementId,
    color: info.color,
    indexCount: indices.length,
    vertexCount: points.length / 3,
    meshData,
  };
  if (info.textureId)
    exportMeshesReply.textureId = info.textureId;

  return encodeReply(requestId, { exportMeshesReply, requestHasMoreReplies: true });
}


export function handleElementTooltipRequest(wrapper: RequestWrapper) {
  const request = wrapper.elementTooltipRequest;
  assert(!!request && !!request.elementId);

  const element = iModel.elements.getElement<GeometricElement3d>(request.elementId);
  if (!element) {
    //Logger.logError(APP_LOGGER_CATEGORY, `Could not load element ${request.elementId}`);
    return;
  }

  const elementTooltipReply: IElementTooltipReply = {
    elementId: request.elementId,
    classLabel: element.className,
    categoryLabel: iModel.elements.getElement(element.category).getDisplayLabel(),
    modelLabel: iModel.elements.getElement(element.model).getDisplayLabel(),
  };

  //socket.send(encodeReply(wrapper.requestId, { elementTooltipReply }));
  return encodeReply(wrapper.requestId, { elementTooltipReply });
}

export function handleProjectExtentsRequest( wrapper: RequestWrapper) {
  const extents = iModel.projectExtents;
  const projectExtentsReply: IProjectExtentsReply = {
    minX: extents.low.x, minY: extents.low.y, minZ: extents.low.z,
    maxX: extents.high.x, maxY: extents.high.y, maxZ: extents.high.z,
  };
  return encodeReply(wrapper.requestId, { projectExtentsReply });
}

export function handleCameraViewsRequest(wrapper: RequestWrapper) {
  const sql = "SELECT ECInstanceId FROM bis.ViewDefinition3d";
  iModel.withPreparedStatement(sql, (stmt: ECSqlStatement) => {
    while (stmt.step() === DbResult.BE_SQLITE_ROW) {
      const viewElement = iModel.elements.getElement<ViewDefinition3d>(stmt.getValue(0).getId());
      if (viewElement && viewElement.cameraOn)
        return createCameraViewsReply(viewElement, wrapper.requestId)
      //socket.send(createCameraViewsReply(viewElement, wrapper.requestId));
    }
  });

  // Empty reply finishes stream
  return encodeReply(wrapper.requestId, { cameraViewsReply: {} })
  //socket.send(encodeReply(wrapper.requestId, { cameraViewsReply: {} }));
}

export function createCameraViewsReply(viewElement: ViewDefinition3d, requestId: number): Uint8Array {
  const eyePoint = viewElement.camera.eye;
  const cameraViewsReply: ICameraViewsReply = {
    displayLabel: viewElement.getDisplayLabel(),
    yaw: viewElement.angles.yaw.degrees,
    pitch: viewElement.angles.pitch.degrees,
    roll: viewElement.angles.roll.degrees,
    eyePointX: eyePoint.x,
    eyePointY: eyePoint.y,
    eyePointZ: eyePoint.z,
  };

  return encodeReply(requestId, { cameraViewsReply, requestHasMoreReplies: true });
}

export function handleElementPropertiesRequest( wrapper: RequestWrapper) {
  getElementProperties( wrapper).catch((reason: any) => {
    //Logger.logError(APP_LOGGER_CATEGORY, `${reason}`);
  });
}


async function getElementProperties( wrapper: RequestWrapper){
  const request = wrapper.elementPropertiesRequest;
  assert(!!request && !!request.elementId);

  const elementProperties = await Presentation.getManager().getElementProperties({
    imodel: iModel,
    elementId: request.elementId,
    requestContext: new ClientRequestContext(),
  });

  if (!elementProperties)
    return Promise.reject(`getElementProperties returned undefined for ${request.elementId}`);

  const rootProperty: IElementPropertiesReplyEntry = { label: elementProperties.label };
  rootProperty.children = parseElementPropertiesMap(elementProperties.items);

  return encodeReply(wrapper.requestId, { elementPropertiesReply: { root: rootProperty } })
}


function parseElementPropertiesMap(items: {[label: string]: ElementPropertiesItem} ): IElementPropertiesReplyEntry[] {
  const results: IElementPropertiesReplyEntry[] = [];

  Object.entries(items).map((kvp) => {
    const thisResult: IElementPropertiesReplyEntry = { label: kvp[0] };
    setValueOrChildrenFromElementPropertiesItem(thisResult, kvp[1]);
    results.push(thisResult);
  });

  return results;
}

function setValueOrChildrenFromElementPropertiesItem(replyEntry: IElementPropertiesReplyEntry, item: ElementPropertiesItem) {
  if (item.type === "primitive")
    replyEntry.value = item.value;
  else if (item.type === "category")
    replyEntry.children = parseElementPropertiesMap(item.items);
  else if (item.type === "struct")
    replyEntry.children = parseElementPropertiesMap(item.members);
  else if (item.type === "array") {
    if (item.valueType === "primitive")
      replyEntry.children = parseElementPropertiesList(item.values.map((v) => ({ type: "primitive", value: v })));
    else if (item.valueType === "struct")
      replyEntry.children = parseElementPropertiesList(item.values.map((v) => ({ type: "struct", members: v })));
  }
}

function parseElementPropertiesList(items: ElementPropertiesItem[]): IElementPropertiesReplyEntry[] {
  const results: IElementPropertiesReplyEntry[] = [];

  for (let i = 0; i < items.length; ++i) {
    const thisResult: IElementPropertiesReplyEntry = { label: `${i}` };
    setValueOrChildrenFromElementPropertiesItem(thisResult, items[i]);
    results.push(thisResult);
  }

  return results;
}