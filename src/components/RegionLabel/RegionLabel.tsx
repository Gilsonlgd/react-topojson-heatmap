import React from "react";
import "./RegionLabel.css";

import { geoCentroid } from "d3-geo";
import { GeoGeometryObjects } from "d3";

import { useHeatmapContext } from "hooks/useHeatmapContext";
import { useMapContext } from "hooks/useMapContext";

import { getProperty } from "utils/reactHandling";

import { DataItem } from "types";

export type RegionLabelProps<T = DataItem> = {
  width?: number;
  height?: number;
  content?: (regionId: string | number, data: T) => React.ReactNode;
};

function RegionLabel<T>({
  width = 75,
  height = 50,
  content,
}: RegionLabelProps<T>): JSX.Element {
  const { geoIdPath: idPath, componentId, data } = useHeatmapContext();
  const { geographies, projection } = useMapContext();

  return (
    <>
      {geographies.map((geo) => {
        const regionId = getProperty(geo, idPath);

        const centroid = projection(geoCentroid(geo as GeoGeometryObjects)) || [
          0, 0,
        ];

        const x = centroid[0] - width / 2;
        const y = centroid[1] - height / 2;

        return (
          <foreignObject
            key={`${componentId}_label_${regionId}`}
            x={x}
            y={y}
            width={width}
            height={height}
            onMouseEnter={(e) => {
              const node = e.currentTarget;
              const parent = node.parentNode;
              if (parent) {
                parent.appendChild(node);
              }
            }}
          >
            <div className="react-topojson-heatmap__region-label">
              {content ? content(regionId, data?.[regionId]) : regionId}
            </div>
          </foreignObject>
        );
      })}
    </>
  );
}

export default RegionLabel;
