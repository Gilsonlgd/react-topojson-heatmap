import React, { useId, useEffect, useState } from "react";
import "./TopoHeatmap.css";

import {
  ComposableMap,
  Geographies,
  Geography,
  ProjectionFunction,
} from "react-simple-maps";
import { geoMercator } from "d3";
import { scaleLinear } from "d3-scale";
import { feature } from "topojson-client";

import { Topology } from "topojson-specification";
import type {
  Geography as GeographyType,
  Data,
  DataItem,
  TopoObj,
} from "types";

import { getProperty, getObjectFirstProperty } from "utils/reactHandling";
import {
  validateGeometriesHaveId,
  validateDataKeys,
} from "utils/errorHandling";

import RegionLabel from "../RegionLabel/RegionLabel";

import { HeatmapContext } from "./TopoHeatmap.context";

export interface TopoHeatmapProps {
  data: Data;
  topojson: Topology<TopoObj>;
  valueKey: string;
  idPath?: string;
  children?: React.ReactNode[] | React.ReactNode;
  colorRange?: string[];
  domain?: number[];
  scale?: number;
  translate?: [number, number];
  fitSize?: boolean;
  onClick?: (geo: GeographyType) => void;
  onSelect?: (geos: GeographyType[]) => void;
}

function TopoHeatmap({
  children = [],
  data,
  valueKey,
  topojson,
  idPath = "id",
  domain,
  colorRange = ["#90caff", "#2998ff"],
  scale = 1,
  translate = [0, 0],
  fitSize = true,
  onClick,
  onSelect,
}: TopoHeatmapProps): JSX.Element {
  // SVG viewport dimensions.
  const width = 600;
  const height = 600;
  const [projection, setProjection] = useState(() => geoMercator());

  const [selectedGeos, setSelectedGeos] = useState<GeographyType[]>([]);

  const componentId = useId().replace(/:/g, "");

  const svgChildren: React.ReactNode[] = [];
  const uiChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === RegionLabel) {
      svgChildren.push(child);
    } else {
      uiChildren.push(child);
    }
  });

  // Extract values using valueKey
  const extractValue = (item: DataItem): number => {
    if (!item || !valueKey || typeof item[valueKey] === "undefined") return 0;
    const value = item[valueKey];
    return typeof value === "number" ? value : 0;
  };

  const dataValues = Object.keys(data).map((key) => extractValue(data[key]));
  const maxValue = Math.max(...dataValues);
  const colorScale = scaleLinear<string>()
    .domain(domain || [0, maxValue])
    .range(colorRange);

  // Data format error handling
  useEffect(() => {
    validateGeometriesHaveId(topojson, idPath);
    validateDataKeys(topojson, data, idPath, valueKey);
  }, [topojson, data, idPath, valueKey]);

  useEffect(() => {
    const geojson = feature(topojson, getObjectFirstProperty(topojson.objects));
    let newProjection = geoMercator();
    if (fitSize)
      newProjection = newProjection.fitSize([width, height], geojson);

    newProjection = newProjection.scale(newProjection.scale() * scale);
    newProjection = newProjection.center([
      newProjection.center()[0] + translate[0],
      newProjection.center()[1] + translate[1],
    ]);
    setProjection(() => newProjection);
  }, [topojson]);

  useEffect(() => {
    if (!onSelect) setSelectedGeos([]);
  }, [onSelect]);

  const handleSelectGeo = (geo: GeographyType): void => {
    if (!onSelect) return;

    if (!selectedGeos.includes(geo)) {
      onSelect([...selectedGeos, geo]);
      setSelectedGeos((prev) => {
        return [...prev, geo];
      });
    } else {
      onSelect(selectedGeos.filter((curr) => curr !== geo));
      setSelectedGeos(selectedGeos.filter((curr) => curr !== geo));
    }
  };

  const context = {
    data,
    idPath,
    domain,
    colorScale,
    projection,
    maxValue,
    componentId,
  };
  return (
    <HeatmapContext.Provider value={context}>
      <ComposableMap
        width={width}
        height={height}
        projection={projection as unknown as ProjectionFunction}
      >
        <Geographies geography={topojson} style={{ flexGrow: 1 }}>
          {({ geographies }: { geographies: GeographyType[] }) => (
            <>
              {/**
               * Handle region printing
               */}
              {geographies.map((geo) => {
                const geoId = getProperty(geo, idPath);
                const geoData = data[geoId] || {};
                const stateValue = extractValue(geoData);
                return (
                  <Geography
                    key={`${componentId}_${geoId}`}
                    className={`react-topojson-heatmap__state ${
                      selectedGeos.includes(geo) ? "selected" : ""
                    }`}
                    geography={geo}
                    fill={colorScale(stateValue)}
                    id={`geo-${componentId}-${geoId}`}
                    data-tooltip-id={`tooltip-${componentId}`}
                    data-region-id={geoId}
                    data-region-label-id={`region-label-${componentId}`}
                    onClick={() => {
                      if (onClick) onClick(geo);
                      handleSelectGeo(geo);
                    }}
                  />
                );
              })}
              {svgChildren}
            </>
          )}
        </Geographies>
      </ComposableMap>
      {uiChildren}
    </HeatmapContext.Provider>
  );
}

export default TopoHeatmap;
