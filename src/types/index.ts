export type Geography = {
  type: string;
  properties: {
    [key: string]: any;
  };
  id: string;
  arcs: any[];
};

export type MetaItem = {
  [key: string]: string | number;
};

export type Metadata = {
  [key: string]: MetaItem;
};
