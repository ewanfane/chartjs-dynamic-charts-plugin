# DynamicCharts Plugin

DynamicCharts is a customizable plugin for creating interactive, dynamic charts. This plugin integrates with the Chart.js library and provides enhanced functionality such as panning, zooming, customizable field of view (FOV), and the ability to manage multiple chart instances.

## Features

- **Multichart and Single Chart Support:** Create multiple charts using the same class.
- **Panning and Zooming:** Control chart interactions with the ability to pan and zoom.
- **Customizable Field of View (FOV):** Adjust the FOV for better data visibility and presentation.
- **FPS Control:** Set a frame rate limit to optimize performance.
- **Chart Configuration Options:** Extensive configuration options for customizing chart behaviors.
- **Custom Functionality:**  Enables users to modify chart properties or behavior dynamically based on updates to the charts FOV.

## Installation

1. **Download or Clone the Repository:**

   Clone the repository to your local machine:

   ```bash
   git clone https://github.com/ewanfane/chartjs-dynamic-charts-plugin
   ```

2. **Integrate with Your Project:**
   
   Include the DynamicChart file in your project:

   ```html
   <script src="path/to/chartjs-dynamic-charts-plugin/src/handler.js"></script>
   ```

3. **Include Chart.js:**

   DynamicCharts relies on Chart.js, so make sure to include it in your HTML:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   ```

4. **Initialize a DynamicChart:**

   Create a DynamicChart instance:

   ```js
   const chart1 = new DynamicChart(config={
      ctx: document.getElementById('chart1').getContext('2d'),
      datasets: [dataset1, dataset2],
      chart_config: line_config,
      }, 
      options={

      }
   )
   ```

5. **Initialise DynamicChartHandler:**

   Create a DynamicChartHandler instance and pass the config with the DynamicChart and a bounding area (this can be as simple as a div wrapping the canvas/s with an id)

   ```js
   let chart_handler = new DynamicChartHandler(config={
         chart: chart,
         bounding_area:document.getElementById('chart-div')
      },
      options={

      }
   );
   ```


## DynamicChart Attributes

| Name               | Type                        | Description                              |
|--------------------|-----------------------------|------------------------------------------|
| `config`     | `Object`                    | The mandatory settings for DynamicChart        |
| `options`    | `Object`                    | The optional settings for DynamicChartHandler  |

## DynamicChart config

| Name               | Type                        | Description                                                              |
|--------------------|-----------------------------|--------------------------------------------------------------------------|
| `ctx`              | `CanvasRenderingContext2D`  | The rendering context for the chart, required for drawing on the canvas. |
| `datasets`         | `Array`                     | The array of datasets used to render the chart.                          |
| `chart_config`     | `Object`                    | Configuration options defining the chart's behavior and appearance.      |



## DynamicChart options

| Name               | Type    | Description                                                                                             |
|--------------------|---------|---------------------------------------------------------------------------------------------------------|
| `min_data_points`    | `Number` | The minimum number of data points that can be displayed on the chart                                 |
| `max_data_points`    | `Number` | The maximum number of data points that can be displayed on the chart                                 |
| `function`            | `function` | A custom function to dynamically modify chart datasets or behavior must return `chart, datasets`. |


## DynamicChartHandler

| Name               | Type                     | Description                                                   |
|--------------------|--------------------------|---------------------------------------------------------------|
| `config`           | `Object`                 | The mandatory settings for DynamicChartHandler                |
| `options`          | `DynamicChart`           | The optional settings for DynamicChartHandler                 |


## DynamicChartHandler config

| Name               | Type                     | Description                                                                                  |
|--------------------|--------------------------|----------------------------------------------------------------------------------------------|
| `charts`           | `Array<DynamicChart>`     | An array of DynamicChart instances cannot, be used with chart                               |
| `chart`            | `DynamicChart`            | A DynamicChart instance, cannot be used with charts                                         |
| `bounding_area`    | `DOM Element`             | A DOM element with a `getBoundingClientRect` method, used to define the chart's boundaries. |

## DynamicChartHandler options

| Name                   | Type     | Description                                                      |
|------------------------|----------|------------------------------------------------------------------|
| `handlerType`          | `String` | Choose between "multichart" and "singlechart".                   |
| `start_from`           | `String` | Determines where to start the chart data from: "start" or "end". |
| `can_pan`              | `Boolean`| Enable or disable panning functionality.                         |
| `can_zoom`             | `Boolean`| Enable or disable zoom functionality.                            |
| `initial_fov`          | `Number` | Set the initial field of view (FOV) for the chart.               |
| `min_fov`              | `Number` | Set the minimum allowable FOV.                                   |
| `max_fov`              | `Number` | Set the maximum allowable FOV.                                   |
| `pan_speed_multiplier` | `Number` | Adjust the speed of panning.                                     |
| `zoom_factor`          | `Number` | Set the zoom factor for zooming functionality.                   |
| `fps`                  | `Number` | Set the FPS limit for chart rendering.                           |

   

**For Samples explore the main.html file in example/main.html**




