import React, { useId, useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { scaleLinear } from "d3-scale";

import { Topology } from "topojson-specification";
import type { Geography as GeographyType, Metadata, MetaItem } from "./types";

import { getChildByType, getProperty } from "./utils/reactHandling";
import {
  validateGeometriesHaveId,
  validateDataKeys,
  validateMetadataKeys,
} from "./utils/errorHandling";
import { Tooltip as TT, Legend } from "./components";

import "./index.css";
import "react-tooltip/dist/react-tooltip.css";

interface TopoHeatmapProps {
  data: Record<string, number>;
  topojson: Topology;
  idPath?: string;
  metadata?: Metadata;
  children?: React.ReactNode[] | React.ReactNode;
  colorRange?: [string, string];
  domain?: [number, number];
  onClick?: (geo: GeographyType) => void;
}

function TopoHeatmap({
  children = [],
  data,
  metadata,
  topojson,
  idPath = "id",
  domain,
  colorRange = ["#90caff", "#2998ff"],
}: TopoHeatmapProps): JSX.Element {
  const componentId = useId().replace(/:/g, "");
  const maxValue = Math.max(...Object.values(data));
  const colorScale = scaleLinear<string>()
    .domain(domain || [0, maxValue])
    .range(colorRange);

  // Data format error handling
  useEffect(() => {
    validateGeometriesHaveId(topojson, idPath);
    validateDataKeys(topojson, data, idPath);
    if (metadata) validateMetadataKeys(data, metadata);
  }, [topojson]);

  const tooltipProps = TT.getTooltipProps(getChildByType(children, TT));
  const legendProps = Legend.getLegendProps(getChildByType(children, Legend));

  const getTooltipContent = (geoId: string | number): React.ReactNode => {
    if (tooltipProps && metadata && tooltipProps.tooltipContent) {
      return (
        <div
          className={`react-topojson-heatmap__tooltip ${
            tooltipProps.position || "top"
          }`}
        >
          {tooltipProps.tooltipContent(metadata[geoId])}
        </div>
      );
    } else {
      return (
        <div
          className={`react-topojson-heatmap__tooltip ${
            tooltipProps?.position || "top"
          }`}
        >
          <h3
            style={{
              color: "#ffff",
            }}
          >
            {geoId}
          </h3>
        </div>
      );
    }
  };

  return (
    <div className="react-topojson-heatmap">
      {legendProps && (
        <Legend
          domain={legendProps.domain || domain || [0, maxValue]}
          colorScale={legendProps.colorScale || colorScale}
          stepSize={legendProps.stepSize}
          formatter={legendProps.formatter}
        >
          {legendProps.children}
        </Legend>
      )}
      <ComposableMap
        style={{
          width: legendProps ? "95%" : "100%",
          height: "auto",
          marginLeft: "auto",
        }}
        projection="geoMercator"
        projectionConfig={{
          scale: 1100,
          center: [-54, -15],
        }}
        viewBox="0 -100 800 800"
      >
        <Geographies geography={topojson} style={{ flexGrow: 1 }}>
          {({ geographies }: { geographies: GeographyType[] }) =>
            geographies.map((geo) => {
              const stateValue = data[getProperty(geo, idPath)] || 0;
              return (
                <Geography
                  className="react-topojson-heatmap__state"
                  key={`${componentId}_${getProperty(geo, idPath)}`}
                  geography={geo}
                  fill={colorScale(stateValue)}
                  id={`geo-${componentId}-${getProperty(geo, idPath)}`}
                  data-tooltip-id={`tooltip-${componentId}`}
                  data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                    getTooltipContent(getProperty(geo, idPath))
                  )}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip
        id={`tooltip-${componentId}`}
        hidden={!!!tooltipProps}
        openOnClick={tooltipProps?.trigger === "click"}
        float={tooltipProps?.float || false}
        place={tooltipProps?.position || "top"}
        border="none"
        style={{
          padding: 0,
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

export default TopoHeatmap;
export type { GeographyType, Metadata, MetaItem, Topology };
export { Legend, Tooltip } from "./components";
