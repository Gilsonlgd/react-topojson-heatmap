import { useContext } from "react";
import { HeatmapContext } from "components/TopoHeatmap/TopoHeatmap.context";

export function useHeatmapContext() {
  const context = useContext(HeatmapContext);

  if (!context) {
    throw new Error("TopoHeatmap components must be used within <TopoHeatmap>");
  }

  return context;
}
