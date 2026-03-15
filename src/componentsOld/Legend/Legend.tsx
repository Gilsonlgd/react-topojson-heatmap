import React from "react";
import "./Legend.css";

export type LegendProps = {
  children?: React.ReactNode | string;
  domain?: number[];
  stepSize?: number;
  scaleType?: "continuous" | "discrete";
  maxValueLabel?: string;
  minValueLabel?: string;
  height?: number;
  colorScale?: (value: number) => string;
  formatter?: (value: number) => string;
};

function Legend({
  domain = [0, 0],
  children = "",
  stepSize = 5,
  scaleType = "discrete",
  maxValueLabel = "",
  minValueLabel = "",
  height = undefined,
  colorScale,
  formatter,
}: LegendProps): JSX.Element {
  const [minValue, maxValue] = [domain[0], domain[domain.length - 1]];
  const numSteps = Math.floor((maxValue - minValue) / stepSize) + 1;
  const legendValues = Array.from(
    { length: numSteps },
    (_, i) => minValue + i * stepSize
  );

  const gradientStyle = () => {
    if (domain.length === 1) return { background: colorScale!(domain[0]) };

    if (scaleType === "continuous" && domain.length > 1) {
      const min = domain[0];
      const max = domain[domain.length - 1];
      const range = max - min;

      const colorStops = domain.map((value) => {
        const percent = ((value - min) / range) * 100;
        return `${colorScale!(value)} ${percent}%`;
      });

      return {
        background: `linear-gradient(to top, ${colorStops.join(", ")})`,
      };
    }
    return {};
  };
  return (
    <div className={`react-topojson-heatmap__legend`}>
      <div className="content-wrapper">
        {/* Header */}
        <div className="legend-header">{children}</div>

        {/* Handles discrete kind of legend */}
        {scaleType === "discrete" && (
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
        {scaleType === "continuous" && (
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
                      }
                    )}
              </span>
            </div>

            {/* Gradient bar */}
            <div
              className="continuous-legend_gradientbar"
              style={gradientStyle()}
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

Legend.getLegendProps = (legend: React.ReactNode): LegendProps | null => {
  if (React.isValidElement(legend) && legend.type === Legend) {
    const props = legend.props as LegendProps;
    return props;
  }
  return null;
};

export default Legend;
