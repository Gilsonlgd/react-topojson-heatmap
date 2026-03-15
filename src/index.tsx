import TopoHeatmap, {
  TopoHeatmapProps,
} from "./components/TopoHeatmap/TopoHeatmap";
import Legend, { LegendProps } from "./components/Legend/Legend";
import RegionLabel, {
  RegionLabelProps,
} from "./components/RegionLabel/RegionLabel";
import Tooltip, { TooltipProps } from "./components/Tooltip/Tooltip";

import { Topology } from "topojson-specification";
import { DataItem } from "./types";

const TopoHeatmapComponent = Object.assign(TopoHeatmap, {
  Legend,
  RegionLabel,
  Tooltip,
});

export { TopoHeatmapComponent as TopoHeatmap };

export type {
  TopoHeatmapProps,
  LegendProps,
  RegionLabelProps,
  TooltipProps,
  Topology,
  DataItem,
};
