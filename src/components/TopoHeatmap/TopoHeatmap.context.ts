import { createContext } from "react";

import type { ScaleLinear } from "d3-scale";
import type { Data } from "types";

export interface HeatmapContextValue {
  data: Data;
  maxValue: number;
  colorScale: ScaleLinear<string, string, never>;
  idPath: string;
  componentId: string;
  domain?: number[];
}

export const HeatmapContext = createContext<HeatmapContextValue | null>(null);
