const colors = {
    'fadegreen': 'rgba(70, 203, 65, 0.8)',
    'ticks': '#ffffff',
    'grid': 'rgba(255, 255, 255, 0.2)'
}


function line_config(chart_data) {

    return {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'RSI',
                    data: chart_data,
                    backgroundColor: colors.fadegreen,
                    type: 'line',
                    borderColor: colors.fadegreen,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.05
                },
            ]
        },
        options: {
            animations: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        display: true,
                        color: colors.ticks,
                    },
                    grid: {
                        color: colors.grid // Set grid color to faint white
                    },
                },
                y: {
                    position: 'right',
                    ticks: {
                        color: colors.ticks
                    },
                    grid: {
                        color: colors.grid
                    },
                }
            },
            plugins: {
                title: {
                    text: 'Sample Chart',
                    display: true,
                    color: colors.ticks,
                    font: {
                        size: 20
                    }
                },
                legend: {
                        display: false
                },
            }
        }
    }
}


function bar_config(chart_data) {

    return {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Sample',
                    data: chart_data,
                    backgroundColor: colors.fadegreen,
                    borderWidth: 1,
                    barThickness: 'flex', // Dynamically adjust bar thickness
                    categoryPercentage: 1.0, // Ensure the bars use the full category width
                    barPercentage: 0.9, // Adjust how much of the category width each bar occupies
                },
            ],
        },
        options: {
            animations: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        color: colors.ticks,
                    },
                    grid: {
                        color: colors.grid,
                    },
                },
                y: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        color: '#ffffff',
                    },
                    grid: {
                        color: colors.grid,
                    },
                },
            },
            plugins: {
                legend: false,
                title: {
                    text: 'Sample Chart',
                    display: true,
                    color: colors.ticks,
                    font: {
                        size: 20
                    }
                },
            },
        },
    };
}