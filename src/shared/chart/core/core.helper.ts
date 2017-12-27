import {THelpers} from '../tools/helpers';

export class CoreHelper extends THelpers
{
    // -- Basic js utility methods
    constructor(private Chart: any)
    {
        super();
    }

    ConfigMerge(/* objects ... */)
    {
        return this.Merge(this.Clone(arguments[0]), [].slice.call(arguments, 1), {
            merger: (key: string, target: any, source: any, options: any) => {
                let tval = target[key] || {};
                let sval = source[key];

                if (key === 'scales')
                {
                    // scale config merging is complex. Add our own function here for that
                    target[key] = this.ScaleMerge(tval, sval);
                }
                else if (key === 'scale')
                {
                    // used in polar area & radar charts since there is only one scale
                    target[key] = this.Merge(tval, [this.Chart.scaleService.getScaleDefaults(sval.type), sval]);
                }
                else
                {
                    this._Merger(key, target, source, options);
                }
            }
        });
    }

    ScaleMerge(...objects: Array<any>)
    {
        return this.Merge(this.Clone(objects[0]), [].slice.call(objects, 1),
        {
            merger: (key: string, target: any, source: any, options: any) => {
                if (key === 'xAxes' || key === 'yAxes')
                {
                    let slen = source[key].length;
                    let i, type, scale;

                    if (!target[key])
                    {
                        target[key] = [];
                    }

                    for (i = 0; i < slen; ++i)
                    {
                        scale = source[key][i];
                        type = this.GetValueOrDefault(scale.type, key === 'xAxes' ? 'category' : 'linear');

                        if (i >= target[key].length)
                        {
                            target[key].push({});
                        }

                        if (!target[key][i].type || (scale.type && scale.type !== target[key][i].type))
                        {
                            // new/untyped scale or type changed: let's apply the new defaults
                            // then merge source scale to correctly overwrite the defaults.
                            this.Merge(target[key][i], [this.Chart.scaleService.getScaleDefaults(type), scale]);
                        }
                        else
                        {
                            // scales type are the same
                            this.Merge(target[key][i], scale);
                        }
                    }
                }
                else
                {
                    this._Merger(key, target, source, options);
                }
            }
        });
    }

    Where(collection: any | Array<any>, filterCallback: any): Array<any>
    {
        if (this.IsArray(collection) && Array.prototype.filter)
        {
            return collection.filter(filterCallback);
        }

        let filtered: Array<any> = [];

        this.Each(collection, (item: any) =>
        {
            if (filterCallback(item))
            {
                filtered.push(item);
            }
        });

        return filtered;
    }

    FindIndex = Array.prototype.findIndex ?
        (array: Array<any>, callback: any, scope: Array<any>) => { return array.findIndex(callback, scope); } :
        (array: Array<any>, callback: any, scope: Array<any>) => {
            scope = scope === undefined ? array : scope;
            for (let i = 0, ilen = array.length; i < ilen; ++i)
            {
                if (callback.call(scope, array[i], i, array))
                {
                    return i;
                }
            }
            return -1;
        };

    FindNextWhere(arrayToSearch: Array<any>, filterCallback: Function, startIndex: number): any
    {
        // Default to start of the array
        if (this.IsNullOrUndef(startIndex))
        {
            startIndex = -1;
        }
        for (let i = startIndex + 1; i < arrayToSearch.length; i++)
        {
            let currentItem = arrayToSearch[i];
            if (filterCallback(currentItem))
            {
                return currentItem;
            }
        }
    }

    FindPreviousWhere(arrayToSearch: Array<any>, filterCallback: Function, startIndex: number): any
    {
        // Default to end of the array
        if (this.IsNullOrUndef(startIndex))
        {
            startIndex = arrayToSearch.length;
        }
        for (let i = startIndex - 1; i >= 0; i--)
        {
            let currentItem = arrayToSearch[i];
            if (filterCallback(currentItem))
            {
                return currentItem;
            }
        }
    }

    // -- Math methods
    IsNumber(n: any): boolean
    {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    AlmostEquals(x: number, y: number, epsilon: number): boolean
    {
        return Math.abs(x - y) < epsilon;
    }

    AlmostWhole(x: number, epsilon: number): boolean
    {
        let rounded = Math.round(x);
        return (((rounded - epsilon) < x) && ((rounded + epsilon) > x));
    }

    Max(array: Array<any>): any
    {
        return array.reduce(function(max, value)
        {
            if (!isNaN(value))
            {
                return Math.max(max, value);
            }
            return max;
        }, Number.NEGATIVE_INFINITY);
    }

    Min(array: Array<any>): any
    {
        return array.reduce(function(min, value)
        {
            if (!isNaN(value))
            {
                return Math.min(min, value);
            }
            return min;
        }, Number.POSITIVE_INFINITY);
    }

    Sign = Math.sign ?
        (x: number) => { return Math.sign(x); } :
        (x: number) => {
            x = +x; // convert to a number
            if (x === 0 || isNaN(x))
            {
                return x;
            }
            return x > 0 ? 1 : -1;
        };

    Log10 = Math.log10 ?
        (x: number) => { return Math.log10(x); } :
        (x: number) => { return Math.log(x) / Math.LN10; };

    ToRadians(degrees: number): number
    {
        return degrees * (Math.PI / 180);
    }

    ToDegrees(radians: number): number
    {
        return radians * (180 / Math.PI);
    }

    // Gets the angle from vertical upright to the point about a centre.
    GetAngleFromPoint(centrePoint: any, anglePoint: any): {}
    {
        let distanceFromXCenter = anglePoint.x - centrePoint.x;
        let distanceFromYCenter = anglePoint.y - centrePoint.y;
        let radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

        let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

        if (angle < (-0.5 * Math.PI))
        {
            angle += 2.0 * Math.PI; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
        }

        return {
            angle: angle,
            distance: radialDistanceFromCenter
        };
    }

    DistanceBetweenPoints(pt1: any, pt2: any): number
    {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    }

    AliasPixel(pixelWidth: number): number
    {
        return (pixelWidth % 2 === 0) ? 0 : 0.5;
    }

    SplineCurve(firstPoint: any, middlePoint: any, afterPoint: any, t: number): any
    {
        // Props to Rob Spencer at scaled innovation for his post on splining between points
        // http://scaledinnovation.com/analytics/splines/aboutSplines.html

        // This function must also respect "skipped" points

        let previous = firstPoint.skip ? middlePoint : firstPoint;
        let current = middlePoint;
        let next = afterPoint.skip ? middlePoint : afterPoint;

        let d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
        let d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));

        let s01 = d01 / (d01 + d12);
        let s12 = d12 / (d01 + d12);

        // If all points are the same, s01 & s02 will be inf
        s01 = isNaN(s01) ? 0 : s01;
        s12 = isNaN(s12) ? 0 : s12;

        let fa = t * s01; // scaling factor for triangle Ta
        let fb = t * s12;

        return {
            previous: {
                x: current.x - fa * (next.x - previous.x),
                y: current.y - fa * (next.y - previous.y)
            },
            next: {
                x: current.x + fb * (next.x - previous.x),
                y: current.y + fb * (next.y - previous.y)
            }
        };
    }

    EPSILON = Number.EPSILON || 1e-14;
    SplineCurveMonotone(points: Array<any>)
    {
        // This function calculates Bézier control points in a similar way than |splineCurve|,
        // but preserves monotonicity of the provided data and ensures no local extremums are added
        // between the dataset discrete points due to the interpolation.
        // See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation

        let pointsWithTangents = (points || []).map(
            (point) => {
                return {
                    model: point._model,
                    deltaK: 0,
                    mK: 0
                }; }
            );

        // Calculate slopes (deltaK) and initialize tangents (mK)
        let pointsLen = pointsWithTangents.length;
        let i, pointBefore, pointCurrent, pointAfter;
        for (i = 0; i < pointsLen; ++i)
        {
            pointCurrent = pointsWithTangents[i];
            if (pointCurrent.model.skip)
            {
                continue;
            }

            pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
            pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
            if (pointAfter && !pointAfter.model.skip)
            {
                let slopeDeltaX = (pointAfter.model.x - pointCurrent.model.x);

                // In the case of two points that appear at the same x pixel, slopeDeltaX is 0
                pointCurrent.deltaK = slopeDeltaX !== 0 ? (pointAfter.model.y - pointCurrent.model.y) / slopeDeltaX : 0;
            }

            if (!pointBefore || pointBefore.model.skip)
            {
                pointCurrent.mK = pointCurrent.deltaK;
            }
            else if (!pointAfter || pointAfter.model.skip)
            {
                pointCurrent.mK = pointBefore.deltaK;
            }
            else if (this.Sign(pointBefore.deltaK) !== this.Sign(pointCurrent.deltaK))
            {
                pointCurrent.mK = 0;
            }
            else
            {
                pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
            }
        }

        // Adjust tangents to ensure monotonic properties
        let alphaK, betaK, tauK, squaredMagnitude;
        for (i = 0; i < pointsLen - 1; ++i)
        {
            pointCurrent = pointsWithTangents[i];
            pointAfter = pointsWithTangents[i + 1];
            if (pointCurrent.model.skip || pointAfter.model.skip)
            {
                continue;
            }

            if (this.AlmostEquals(pointCurrent.deltaK, 0, this.EPSILON))
            {
                pointCurrent.mK = pointAfter.mK = 0;
                continue;
            }

            alphaK = pointCurrent.mK / pointCurrent.deltaK;
            betaK = pointAfter.mK / pointCurrent.deltaK;
            squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
            if (squaredMagnitude <= 9)
            {
                continue;
            }

            tauK = 3 / Math.sqrt(squaredMagnitude);
            pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
            pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
        }

        // Compute control points
        let deltaX;
        for (i = 0; i < pointsLen; ++i)
        {
            pointCurrent = pointsWithTangents[i];
            if (pointCurrent.model.skip)
            {
                continue;
            }

            pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
            pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
            if (pointBefore && !pointBefore.model.skip)
            {
                deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
                pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
                pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
            }
            if (pointAfter && !pointAfter.model.skip)
            {
                deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
                pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
                pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
            }
        }
    }

    NextItem(collection: Array<any>, index: number, loop?: boolean): any
    {
        if (loop)
        {
            return index >= collection.length - 1 ? collection[0] : collection[index + 1];
        }
        return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
    }

    PreviousItem(collection: Array<any>, index: number, loop?: boolean): any
    {
        if (loop)
        {
            return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
        }
        return index <= 0 ? collection[0] : collection[index - 1];
    }

    // Implementation of the nice number algorithm used in determining where axis labels will go
    NiceNum(range: number, round: boolean): number
    {
        let exponent = Math.floor(this.Log10(range));
        let fraction = range / Math.pow(10, exponent);
        let niceFraction;

        if (round)
        {
            if (fraction < 1.5)
            {
                niceFraction = 1;
            }
            else if (fraction < 3)
            {
                niceFraction = 2;
            }
            else if (fraction < 7)
            {
                niceFraction = 5;
            }
            else
            {
                niceFraction = 10;
            }
        }
        else if (fraction <= 1.0)
        {
            niceFraction = 1;
        }
        else if (fraction <= 2)
        {
            niceFraction = 2;
        }
        else if (fraction <= 5)
        {
            niceFraction = 5;
        }
        else
        {
            niceFraction = 10;
        }

        return niceFraction * Math.pow(10, exponent);
    }

    // Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    RequestAnimFrame = () => {
        if (typeof window === 'undefined')
        {
            return (callback: any) => { callback(); };
        }

        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            ((callback) => { return window.setTimeout(callback, 1000 / 60); });
    }

    // -- DOM methods
    GetRelativePosition(evt: any, chart: any): {}
    {
        let mouseX, mouseY;
        let e = evt.originalEvent || evt;
        let canvas = evt.currentTarget || evt.srcElement;
        let boundingRect = canvas.getBoundingClientRect();

        let touches = e.touches;
        if (touches && touches.length > 0)
        {
            mouseX = touches[0].clientX;
            mouseY = touches[0].clientY;
        }
        else
        {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        // Scale mouse coordinates into canvas coordinates
        // by following the pattern laid out by 'jerryj' in the comments of
        // http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
        let paddingLeft = parseFloat(this.GetStyle(canvas, 'padding-left'));
        let paddingTop = parseFloat(this.GetStyle(canvas, 'padding-top'));
        let paddingRight = parseFloat(this.GetStyle(canvas, 'padding-right'));
        let paddingBottom = parseFloat(this.GetStyle(canvas, 'padding-bottom'));
        let width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
        let height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;

        // We divide by the current device pixel ratio, because the canvas is scaled up by that amount in each direction. However
        // the backend model is in unscaled coordinates. Since we are going to deal with our model coordinates, we go back here
        mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / (width) * canvas.width / chart.currentDevicePixelRatio);
        mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / (height) * canvas.height / chart.currentDevicePixelRatio);

        return {
            x: mouseX,
            y: mouseY
        };
    }

    // Private helper function to convert max-width/max-height values that may be percentages into a number
    ParseMaxStyle(styleValue: number | string, node: any, parentProperty: number): number
    {
        let valueInPixels;
        if (typeof styleValue === 'string')
        {
            valueInPixels = parseInt(styleValue, 10);

            if (styleValue.indexOf('%') !== -1)
            {
                // percentage * size in dimension
                valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
            }
        }
        else
        {
            valueInPixels = styleValue;
        }

        return valueInPixels;
    }

    /**
     * Returns if the given value contains an effective constraint.
     * @private
     */
    private IsConstrainedValue(value: any): boolean
    {
        return value !== undefined && value !== null && value !== 'none';
    }

    // Private helper to get a constraint dimension
    // @param domNode : the node to check the constraint on
    // @param maxStyle : the style that defines the maximum for the direction we are using (maxWidth / maxHeight)
    // @param percentageProperty : property of parent to use when calculating width as a percentage
    // @see http://www.nathanaeljones.com/blog/2013/reading-max-width-cross-browser
    private GetConstraintDimension(domNode: any, maxStyle: any, percentageProperty: any): any
    {
        let view = document.defaultView;
        let parentNode = domNode.parentNode;
        let constrainedNode = view.getComputedStyle(domNode)[maxStyle];
        let constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
        let hasCNode = this.IsConstrainedValue(constrainedNode);
        let hasCContainer = this.IsConstrainedValue(constrainedContainer);
        let infinity = Number.POSITIVE_INFINITY;

        if (hasCNode || hasCContainer)
        {
            return Math.min(
                hasCNode ? this.ParseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity,
                hasCContainer ? this.ParseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
        }

        return 'none';
    }

    // returns Number or undefined if no constraint
    GetConstraintWidth(domNode: any)
    {
        return this.GetConstraintDimension(domNode, 'max-width', 'clientWidth');
    }

    // returns Number or undefined if no constraint
    GetConstraintHeight(domNode: any)
    {
        return this.GetConstraintDimension(domNode, 'max-height', 'clientHeight');
    }

    GetMaximumWidth(domNode: any)
    {
        let container = domNode.parentNode;
        if (! container)
        {
            return domNode.clientWidth;
        }

        let paddingLeft = parseInt(this.GetStyle(container, 'padding-left'), 10);
        let paddingRight = parseInt(this.GetStyle(container, 'padding-right'), 10);
        let w = container.clientWidth - paddingLeft - paddingRight;
        let cw = this.GetConstraintWidth(domNode);
        return isNaN(cw) ? w : Math.min(w, cw);
    }

    GetMaximumHeight(domNode: any): number
    {
        let container = domNode.parentNode;
        if (! container)
        {
            return domNode.clientHeight;
        }

        let paddingTop = parseInt(this.GetStyle(container, 'padding-top'), 10);
        let paddingBottom = parseInt(this.GetStyle(container, 'padding-bottom'), 10);
        let h = container.clientHeight - paddingTop - paddingBottom;
        let ch = this.GetConstraintHeight(domNode);
        return isNaN(ch) ? h : Math.min(h, ch);
    }

    GetStyle(el: any, property: any)
    {
        return el.currentStyle ?
            el.currentStyle[property] :
            document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
    }

    RetinaScale(chart: any, forceRatio: number)
    {
        let pixelRatio = chart.currentDevicePixelRatio = forceRatio || window.devicePixelRatio || 1;
        if (pixelRatio === 1)
        {
            return;
        }

        let canvas = chart.canvas;
        let height = chart.height;
        let width = chart.width;

        canvas.height = height * pixelRatio;
        canvas.width = width * pixelRatio;
        chart.ctx.scale(pixelRatio, pixelRatio);

        // If no style has been set on the canvas, the render size is used as display size,
        // making the chart visually bigger, so let's enforce it to the "correct" values.
        // See https://github.com/chartjs/Chart.js/issues/3575
        if (!canvas.style.height && !canvas.style.width)
        {
            canvas.style.height = height + 'px';
            canvas.style.width = width + 'px';
        }
    }

    // -- Canvas methods
    FontString(pixelSize: number, fontStyle: string, fontFamily: string): string
    {
        return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
    }

    LongestText(ctx: CanvasRenderingContext2D, font: string, arrayOfThings: Array<string>, cache: any): number
    {
        cache = cache || {};
        let data = cache.data = cache.data || {};
        let gc = cache.garbageCollect = cache.garbageCollect || [];

        if (cache.font !== font)
        {
            data = cache.data = {};
            gc = cache.garbageCollect = [];
            cache.font = font;
        }

        ctx.font = font;
        let longest = 0;
        this.Each(arrayOfThings, (thing: string) => {
            // Undefined strings and arrays should not be measured
            if (thing !== undefined && thing !== null && this.IsArray(thing) !== true)
            {
                longest = this.MeasureText(ctx, data, gc, longest, thing);
            }
            else if (this.IsArray(thing))
            {
                // if it is an array lets measure each element
                // to do maybe simplify this function a bit so we can do this more recursively?
                this.Each(thing, (nestedThing: string) => {
                    // Undefined strings and arrays should not be measured
                    if (nestedThing !== undefined && nestedThing !== null && ! this.IsArray(nestedThing))
                    {
                        longest = this.MeasureText(ctx, data, gc, longest, nestedThing);
                    }
                });
            }
        });

        let gcLen = gc.length / 2;
        if (gcLen > arrayOfThings.length)
        {
            for (let i = 0; i < gcLen; i++)
            {
                delete data[gc[i]];
            }
            gc.splice(0, gcLen);
        }
        return longest;
    }

    MeasureText = (ctx: CanvasRenderingContext2D, data: any, gc: Array<string>, longest: number, string: string) => {
        let textWidth = data[string];
        if (!textWidth)
        {
            textWidth = data[string] = ctx.measureText(string).width;
            gc.push(string);
        }
        if (textWidth > longest)
        {
            longest = textWidth;
        }
        return longest;
    }

    NumberOfLabelLines = (arrayOfThings: Array<string>) => {
        let numberOfLines = 1;
        this.Each(arrayOfThings, (thing: any) => {
            if (this.IsArray(thing))
            {
                if (thing.length > numberOfLines)
                {
                    numberOfLines = thing.length;
                }
            }
        });
        return numberOfLines;
    }

    GetHoverColor = (colorValue: any) => {
        /* global CanvasPattern */
        return (colorValue instanceof CanvasPattern) ?
            colorValue :
            '#FFFAF0';
    }
}
