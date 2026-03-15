import { useContext } from "react";
import { MapContext } from "providers/MapContext";

export function useMapContext() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error(
      "TopoHeatmap map components must be used inside <TopoHeatmap>",
    );
  }

  return context;
}
