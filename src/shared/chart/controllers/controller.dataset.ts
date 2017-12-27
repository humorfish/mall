import {CoreHelper} from '../core/core.helper';

export class ControllerDataset
{
    constructor(public helper: CoreHelper)
    {

    }

    ArrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

    /**
     * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
     * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
     * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
     */
    ListenArrayEvents(array: any, listener: any)
    {
        if (array._chartjs)
        {
            array._chartjs.listeners.push(listener);
            return;
        }
        // let Self = this;
        // Object.defineProperty(array, '_chartjs', {
        //     configurable: true,
        //     enumerable: false,
        //     value: {
        //         listeners: [listener]
        //     }
        // });

        // this.ArrayEvents.forEach((key) => {
        //     let method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
        //     let base = array[key];

        //     Object.defineProperty(array, key, {
        //         configurable: true,
        //         enumerable: false,
        //         value: () => {
        //             let args = Array.prototype.slice.call(arguments);
        //             let res = base.apply(this, args);

        //             Self.helper.Each(array._chartjs.listeners, (object: any) => {
        //                 if (typeof object[method] === 'function')
        //                 {
        //                     object[method].apply(object, args);
        //                 }
        //             });

        //             return res;
        //         }
        //     });
        // });
    }

    /**
     * Removes the given array event listener and cleanup extra attached properties (such as
     * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
     */
    UnlistenArrayEvents(array: any, listener: any)
    {
        let stub = array._chartjs;
        if (!stub)
        {
            return;
        }

        let listeners = stub.listeners;
        let index = listeners.indexOf(listener);
        if (index !== -1)
        {
            listeners.splice(index, 1);
        }

        if (listeners.length > 0)
        {
            return;
        }

        this.ArrayEvents.forEach((key) => {
            delete array[key];
        });

        delete array._chartjs;
    }

    /**
     * Element type used to generate a meta dataset (e.g. Chart.element.Line).
     * @type {Chart.core.element}
     */
    datasetElementType: any = null;

    /**
     * Element type used to generate a meta data (e.g. Chart.element.Point).
     * @type {Chart.core.element}
     */
    dataElementType: any = null;

    Initialize(chart: any, datasetIndex: number)
    {
        this.Chart = chart;
        this.Index = datasetIndex;
        this.LinkScales();
        this.AddElements();
    }

    UpdateIndex(datasetIndex: number)
    {
        this.Index = datasetIndex;
    }

    LinkScales()
    {
        let meta = this.GetMeta();
        let dataset = this.GetDataset();

        if (meta.xAxisID === null || !(meta.xAxisID in this.Chart.scales))
        {
            meta.xAxisID = dataset.xAxisID || this.Chart.options.scales.xAxes[0].id;
        }
        if (meta.yAxisID === null || !(meta.yAxisID in this.Chart.scales))
        {
            meta.yAxisID = dataset.yAxisID || this.Chart.options.scales.yAxes[0].id;
        }
    }

    GetDataset()
    {
        return this.Chart.data.datasets[this.Index];
    }

    GetMeta()
    {
        return this.Chart.getDatasetMeta(this.Index);
    }

    GetScaleForId(scaleID: any)
    {
        return this.Chart.scales[scaleID];
    }

    Reset()
    {
        this.Update(true);
    }

    Update(reset: boolean)
    {
        let meta = this.GetMeta();
        let line = meta.dataset;
        let points = meta.data || [];
        let options = this.Chart.options;
        let lineElementOptions = options.elements.line;
        let scale = this.GetScaleForId(meta.yAxisID);
        let i, ilen, custom;
        let dataset = this.GetDataset();
        let showLine = this.LineEnabled(dataset, options);

        // Update Line
        if (showLine)
        {
            custom = line.custom || {};

            // Compatibility: If the properties are defined with only the old name, use those values
            if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
                dataset.lineTension = dataset.tension;
            }

            // Utility
            line._scale = scale;
            line._datasetIndex = this.Index;
            // Data
            line._children = points;
            // Model
            line._model = {
                // Appearance
                // The default behavior of lines is to break at null values, according
                // to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
                // This option gives lines the ability to span gaps
                spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
                tension: custom.tension ? custom.tension : this.helper.GetValueOrDefault(dataset.lineTension, lineElementOptions.tension),
                backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
                borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
                borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
                borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
                borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
                borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
                borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
                fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
                steppedLine: custom.steppedLine ? custom.steppedLine : this.helper.GetValueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
                cubicInterpolationMode: custom.cubicInterpolationMode ? custom.cubicInterpolationMode : this.helper.GetValueOrDefault(dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode),
            };

            line.pivot();
        }

        // Update Points
        for (i = 0, ilen = points.length; i < ilen; ++i)
        {
            this.UpdateElement(points[i], i, reset);
        }

        if (showLine && line._model.tension !== 0)
        {
            this.UpdateBezierControlPoints();
        }

        // Now pivot the point for animation
        for (i = 0, ilen = points.length; i < ilen; ++i)
        {
            points[i].pivot();
        }
    }

    LineEnabled(dataset: any, options: any): boolean
    {
        return this.helper.GetValueOrDefault(dataset.showLine, options.showLines);
    }

    UpdateBezierControlPoints()
    {
        let meta = this.GetMeta();
        let area = this.Chart.chartArea;
        let points = (meta.data || []);
        let i, ilen, point, model, controlPoints;

        // Only consider points that are drawn in case the spanGaps option is used
        if (meta.dataset._model.spanGaps)
        {
            points = points.filter((pt: any) => {
                return !pt._model.skip;
            });
        }

        function CapControlPoint(pt: number, min: number, max: number)
        {
            return Math.max(Math.min(pt, max), min);
        }

        if (meta.dataset._model.cubicInterpolationMode === 'monotone')
        {
            this.helper.SplineCurveMonotone(points);
        }
        else
        {
            for (i = 0, ilen = points.length; i < ilen; ++i)
            {
                point = points[i];
                model = point._model;
                controlPoints = this.helper.SplineCurve(
                    this.helper.PreviousItem(points, i)._model,
                    model,
                    this.helper.NextItem(points, i)._model,
                    meta.dataset._model.tension
                );
                model.controlPointPreviousX = controlPoints.previous.x;
                model.controlPointPreviousY = controlPoints.previous.y;
                model.controlPointNextX = controlPoints.next.x;
                model.controlPointNextY = controlPoints.next.y;
            }
        }

        if (this.Chart.options.elements.line.capBezierPoints)
        {
            for (i = 0, ilen = points.length; i < ilen; ++i)
            {
                model = points[i]._model;
                model.controlPointPreviousX = CapControlPoint(model.controlPointPreviousX, area.left, area.right);
                model.controlPointPreviousY = CapControlPoint(model.controlPointPreviousY, area.top, area.bottom);
                model.controlPointNextX = CapControlPoint(model.controlPointNextX, area.left, area.right);
                model.controlPointNextY = CapControlPoint(model.controlPointNextY, area.top, area.bottom);
            }
        }
    }

    /**
     * @private
     */
    Destroy()
    {
        if (this.Data)
        {
            this.UnlistenArrayEvents(this.Data, this);
        }
    }

    CreateMetaDataset()
    {
        let type = this.datasetElementType;
        return type && new type({
            _chart: this.Chart,
            _datasetIndex: this.Index
        });
    }

    CreateMetaData(Index: number)
    {
        let type = this.dataElementType;
        return type && new type({
            _chart: this.Chart,
            _datasetIndex: this.Index,
            _index: Index
        });
    }

    AddElements()
    {
        let meta = this.GetMeta();
        let data = this.GetDataset().data || [];
        let metaData = meta.data;
        let i, ilen;

        for (i = 0, ilen = data.length; i < ilen; ++i)
        {
            metaData[i] = metaData[i] || this.CreateMetaData(i);
        }

        meta.dataset = meta.dataset || this.CreateMetaDataset();
    }

    AddElementAndReset(index: number)
    {
        let element = this.CreateMetaData(index);
        this.GetMeta().data.splice(index, 0, element);
        this.UpdateElement(element, index, true);
    }

    UpdateElement(point: any, index: number, reset: boolean)
    {
        let meta = this.GetMeta();
        let custom = point.custom || {};
        let dataset = this.GetDataset();
        let datasetIndex = this.Index;
        let value = dataset.data[index];
        let yScale = this.GetScaleForId(meta.yAxisID);
        let xScale = this.GetScaleForId(meta.xAxisID);
        let pointOptions = this.Chart.options.elements.point;
        let x, y;

        // Compatibility: If the properties are defined with only the old name, use those values
        if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined))
        {
            dataset.pointRadius = dataset.radius;
        }
        if ((dataset.hitRadius !== undefined) && (dataset.pointHitRadius === undefined))
        {
            dataset.pointHitRadius = dataset.hitRadius;
        }

        x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex);
        y = reset ? yScale.getBasePixel() : this.CalculatePointY(value, index, datasetIndex);

        // Utility
        point._xScale = xScale;
        point._yScale = yScale;
        point._datasetIndex = datasetIndex;
        point._index = index;

        // Desired view properties
        point._model = {
            x: x,
            y: y,
            skip: custom.skip || isNaN(x) || isNaN(y),
            // Appearance
            radius: custom.radius || this.helper.GetValueAtIndexOrDefault(dataset.pointRadius, index, pointOptions.radius),
            pointStyle: custom.pointStyle || this.helper.GetValueAtIndexOrDefault(dataset.pointStyle, index, pointOptions.pointStyle),
            backgroundColor: this.GetPointBackgroundColor(point, index),
            borderColor: this.GetPointBorderColor(point, index),
            borderWidth: this.GetPointBorderWidth(point, index),
            tension: meta.dataset._model ? meta.dataset._model.tension : 0,
            steppedLine: meta.dataset._model ? meta.dataset._model.steppedLine : false,
            // Tooltip
            hitRadius: custom.hitRadius || this.helper.GetValueAtIndexOrDefault(dataset.pointHitRadius, index, pointOptions.hitRadius)
        };
    }

    GetPointBorderColor(point: any, index: number)
    {
        let borderColor = this.Chart.options.elements.point.borderColor;
        let dataset = this.GetDataset();
        let custom = point.custom || {};

        if (custom.borderColor)
        {
            borderColor = custom.borderColor;
        }
        else if (dataset.pointBorderColor)
        {
            borderColor = this.helper.GetValueAtIndexOrDefault(dataset.pointBorderColor, index, borderColor);
        }
        else if (dataset.borderColor)
        {
            borderColor = dataset.borderColor;
        }

        return borderColor;
    }

    GetPointBorderWidth(point: any, index: number): number
    {
        let borderWidth = this.Chart.options.elements.point.borderWidth;
        let dataset = this.GetDataset();
        let custom = point.custom || {};

        if (!isNaN(custom.borderWidth)) {
            borderWidth = custom.borderWidth;
        } else if (!isNaN(dataset.pointBorderWidth) || this.helper.IsArray(dataset.pointBorderWidth))
        {
            borderWidth = this.helper.GetValueAtIndexOrDefault(dataset.pointBorderWidth, index, borderWidth);
        }
        else if (!isNaN(dataset.borderWidth))
        {
            borderWidth = dataset.borderWidth;
        }

        return borderWidth;
    }

    CalculatePointY(value: any, index: number, datasetIndex: number)
    {
        let chart = this.Chart;
        let meta = this.GetMeta();
        let yScale = this.GetScaleForId(meta.yAxisID);
        let sumPos = 0;
        let sumNeg = 0;
        let i, ds, dsMeta;

        if (yScale.options.stacked)
        {
            for (i = 0; i < datasetIndex; i++)
            {
                ds = chart.data.datasets[i];
                dsMeta = chart.getDatasetMeta(i);
                if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i))
                {
                    let stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
                    if (stackedRightValue < 0)
                    {
                        sumNeg += stackedRightValue || 0;
                    }
                    else
                    {
                        sumPos += stackedRightValue || 0;
                    }
                }
            }

            let rightValue = Number(yScale.getRightValue(value));
            if (rightValue < 0)
            {
                return yScale.getPixelForValue(sumNeg + rightValue);
            }
            return yScale.getPixelForValue(sumPos + rightValue);
        }

        return yScale.getPixelForValue(value);
    }

    GetPointBackgroundColor(point: any, index: number): any
    {
        let backgroundColor = this.Chart.options.elements.point.backgroundColor;
        let dataset = this.GetDataset();
        let custom = point.custom || {};

        if (custom.backgroundColor)
        {
            backgroundColor = custom.backgroundColor;
        }
        else if (dataset.pointBackgroundColor)
        {
            backgroundColor = this.helper.GetValueAtIndexOrDefault(dataset.pointBackgroundColor, index, backgroundColor);
        }
        else if (dataset.backgroundColor)
        {
            backgroundColor = dataset.backgroundColor;
        }

        return backgroundColor;
    }

    BuildOrUpdateElements()
    {
        let dataset = this.GetDataset();
        let data = dataset.data || (dataset.data = []);

        // In order to correctly handle data addition/deletion animation (an thus simulate
        // real-time charts), we need to monitor these data modifications and synchronize
        // the internal meta data accordingly.
        if (this.Data !== data)
        {
            if (this.Data)
            {
                // This case happens when the user replaced the data array instance.
                this.UnlistenArrayEvents(this.Data, this);
            }

            this.ListenArrayEvents(data, this);
            this.Data = data;
        }

        // Re-sync meta data in case the user replaced the data array or if we missed
        // any updates and so make sure that we handle number of datapoints changing.
        this.ResyncElements();
    }

    update = this.helper.Noop();

    Transition(easingValue: any)
    {
        let meta = this.GetMeta();
        let elements = meta.data || [];
        let ilen = elements.length;
        let i = 0;

        for (; i < ilen; ++i)
        {
            elements[i].transition(easingValue);
        }

        if (meta.dataset)
        {
            meta.dataset.transition(easingValue);
        }
    }

    Draw()
    {
        let meta = this.GetMeta();
        let elements = meta.data || [];
        let ilen = elements.length;
        let i = 0;

        if (meta.dataset)
        {
            meta.dataset.draw();
        }

        for (; i < ilen; ++i)
        {
            elements[i].draw();
        }
    }

    RemoveHoverStyle(element: any, elementOpts: any)
    {
        let dataset = this.Chart.data.datasets[element._datasetIndex];
        let index = element._index;
        let custom = element.custom || {};
        let valueOrDefault = this.helper.GetValueAtIndexOrDefault;
        let model = element._model;

        model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
        model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
        model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);
    }

    SetHoverStyle(element: any)
    {
        let dataset = this.Chart.data.datasets[element._datasetIndex];
        let index = element._index;
        let custom = element.custom || {};
        let valueOrDefault = this.helper.GetValueAtIndexOrDefault;
        let getHoverColor = this.helper.GetHoverColor;
        let model = element._model;

        model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueOrDefault(dataset.hoverBackgroundColor, index, getHoverColor(model.backgroundColor));
        model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : valueOrDefault(dataset.hoverBorderColor, index, getHoverColor(model.borderColor));
        model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : valueOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
    }

    /**
     * @private
     */
    ResyncElements()
    {
        let meta = this.GetMeta();
        let data = this.GetDataset().data;
        let numMeta = meta.data.length;
        let numData = data.length;

        if (numData < numMeta)
        {
            meta.data.splice(numData, numMeta - numData);
        }
        else if (numData > numMeta)
        {
            this.InsertElements(numMeta, numData - numMeta);
        }
    }

    /**
     * @private
     */
    InsertElements(start: number, count: number)
    {
        for (let i = 0; i < count; ++i)
        {
            this.AddElementAndReset(start + i);
        }
    }

    /**
     * @private
     */
    OnDataPush()
    {
        this.InsertElements(this.GetDataset().data.length - 1, arguments.length);
    }

    /**
     * @private
     */
    OnDataPop()
    {
        this.GetMeta().data.pop();
    }

    /**
     * @private
     */
    OnDataShift()
    {
        this.GetMeta().data.shift();
    }

    /**
     * @private
     */
    OnDataSplice(start: any, count: any)
    {
        this.GetMeta().data.splice(start, count);
        this.InsertElements(start, arguments.length - 2);
    }

    /**
     * @private
     */
    OnDataUnshift()
    {
        this.InsertElements(0, arguments.length);
    }

    Data: any;
    Chart: any;
    Index: number;
}
