function generateRandomData(length, initialValue = 100, volatility = 10, trend = 0.1, randomTrendVolatility = 0.05) {
    const data = [];
    let currentValue = initialValue;
  
    for (let i = 0; i < length; i++) {
      const randomChange = Math.random() * volatility * 2 - volatility;
      const trendChange = trend + (Math.random() * randomTrendVolatility * 2 - randomTrendVolatility);
      currentValue += randomChange + trendChange;
      data.push({ x: `${i}`, y: currentValue });
    }
  
    return data;
}


function create_line_dataset(label, data, color) {
    return {
        label: label,
        data: data,
        backgroundColor: color,
        type: 'line',
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.05
    }
}


function create_bar_dataset(label, data, color) {
    return {
        label: label,
        data: data,
        backgroundColor: color,
        borderWidth: 1,
        barThickness: 'flex', 
        categoryPercentage: 1.0,
        barPercentage: 0.9,
    }
}


function buildInnerText(name, chart, bounding_area, options=null) {
    if (options) {
        return `
                    ${name} = new DynamicChartHandler({
                        ${chart},
                        bounding_area: document.getElementById('${bounding_area}')
                    }, {
                        start_from: '${options.start_from}',
                        can_pan: ${options.can_pan},
                        can_zoom: ${options.can_zoom},
                        initial_fov: ${options.initial_fov},
                        min_fov: ${options.min_fov},
                        max_fov: ${options.max_fov},
                        pan_speed_multiplier: ${options.pan_speed_multiplier},
                        zoom_factor: ${options.zoom_factor},
                        fps: ${options.fps}
                    });
                `;
    } else {
        return `
                    ${name} = new DynamicChartHandler({
                        ${chart},
                        bounding_area: document.getElementById('${bounding_area}')
                    });
                `;
    }
}


function edit_options() {
    if (chart_handler){
        chart_handler.destroy();
        chart_handler = null;
    }
    if (chart1_handler) {
        chart1_handler.destroy(); 
        chart2_handler.destroy(); 
        chart1_handler = null;
        chart2_handler = null;
    }
    {
        const options = {
            start_from: start_from_select.value,
            can_pan: can_pan_select.value === 'true',
            can_zoom: can_zoom_select.value === 'true',
            initial_fov: parseInt(initial_fov_input.value),
            min_fov: parseInt(min_fov_input.value),
            max_fov: parseInt(max_fov_input.value),
            pan_speed_multiplier: parseFloat(pan_speed_multiplier_input.value),
            zoom_factor: parseFloat(zoom_factor_input.value),
            fps: parseInt(fps_input.value)
        };

        
        if (handler_type_select.value === 'singlechart') {
            chart1_handler = new DynamicChartHandler(chart1_config, options); 
            chart2_handler = new DynamicChartHandler(chart2_config, options); 
            currentBuild.innerText = `${buildInnerText('chart1_handler', 'chart: chart1', 'document.getElementById("chart1-div")', options)}
                                        ${buildInnerText('chart2_handler', 'chart: chart2', 'document.getElementById("chart2-div")', options)}`
        } 
        else {
            chart_handler = new DynamicChartHandler(multichart_config, options); 
            currentBuild.innerText = buildInnerText('chart_handler', 'charts: charts', 'document.getElementById("chart_area")', options)
        }
    }
}
