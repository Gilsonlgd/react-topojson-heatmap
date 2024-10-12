# react-topojson-heatmap

A highly flexible React component for displaying heatmaps using TopoJSON data. Supports custom TopoJSON inputs, allowing users to visualize data distributions across any geographical region.

## Features

- Easy integration with React applications
- Supports custom TopoJSON inputs for any region or country
- Customizable colors and data input
- Interactive and responsive design
- Perfect for visualizing geospatial data on custom maps

## Limitations
This component currently supports only TopoJSON files containing a *single object* in the objects attribute. If your TopoJSON contains multiple objects, *only the first object* will be projected and rendered. Make sure to structure your TopoJSON data accordingly or filter the objects before passing them to the component.

## Installation

To install the package, use npm:

```bash
npm npm install react-topojson-heatmap
```

Or with yarn:

```bash
yarn add react-topojson-heatmap
```

## Input Data

Here's a basic example of the data format used in the component:

```javascript
const data = {
  "SP": 50,
  "RJ": 30,
  "MG": 20,
  // Add more states with corresponding values
};

const metadata = {
  "SP": {
    "name": "São Paulo"
    "population": 50.000,
    "area": 50.000,
  },
  "RJ": {
    "name": "Rio de Janeiro"
    "population": 40.000,
    "area": 32.000,
  },
  // Add more states with corresponding data
}
```

## Example: Using the IBGE Malhas API

The **IBGE Malhas API** can be used as an example source for TopoJSON data with the `react-topojson-heatmap` component. The API provides geographic boundary data for Brazilian regions, such as states and municipalities, in TopoJSON format, which is compatible with this component.

### Steps to Use the IBGE Malhas API with `react-topojson-heatmap`:

1. Fetch the TopoJSON data for your desired region from the IBGE Malhas API. For example, to get the TopoJSON of Brazil, you can use the following API endpoint:

  ```bash
   https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/json&qualidade=maxima&intrarregiao=UF
  ```
2. Pass the fetched TopoJSON data to the topojson prop of the TopoHeatmap component, as shown below:

```javascript
<TopoHeatmap
  data={data}
  topojson={topojson}
  idPath="properties.codarea"
  colorRange={["#90caff", "#2998ff"]}
/>
```

3. Customize the heatmap with your own data, colors, and settings.

You can explore the IBGE Malhas API documentation here: https://servicodados.ibge.gov.br/api/docs/malhas?versao=3

## Props

### Main Component

The `react-topojson-heatmap` component accepts the following props:

| Prop          | Type                                   | Description                                                                                     | Default                                                       |
| ------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `data`        | `Record<string, number>`               | An object containing the values for each state. The key should correspond to the state's code.  | NA                                                            |
| `metadata?`   | `Metadata`                             | An object specifying metadata for each state, such as names or descriptions.                    | `undefined`                                                   |
| `topojson`    | `Topology<TopoObj>`                    | The TopoJSON data used for rendering the geographical regions.                                  | NA                                                            |
| `idPath?`     | `string`                               | The key used to identify each region in the TopoJSON data.                                      | `"id"`                                                        |
| `colorRange?` | `[string, string]`                     | An array of two colors that define the color range for the heatmap.                             | `["#90caff", "#2998ff"]`                                      |
| `domain?`     | `[number, number]`                     | An array containing the minimum and maximum values for the data range.                          | `[0, maxValue]`, where `maxValue` is the max value in `data`. |
| `scale?`      | `number`                               | A scale factor to manually adjust the size of the rendered map.                                 | `1`                                                           |
| `translate?`  | `[number, number]`                     | An array defining the x and y translation to position the map.                                  | `[0, 0]`                                                      |
| `fitSize?`    | `boolean`                              | Whether to fit the size of the map to the container's dimensions.                               | `true`                                                        |
| `onClick?`    | `(geo: GeographyType) => void`         | A callback function called when a region is clicked, receiving information about the geography. | `() => {}`                                                    |
| `onSelect?`   | `(geos: GeographyType[]) => void`      | A callback function called when a region is clicked that enables multiple selection, receiving information about all the currently selected regions. | `undefined`     |


Basic example usage:

```javascript
import React from 'react';
import TopoHeatmap from 'react-topojson-heatmap';

function App() {
  return (
    <div className="App">
      <h1>TopoJSON Heatmap</h1>
      <TopoHeatmap data={data} metadata={metadata} topojson={topojson}/>
    </div>
  );
}

export default App;
```

### Children Components

#### Tooltip

Used to display a tooltip with relevant information about each state.


| Prop           | Type                                  | Description                                                                                                  | Default                          |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| trigger?       | `"hover", "click"`                    | Determines how the tooltip is triggered ( on hover or click).                                                | `"hover"`                        |
| float?          | `boolean`                             | If true, tooltip will follow the mouse position when it moves inside the anchor element.                     | `false`                          |
| position?       | `"top", "right", "bottom", "left"`    | Specifies the position of the tooltip relative to the target.                                                | `"top"`                           |
| tooltipContent? | `(meta: MetaItem) => React.ReactNode` | A function that returns the content of the tooltip based on metadata. Used to customize the tooltip content. | Returns a div with the state id. |


Example Usage (using bootstrap):
```javascript
import React from 'react';
import TopoHeatmap, { Tooltip, MetaItem } from 'react-topojson-heatmap';

function App() {
  const tooltipContent = (meta: MetaItem): React.ReactNode => {
    return (
      <div className="d-flex container-fluid flex-column">
        <h3 className="fw-bold text-center text-white">{meta.name}</h3>
        <span>
          <strong>Population: </strong>
          {meta.population}
        </span>
        <span>
          <strong>Area: </strong>
          {meta.area} m2
        </span>
      </div>
    );
  };
  return (
    <div className="App">
      <TopoHeatmap data={data} metadata={metadata} topojson={topojson}>
        <Tooltip
          float
          trigger="hover"
          tooltipContent={tooltipContent}
        />
      </TopoHeatmap>
    </div>
  );
}

export default App;
```

#### Legend
Used to display the heatmap color scale legend.

| Prop       | Type                        | Description                               | Default Value                          |
| ---------- | --------------------------- | ----------------------------------------- | -------------------------------------- |
| children   | `React.ReactNode, string`   | Content to be displayed in the legend header. | `"Legend"` |
| stepSize   | `number`                    | The interval between steps in the legend. | `5`                                    |
| formatter  | `(value: number) => string` | Function to format the legend labels.     | `undefined`                            |

Example Usage (using bootstrap):
```javascript
import React from 'react';
import TopoHeatmap, { Legend } from 'react-topojson-heatmap';

function App() {
  return (
    <div className="App">
      <TopoHeatmap data={data} metadata={metadata} topojson={topojson}>
        <Legend
          stepSize={10}
          formatter={value => {
            return `${value.toLocaleString()}%`;}
          }
        >
          <strong>
            Public Schools Percentage
          </strong>
        </Legend>
      </TopoHeatmap>
    </div>
  );
}

export default App;
```


## Customizing
Each component can be customized by overriding specific CSS classes.  
**Note**: Some properties may require the use of `!important` to be properly overridden.

### Main Component

- **`.react-topojson-heatmap`**: Controls the overall layout and dimensions of the heatmap.
- **`.react-topojson-heatmap__state`**: Styles each individual region within the heatmap, managing outline, border, and transition effects.
- **`.react-topojson-heatmap__state:hover`**: Defines the hover behavior for each region.
- **`.react-topojson-heatmap__state.selected `**: Defines the selected behavior for each region.

### Tooltip
The tooltip component can also be customized by overriding the following CSS classes:

- **`.react-topojson-heatmap__tooltip`**: Defines the overall appearance of the tooltip.
  
- **`.react-topojson-heatmap__tooltip.bottom::before`**: Styles the arrow at the top of the tooltip when it's positioned at the bottom. The arrow is created using CSS borders.

- **`.react-topojson-heatmap__tooltip.top::before`**: Styles the arrow at the bottom of the tooltip when it's positioned at the top.

- **`.react-topojson-heatmap__tooltip.right::before`**: Styles the arrow on the left side of the tooltip when it's positioned to the right.

- **`.react-topojson-heatmap__tooltip.left::before`**: Styles the arrow on the right side of the tooltip when it's positioned to the left.

**Note**: If you change the background color of the tooltips, you'll also need to update the arrow colors in the corresponding classes to match the new background.


### Legend
The legend component can be customized by overriding the following CSS classes:

- **`.react-topojson-heatmap__legend`**: Defines the overall appearance of the legend.

- **`.react-topojson-heatmap__legend .content-wrapper`**: Inherits layout properties from the parent legend class.

- **`.react-topojson-heatmap__legend .legend-header`**: Styles the header of the legend.

- **`.react-topojson-heatmap__legend .legend-body`**: Manages the layout of the legend's body, using flexbox to center content and defining font size and line height.

- **`.react-topojson-heatmap__legend .legend-item`**: Defines the layout of individual items within the legend.

- **`.react-topojson-heatmap__legend .legend-color`**: Styles the color indicators in the legend, setting their size, shape, and spacing.

## Contributing
We welcome contributions! If you have suggestions, bug reports, or want to add new features, please open an issue or submit a pull request.

## Acknowledgements
This project was developed with the financial support of **Universidade Federal de Santa Maria (UFSM)**, in partnership with **INEP**, through a scholarship from the university. I would like to thank both institutions for their assistance and funding.
