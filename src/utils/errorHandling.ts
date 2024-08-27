import { Topology } from "topojson-specification";

function validateGeometriesHaveId(topology: Topology): boolean {
  for (const key in topology.objects) {
    const collection = topology.objects[key];
    if (collection.type === "GeometryCollection") {
      for (const geometry of collection.geometries) {
        if (!geometry.id && geometry.id !== 0) {
          console.error(
            `Geometry with properties ${JSON.stringify(
              geometry.properties
            )} is missing the 'id' attribute.`
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
  data: Record<string, number>
): boolean {
  for (const key in topology.objects) {
    const collection = topology.objects[key];
    if (collection.type === "GeometryCollection") {
      for (const geometry of collection.geometries) {
        if ((!geometry.id && geometry.id !== 0) || !(geometry.id in data)) {
          console.warn(
            `Key "${geometry.id}" not found in data object. Default value assigned is 0.`
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
