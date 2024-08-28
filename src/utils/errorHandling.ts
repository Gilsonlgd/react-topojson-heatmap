import { Topology } from "topojson-specification";
import { getProperty } from "./reactHandling";

function validateGeometriesHaveId(topology: Topology, idPath: string): boolean {
  for (const key in topology.objects) {
    const collection = topology.objects[key];
    if (collection.type === "GeometryCollection") {
      for (const geometry of collection.geometries) {
        if (
          !getProperty(geometry, idPath) &&
          getProperty(geometry, idPath) !== 0
        ) {
          console.error(
            `Geometry with properties ${JSON.stringify(
              geometry.properties
            )} is missing the "${idPath}" attribute.`
          );
          return false;
        }
      }
    }
  }
  return true;
}

function validateDataKeys(
  topology: Topology,
  data: Record<string, number>,
  idPath: string
): boolean {
  for (const key in topology.objects) {
    const collection = topology.objects[key];
    if (collection.type === "GeometryCollection") {
      for (const geometry of collection.geometries) {
        if (
          (!getProperty(geometry, idPath) && getProperty(geometry, idPath)) ||
          !(getProperty(geometry, idPath) in data)
        ) {
          console.warn(
            `Key "${
              getProperty(geometry, idPath) || "undefined"
            }" not found in data object. Default value assigned is 0.`
          );
          return false;
        }
      }
    }
  }

  return true;
}

function validateMetadataKeys(
  data: Record<string, number>,
  metadata: { [key: string]: any }
): boolean {
  for (const key in data) {
    if (!metadata.hasOwnProperty(key)) {
      console.warn(
        `Data key "${key}" not found in metadata object. Please make sure that metadata properties are defined correctly.`
      );
      return false;
    }
  }

  return true;
}

export { validateGeometriesHaveId, validateDataKeys, validateMetadataKeys };
