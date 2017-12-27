import {CoreHelper} from '../core/core.helper';
import {ElementLine} from '../elements/element.line';
import {ControllerDataset} from './controller.dataset';

export class ControllerLine extends ControllerDataset
{
    constructor(public helper: CoreHelper)
    {
        super(helper);
    }

    datasetElementType: any = ElementLine.Line;
    dataElementType: any = ElementLine.Point;

    Draw()
    {
        let chart = this.Chart;
        let meta = this.GetMeta();
        let points = meta.data || [];
        let area = chart.chartArea;
        let ilen = points.length;

        this.helper.Canvas.ClipArea(chart.ctx, area);

        if (this.LineEnabled(this.GetDataset(), chart.options))
        {
            meta.dataset.draw();
        }

        this.helper.Canvas.UnclipArea(chart.ctx);

        // Draw the points
        for (let i = 0; i < ilen; ++i)
        {
            points[i].draw(area);
        }
    }

    SetHoverStyle(point: any)
    {
        // Point
        let dataset = this.Chart.data.datasets[point._datasetIndex];
        let index = point._index;
        let custom = point.custom || {};
        let model = point._model;

        model.radius = custom.hoverRadius || this.helper.GetValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.Chart.options.elements.point.hoverRadius);
        model.backgroundColor = custom.hoverBackgroundColor || this.helper.GetValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, this.helper.GetHoverColor(model.backgroundColor));
        model.borderColor = custom.hoverBorderColor || this.helper.GetValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, this.helper.GetHoverColor(model.borderColor));
        model.borderWidth = custom.hoverBorderWidth || this.helper.GetValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
    }

    RemoveHoverStyle(point: any)
    {
        let dataset = this.Chart.data.datasets[point._datasetIndex];
        let index = point._index;
        let custom = point.custom || {};
        let model = point._model;

        // Compatibility: If the properties are defined with only the old name, use those values
        if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined))
        {
            dataset.pointRadius = dataset.radius;
        }

        model.radius = custom.radius || this.helper.GetValueAtIndexOrDefault(dataset.pointRadius, index, this.Chart.options.elements.point.radius);
        model.backgroundColor = this.GetPointBackgroundColor(point, index);
        model.borderColor = this.GetPointBorderColor(point, index);
        model.borderWidth = this.GetPointBorderWidth(point, index);
    }
}
