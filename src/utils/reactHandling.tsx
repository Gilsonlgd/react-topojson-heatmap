import React from "react";

const getProperty = <T,>(obj: T, path: string): string | number => {
  const value = path
    .split(".")
    .reduce((acc: any, key: string) => acc && acc[key], obj);
  return typeof value === "string" || typeof value === "number" ? value : "";
};

const getChildByType = (
  children: React.ReactNode[] | React.ReactNode,
  type: React.ElementType
) => {
  if (Array.isArray(children)) {
    return children.find(
      (child) => React.isValidElement(child) && child.type === type
    ) as React.ReactNode | null;
  } else {
    if (React.isValidElement(children) && children.type === type) {
      return children;
    }
  }
  return null;
};

export { getChildByType, getProperty };
