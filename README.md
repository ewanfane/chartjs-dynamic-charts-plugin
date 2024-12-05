# DynamicCharts Plugin

DynamicCharts is a customizable plugin for creating interactive, dynamic charts. This plugin integrates with the Chart.js library and provides enhanced functionality such as panning, zooming, customizable field of view (FOV), and the ability to manage multiple chart instances.

## Features

- **Multichart and Single Chart Support:** Create multiple charts using the same class.
- **Panning and Zooming:** Control chart interactions with the ability to pan and zoom.
- **Customizable Field of View (FOV):** Adjust the FOV for better data visibility and presentation.
- **FPS Control:** Set a frame rate limit to optimize performance.
- **Chart Configuration Options:** Extensive configuration options for customizing chart behaviors.

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
   var chart = new DynamicChart({
    ctx: document.getElementById('chart').getContext('2d'),
    data: data,
    chart_config: chartjs_chart_config_function,
    chart_options: options
    });
   ```

5. **Initialise DynamicChartHandler:**

   Create a DynamicChartHandler instance and pass the DynamicChart and a bounding area (this can be as simple as a div wrapping the canvas/s with an id)

   ```js
   const bounding_area = document.getElementById("chart-area");
   const chart_config={
            chart: chart,
            bounding_area:document.getElementById('chart-div')
        };
   let chart_handler = new DynamicChartHandler(chart_config);
   ```


## DynamicChart Attributes

| Name               | Type                        | Description                                                           |
|--------------------|-----------------------------|-----------------------------------------------------------------------|
| `ctx`              | `CanvasRenderingContext2D`   | The rendering context for the chart, required for drawing on the canvas. |
| `data`             | `Array`                     | The dataset used to render the chart. Must be an array.                |
| `chart_config`     | `Object`                    | Configuration options defining the chart's behavior and appearance.    |
| `chart_options`    | `Object`                    | Additional options for customizing the chart's functionality.          |
| `data_length`      | `Number`                    | The length of the dataset, automatically calculated based on the data array. |

## Chart Options

| Name               | Type    | Description                                      |
|--------------------|---------|--------------------------------------------------|
| `initial_data_points` | `Number` | `null`                                           |
| `min_data_points`    | `Number` | `null`                                           |
| `max_data_points`    | `Number` | `null`                                           |

## DynamicChartHandler Configuration Options

| Name               | Type                     | Description                                                   |
|--------------------|--------------------------|---------------------------------------------------------------|
| `charts`           | `Array<DynamicChart>`     | `null`                                                        |
| `chart`            | `DynamicChart`            | `null`                                                        |
| `bounding_area`    | `DOM Element`             | A DOM element with a `getBoundingClientRect` method, used to define the chart's boundaries. |

## Handler Options

| Name                   | Type     | Description                                      |
|------------------------|----------|--------------------------------------------------|
| `handlerType`          | `String` | Choose between "multichart" and "singlechart".   |
| `start_from`           | `String` | Determines where to start the chart data from: "start" or "end". |
| `can_pan`              | `Boolean`| Enable or disable panning functionality.         |
| `can_zoom`             | `Boolean`| Enable or disable zoom functionality.            |
| `initial_fov`          | `Number` | Set the initial field of view (FOV) for the chart. |
| `min_fov`              | `Number` | Set the minimum allowable FOV.                   |
| `max_fov`              | `Number` | Set the maximum allowable FOV.                   |
| `pan_speed_multiplier` | `Number` | Adjust the speed of panning.                     |
| `zoom_factor`          | `Number` | Set the zoom factor for zooming functionality.   |
| `fps`                  | `Number` | Set the FPS limit for chart rendering.           |

   

**For Samples explore the main.html file in example/main.html**




