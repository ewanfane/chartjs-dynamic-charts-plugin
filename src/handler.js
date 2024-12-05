class DynamicChart {
    constructor(ctx=null, data=null, chart_config=null, chart_options={}) {
        this.ctx = ctx;
        this.data = data;
        this.chart_config = chart_config;
        this.chart_options = chart_options;
        this.data_length = data.length;

        this.initial_data_points = chart_options.initial_data_points || null;
        this.min_data_points = chart_options.min_data_points || null;
        this.max_data_points = chart_options.max_data_points || null;
        this.validateConstructor();
    }

    validateConstructor() {
        if (!this.ctx || !this.data || !this.chart_config) {
          throw new Error('Missing mandatory arguments. ctx, data, and chart_config are required for DynamicChart.');
        }
      
        if (!Array.isArray(this.data)) {
          throw new TypeError('data argument must be an array.');
        }

        if (this.min_data_points < 1) {
          throw new RangeError('min_data_points must be greater than 0');
        }
        if (this.max_data_points > this.data_length) {
          throw new RangeError('max_data_points must not exceed the length of the dataset');
        }
    }
}


class DynamicChartHandler {
    constructor(config = {}, options = {}) {
        this.charts = config.charts || null;
        this.chart = config.chart || null;
        this.bounding_area = config.bounding_area || null;

        this.initial_fov = options.initial_fov || 0;
        this.min_fov = options.min_fov || 0;
        this.max_fov = options.max_fov || 0;
        this.start_from = options.start_from || 'end';
        this.can_pan = options.can_pan ?? true;
        this.can_zoom = options.can_zoom ?? true;
        this.pan_speed_multiplier = options.pan_speed_multiplier || 1;
        this.zoom_factor = options.zoom_factor || 0.1;
        this.fps = options.fps || 60;

        this.is_panning = false;
        this.width = 0;
        this.pan_start_x = 0;
        this.index = 0;
        this.visible_range = {};

        this.prevTouchDistance = 0;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.init();
        this.drawChart = this.throttle(this.drawChart.bind(this), this.fps); 
        this.drawChart();
    }

    update_options(options) {
        for (const key in options) {
            if (this[key] !== options[key]) {
                this[key] = options[key];
            }
        }

        this.drawChart = this.throttle(this.drawChart.bind(this), this.fps);
        this.drawChart();
    }

    init() {
        this.createIndex();
        this.validateConstructor();
        if (this.start_from === 'end') {
            this.visible_range = { start: Math.max(this.index - this.initial_fov, 0), end: this.index };
        } else if (this.start_from === 'start') {
            this.visible_range = { start: 0, end: Math.min(this.index, this.initial_fov) };
        }
        if (this.chart) {
            this.charts = [this.chart];
            this.chart = null;
        }
        this.width = this.bounding_area.getBoundingClientRect().width;

        
        if (this.visible_range.start === this.visible_range.end) {
            this.visible_range = { start: 0, end: this.initial_fov };
        }

        this.addEventListeners();
    }

    validateConstructor() {
        if ((!this.charts || !this.chart) && !this.bounding_area ) {
            throw new Error('Missing mandatory arguments. DynamicChartHandler requires (chart or charts) and bounding_area).');
        }

        if (!Array.isArray(this.charts) && this.charts) {
            throw new TypeError('charts argument must be an array.');
        }

        if (this.initial_fov < this.min_fov || this.initial_fov > this.max_fov) {
            throw new RangeError('initial_fov must be between min_fov and max_fov');
        }

        if (this.min_fov > this.max_fov) {
            throw new RangeError('min_fov must be less than or equal to max_fov');
        }

        if (this.charts) {
            for (const chart of this.charts) {
                if (!(chart instanceof DynamicChart)) {
                    throw new TypeError('All charts in the array must be instances of DynamicChart.');
                }
            }
        }

        if (this.chart) {
            if (!(this.chart instanceof DynamicChart)) {
                throw new TypeError('chart expects a single instance of DynamicChart.');
            }
        }

        if (this.zoom_factor > 1 || this.zoom_factor < 0) {
            throw new RangeError('zoom_factor must be in the range 0-1');
        }

        if (typeof this.can_pan !== 'boolean' || typeof this.can_zoom !== 'boolean') {
            throw new TypeError('can_pan and can_zoom must be boolean values (true, false)');
        }

        if (typeof this.bounding_area.getBoundingClientRect !== 'function') {
            throw new TypeError('bounding_area must have a getBoundingClientRect method.');
        }

        if (this.chart && this.charts) {
            console.log(this.chart, this.charts);
            throw new Error('Cannot use both chart and charts in the same class');
        }
    }

    createIndex() {
            this.index = 100;
            if (this.initial_fov === 0) {
                this.initial_fov = 20;
            }
            if (this.max_fov === 0) {
                this.max_fov = 100;
            }
            if (this.min_fov === 0) {
                this.min_fov = 10;
            }
    }

    drawChart() {
        this.charts.forEach(chart => {
            const data_range = this.calculateVisibleRange(chart);
            if (!chart.chart) {
                
                chart.chart = new Chart(chart.ctx, chart.chart_config(chart.data.slice(...data_range)));
            } else {
                
                const newData = chart.data.slice(...data_range);

                if (newData.length > 0) {
                    chart.chart.data.datasets.forEach((dataset) => {
                        dataset.data = newData; 
                    });

                    chart.chart.update('none'); 
                } else {
                    console.warn("No data in the specified range to display.");
                }
            }
        });
    }

    handlePanning(panStep) {
        if (this.can_pan) {
            const rangeWidth = this.visible_range.end - this.visible_range.start;

            
            let newStart = this.visible_range.start - (panStep * this.pan_speed_multiplier);
            let newEnd = this.visible_range.end - (panStep * this.pan_speed_multiplier);

            
            newStart = Math.max(0, newStart);
            newEnd = Math.min(100, newEnd);

            
            if (newEnd - newStart < rangeWidth) {
                if (newStart === 0) {
                    newEnd = newStart + rangeWidth;
                } else if (newEnd === 100) {
                    newStart = newEnd - rangeWidth;
                }
            }

            this.visible_range.start = newStart;
            this.visible_range.end = newEnd;
            this.drawChart();
        }
    }

    handleZoom(zoomFactor) {
        if (this.can_zoom) {
    
            const currentRange = this.visible_range.end - this.visible_range.start;
            const newRange = Math.min(100, Math.max(this.min_fov, currentRange * zoomFactor));
            const center = (this.visible_range.start + this.visible_range.end) / 2;

            this.visible_range.start = Math.max(0, center - newRange / 2);
            this.visible_range.end = Math.min(100, center + newRange / 2);

            this.drawChart();
        }
    }

    throttle(func, fps) {
        const limit = 1000 / fps;
        let lastCall = 0;
        return function () {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                func.apply(this, arguments);
            }
        };
    }

    calculateVisibleRange(chart) {
        let start;
        let end;
        const clampedStart = Math.max(0, Math.min(100, this.visible_range.start));
        const clampedEnd = Math.max(0, Math.min(100, this.visible_range.end));

        start = Math.round(chart.data_length * (clampedStart / 100));
        end = Math.round(chart.data_length * (clampedEnd / 100));

        if (chart.min_fov) {
            if (end - start < chart.min_fov) {
                start = end - chart.min_fov;
                start = Math.max(0, start);
            }
        }
        if (chart.max_fov) {
            if (end - start > chart.max_fov) {
                end = start + chart.max_fov;
                end = Math.min(chart.data_length, end);
            }
        }

        return [start, end];
    }


    addEventListeners() {
        this.bounding_area.addEventListener('mousedown', this.handleMouseDown);
        this.bounding_area.addEventListener('mouseup', this.handleMouseUp);
        this.bounding_area.addEventListener('mouseleave', this.handleMouseLeave);
        this.bounding_area.addEventListener('mousemove', this.handleMouseMove);
        this.bounding_area.addEventListener('wheel', this.handleWheel, { passive: false });

        this.bounding_area.addEventListener('touchstart', this.handleTouchStart);
        this.bounding_area.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.bounding_area.addEventListener('touchend', this.handleTouchEnd);

        window.addEventListener('resize', this.handleResize);
    }

    removeEventListeners() {
        this.bounding_area.removeEventListener('mousedown', this.handleMouseDown);
        this.bounding_area.removeEventListener('mouseup', this.handleMouseUp);
        this.bounding_area.removeEventListener('mouseleave', this.handleMouseLeave);
        this.bounding_area.removeEventListener('mousemove', this.handleMouseMove);
        this.bounding_area.removeEventListener('wheel', this.handleWheel);

        this.bounding_area.removeEventListener('touchstart', this.handleTouchStart);
        this.bounding_area.removeEventListener('touchmove', this.handleTouchMove);
        this.bounding_area.removeEventListener('touchend', this.handleTouchEnd);

        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.width = this.bounding_area.getBoundingClientRect().width;
        this.drawChart();
    }

    handleMouseDown(e) {
        this.is_panning = true;
        this.pan_start_x = e.offsetX;
    }

    handleMouseUp() {
        this.is_panning = false;
    }

    handleMouseLeave() {
        this.is_panning = false;
    }

    handleMouseMove(e) {
        if (this.is_panning) {
            const deltaX = e.offsetX - this.pan_start_x;
            const panStep = Math.round(deltaX / (this.width / (this.visible_range.end - this.visible_range.start)));

            if (panStep !== 0) {
                this.handlePanning(panStep);
                this.pan_start_x = e.offsetX;
            }
        }
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 1 + this.zoom_factor : 1 - this.zoom_factor;
        this.handleZoom(zoomFactor);
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.is_panning = true;
            this.pan_start_x = e.touches[0].clientX;
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (this.is_panning && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - this.pan_start_x;
            const panStep = Math.floor(deltaX / (this.width / (this.visible_range.end - this.visible_range.start)));

            if (panStep !== 0) {
                this.handlePanning(panStep);
                this.pan_start_x = e.touches[0].clientX;
            }
        } else if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );

            if (this.prevTouchDistance) {
                const zoomFactor = distance < this.prevTouchDistance ? 1 + this.zoom_factor : 1 - this.zoom_factor;
                this.handleZoom(zoomFactor);
            }
            this.prevTouchDistance = distance;
        }
    }

    handleTouchEnd(e) {
        if (e.touches.length === 0) {
            this.is_panning = false;
            this.prevTouchDistance = 0;
        }
    }

    destroy() {
        this.removeEventListeners();
        if (this.charts) {
            this.charts.forEach(chart => {
                if (chart.chart) {
                    chart.chart.destroy();
                    chart.chart = null;
                }
            });
        }

        if (this.chart && this.chart.chart) {
            this.chart.chart.destroy();
            this.chart.chart = null;
        }

        this.charts = null;
        this.chart = null;
        this.bounding_area = null;
    }
}
