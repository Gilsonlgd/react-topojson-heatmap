import type { ScaleLinear } from "d3-scale";

export const gradientStyle = (
  domain: number[],
  scaleType: "continuous" | "discrete",
  colorScale: ScaleLinear<string, string, never>,
) => {
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
