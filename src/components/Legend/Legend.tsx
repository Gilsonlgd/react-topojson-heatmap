import React, { useMemo } from "react";
import "./Legend.css";

import { useHeatmapContext } from "hooks/useHeatmapContext";
import { gradientStyle } from "./Legend.utils";
import type { LegendType } from "./Legend.types";

export type LegendProps = {
  children?: React.ReactNode | string;
  stepSize?: number;
  scaleType?: LegendType;
  maxValueLabel?: string;
  minValueLabel?: string;
  height?: number;
  formatter?: (value: number) => string;
};

function Legend({
  children = "",
  stepSize = 5,
  scaleType = "discrete",
  maxValueLabel = "",
  minValueLabel = "",
  height = undefined,
  formatter,
}: LegendProps): JSX.Element {
  const { domain, maxValue: globalMaxValue, colorScale } = useHeatmapContext();

  const normalizedDomain = domain ?? [0, globalMaxValue];

  const minValue = normalizedDomain[0];
  const maxValue = normalizedDomain[normalizedDomain.length - 1];

  const numSteps = useMemo(() => {
    return Math.floor((maxValue - minValue) / stepSize) + 1;
  }, [minValue, maxValue, stepSize]);

  const legendValues = useMemo(() => {
    return Array.from({ length: numSteps }, (_, i) => minValue + i * stepSize);
  }, [minValue, stepSize, numSteps]);

  const isContinuous = scaleType === "continuous";
  const isDiscrete = scaleType === "discrete";

  return (
    <div className={`react-topojson-heatmap__legend`}>
      <div className="content-wrapper">
        {/* Header */}
        <div className="legend-header">{children}</div>

        {/* Handles discrete kind of legend */}
        {isDiscrete && (
          <div className="discrete-legend">
            {legendValues.map((value, i) => (
              <div key={i} className="discrete-legend__item">
                <div
                  className="discrete-legend__colorbox"
                  style={{
                    backgroundColor: colorScale!(value),
                  }}
                />
                <span>
                  {formatter
                    ? formatter(value)
                    : value.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Handles continuous kind of legend */}
        {isContinuous && (
          <div
            className="continuous-legend"
            style={{
              height: height,
            }}
          >
            <div className="continuous-legend__labels">
              {maxValueLabel && (
                <span className="label-title">{maxValueLabel}</span>
              )}
              <span className="label-value">
                {formatter
                  ? formatter(legendValues[legendValues.length - 1])
                  : legendValues[legendValues.length - 1].toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      },
                    )}
              </span>
            </div>

            {/* Gradient bar */}
            <div
              className="continuous-legend_gradientbar"
              style={gradientStyle(normalizedDomain, scaleType, colorScale!)}
            />

            <div className="continuous-legend__labels">
              {minValueLabel && (
                <span className="label-title">{minValueLabel}</span>
              )}
              <span className="label-value">
                {formatter
                  ? formatter(legendValues[0])
                  : legendValues[0].toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Legend;
