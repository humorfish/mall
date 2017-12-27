import {CoreHelper} from './core.helper';

export class Interaction
{
    constructor(private helper: CoreHelper)
    {

    }

    /**
     * Helper function to get relative position for an event
     * @param {Event|IEvent} event - The event to get the position for
     * @param {Chart} chart - The chart
     * @returns {Point} the event position
     */
    GetRelativePosition(e: any, chart: any)
    {
        if (e.native)
        {
            return {
                x: e.x,
                y: e.y
            };
        }

        return this.helper.GetRelativePosition(e, chart);
    }

    /**
     * Helper function to traverse all of the visible elements in the chart
     * @param chart {chart} the chart
     * @param handler {Function} the callback to execute for each visible item
     */
    ParseVisibleItems(chart: any, handler: any)
    {
        let datasets = chart.data.datasets;
        let meta, i, j, ilen, jlen;

        for (i = 0, ilen = datasets.length; i < ilen; ++i)
        {
            if (!chart.isDatasetVisible(i))
            {
                continue;
            }

            meta = chart.getDatasetMeta(i);
            for (j = 0, jlen = meta.data.length; j < jlen; ++j)
            {
                let element = meta.data[j];
                if (!element._view.skip)
                {
                    handler(element);
                }
            }
        }
    }

    /**
     * Helper function to get the items that intersect the event position
     * @param items {ChartElement[]} elements to filter
     * @param position {Point} the point to be nearest to
     * @return {ChartElement[]} the nearest items
     */
    GetIntersectItems(chart: any, position: any)
    {
        let elements: any[] = [];

        this.ParseVisibleItems(chart, (element: any) => {
            if (element.inRange(position.x, position.y))
            {
                elements.push(element);
            }
        });

        return elements;
    }

    /**
     * Helper function to get the items nearest to the event position considering all visible items in teh chart
     * @param chart {Chart} the chart to look at elements from
     * @param position {Point} the point to be nearest to
     * @param intersect {Boolean} if true, only consider items that intersect the position
     * @param distanceMetric {Function} function to provide the distance between points
     * @return {ChartElement[]} the nearest items
     */
    GetNearestItems(chart: any, position: any, intersect: boolean, distanceMetric: any)
    {
        let minDistance = Number.POSITIVE_INFINITY;
        let nearestItems: any[] = [];

        this.ParseVisibleItems(chart, (element: any) => {
            if (intersect && !element.inRange(position.x, position.y))
            {
                return;
            }

            let center = element.getCenterPoint();
            let distance = distanceMetric(position, center);

            if (distance < minDistance)
            {
                nearestItems = [element];
                minDistance = distance;
            }
            else if (distance === minDistance)
            {
                // Can have multiple items at the same distance in which case we sort by size
                nearestItems.push(element);
            }
        });

        return nearestItems;
    }

    /**
     * Get a distance metric function for two points based on the
     * axis mode setting
     * @param {String} axis the axis mode. x|y|xy
     */
    GetDistanceMetricForAxis(axis: string)
    {
        let useX = axis.indexOf('x') !== -1;
        let useY = axis.indexOf('y') !== -1;

        return (pt1: any, pt2: any) => {
            let deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
            let deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        };
    }

    IndexMode(chart: any, e: any, options: any)
    {
        let position = this.GetRelativePosition(e, chart);
        // Default axis for index mode is 'x' to match old behaviour
        options.axis = options.axis || 'x';
        let distanceMetric = this.GetDistanceMetricForAxis(options.axis);
        let items = options.intersect ? this.GetIntersectItems(chart, position) : this.GetNearestItems(chart, position, false, distanceMetric);
        let elements: any[] = [];

        if (!items.length)
        {
            return [];
        }

        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
            if (chart.isDatasetVisible(datasetIndex))
            {
                let meta = chart.getDatasetMeta(datasetIndex);
                let element = meta.data[items[0]._index];

                // don't count items that are skipped (null data)
                if (element && !element._view.skip)
                {
                    elements.push(element);
                }
            }
        });

        return elements;
    }

    Single(chart: any, e: any)
    {
        let position = this.GetRelativePosition(e, chart);
        let elements: any[] = [];

        this.ParseVisibleItems(chart, (element: any) => {
            if (element.inRange(position.x, position.y)) {
                elements.push(element);
                return elements;
            }
        });

        return elements.slice(0, 1);
    }

    /**
     * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
     * If the options.intersect is false, we find the nearest item and return the items in that dataset
     * @function Chart.Interaction.modes.dataset
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use during interaction
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    Dataset(chart: any, e: any, options: any)
    {
        let position = this.GetRelativePosition(e, chart);
        options.axis = options.axis || 'xy';
        let distanceMetric = this.GetDistanceMetricForAxis(options.axis);
        let items = options.intersect ? this.GetIntersectItems(chart, position) : this.GetNearestItems(chart, position, false, distanceMetric);

        if (items.length > 0)
        {
            items = chart.getDatasetMeta(items[0]._datasetIndex).data;
        }

        return items;
    }

    /**
     * @function Chart.Interaction.modes.x-axis
     * @deprecated since version 2.4.0. Use index mode and intersect == true
     * @todo remove at version 3
     * @private
     */
    'x-axis'(chart: any, e: any)
    {
        return this.IndexMode(chart, e, {intersect: false});
    }

    /**
     * Point mode returns all elements that hit test based on the event position
     * of the event
     * @function Chart.Interaction.modes.intersect
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    Point(chart: any, e: any)
    {
        let position = this.GetRelativePosition(e, chart);
        return this.GetIntersectItems(chart, position);
    }

    /**
     * nearest mode returns the element closest to the point
     * @function Chart.Interaction.modes.intersect
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    Nearest(chart: any, e: any, options: any)
    {
        let position = this.GetRelativePosition(e, chart);
        options.axis = options.axis || 'xy';
        let distanceMetric = this.GetDistanceMetricForAxis(options.axis);
        let nearestItems = this.GetNearestItems(chart, position, options.intersect, distanceMetric);

        // We have multiple items at the same distance from the event. Now sort by smallest
        if (nearestItems.length > 1)
        {
            nearestItems.sort((a, b) => {
                let sizeA = a.getArea();
                let sizeB = b.getArea();
                let ret = sizeA - sizeB;

                if (ret === 0) {
                    // if equal sort by dataset index
                    ret = a._datasetIndex - b._datasetIndex;
                }

                return ret;
            });
        }

        // Return only 1 item
        return nearestItems.slice(0, 1);
    }

    /**
     * x mode returns the elements that hit-test at the current x coordinate
     * @function Chart.Interaction.modes.x
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    x(chart: any, e: any, options: any)
    {
        let position = this.GetRelativePosition(e, chart);
        let items: any[] = [];
        let intersectsItem = false;

        this.ParseVisibleItems(chart, (element: any) => {
            if (element.inXRange(position.x))
            {
                items.push(element);
            }

            if (element.inRange(position.x, position.y))
            {
                intersectsItem = true;
            }
        });

        // If we want to trigger on an intersect and we don't have any items
        // that intersect the position, return nothing
        if (options.intersect && !intersectsItem)
        {
            items = [];
        }
        return items;
    }

    /**
     * y mode returns the elements that hit-test at the current y coordinate
     * @function Chart.Interaction.modes.y
     * @param chart {chart} the chart we are returning items from
     * @param e {Event} the event we are find things at
     * @param options {IInteractionOptions} options to use
     * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
     */
    y(chart: any, e: any, options: any)
    {
        let position = this.GetRelativePosition(e, chart);
        let items: any[] = [];
        let intersectsItem = false;

        this.ParseVisibleItems(chart, (element: any) => {
            if (element.inYRange(position.y))
            {
                items.push(element);
            }

            if (element.inRange(position.x, position.y))
            {
                intersectsItem = true;
            }
        });

        // If we want to trigger on an intersect and we don't have any items
        // that intersect the position, return nothing
        if (options.intersect && !intersectsItem)
        {
            items = [];
        }
        return items;
    }
}
