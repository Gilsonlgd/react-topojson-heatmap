import { createContext } from "react";
import type { Geography } from "types";
import type { GeoProjection } from "d3";

export interface MapContextValue {
  geographies: Geography[];
  projection: GeoProjection;
}

export const MapContext = createContext<MapContextValue | null>(null);
