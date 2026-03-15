import React from "react";
import "./Tooltip.css";
import "react-tooltip/dist/react-tooltip.css";

import { Tooltip as ReactTooltip, PlacesType } from "react-tooltip";
import type { DataItem } from "types";

import { useHeatmapContext } from "hooks/useHeatmapContext";

export type TooltipProps = {
  trigger?: "hover" | "click";
  float?: boolean;
  position?: PlacesType;
  tooltipContent?: (meta: DataItem) => React.ReactNode;
};

function Tooltip({
  trigger = "hover",
  float = false,
  position = "top",
  tooltipContent,
}: TooltipProps): JSX.Element {
  const { componentId, data } = useHeatmapContext();

  const render = ({ activeAnchor }: { activeAnchor: HTMLElement | null }) => {
    if (!activeAnchor) return null;

    const regionId = activeAnchor.getAttribute("data-region-id") as
      | string
      | number;
    const regionData = data?.[regionId];

    if (!tooltipContent) return regionId;

    return tooltipContent(regionData);
  };

  return (
    <ReactTooltip
      id={`tooltip-${componentId}`}
      openOnClick={trigger === "click"}
      float={float}
      place={position}
      render={render}
      border="none"
      style={{
        padding: 0,
        backgroundColor: "transparent",
      }}
    />
  );
}

export default Tooltip;
