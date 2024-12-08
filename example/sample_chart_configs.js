const colors = {
    'fadegreen': 'rgba(70, 203, 65, 0.8)',
    'fadered': 'rgba(255, 99, 132, 0.8)',
    'ticks': '#ffffff',
    'grid': 'rgba(255, 255, 255, 0.2)'
}


function line_config(datasets, options) {

    return {
        type: 'line',
        data: {
            datasets: datasets
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


function bar_config(datasets, options) {

    return {
        type: 'bar',
        data: {
            datasets: datasets
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