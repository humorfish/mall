import {Element} from '../core/core.element';
import {CoreHelper} from '../core/core.helper';

export class ElementLine extends Element
{
    constructor(private Ctx: CanvasRenderingContext2D, public helpers: CoreHelper)
    {
        super(helpers);
    }

    Draw()
    {
        let vm = this.View;
        let spanGaps = vm.spanGaps;
        let points = this.Children.slice(); // clone array
        let globalOptionLineElements = window.Defaults.elements.line;
        let lastDrawnIndex = -1;
        let index, current, previous, currentVM;

        // If we are looping, adding the first point again
        if (this.Loop && points.length)
        {
            points.push(points[0]);
        }

        this.Ctx.save();

        // Stroke Line Options
        this.Ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

        // IE 9 and 10 do not support line dash
        if (this.Ctx.setLineDash)
        {
            this.Ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
        }

        this.Ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
        this.Ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
        this.Ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
        this.Ctx.strokeStyle = vm.borderColor || window.Defaults.defaultColor;

        // Stroke Line
        this.Ctx.beginPath();
        lastDrawnIndex = -1;

        for (index = 0; index < points.length; ++index)
        {
            current = points[index];
            previous = this.helpers.PreviousItem(points, index);
            currentVM = current._view;

            // First point moves to it's starting position no matter what
            if (index === 0)
            {
                if (!currentVM.skip)
                {
                    this.Ctx.moveTo(currentVM.x, currentVM.y);
                    lastDrawnIndex = index;
                }
            }
            else
            {
                previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

                if (!currentVM.skip)
                {
                    if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1)
                    {
                        // There was a gap and this is the first point after the gap
                        this.Ctx.moveTo(currentVM.x, currentVM.y);
                    }
                    else
                    {
                        // Line to next point
                        this.helpers.Canvas.LineTo(this.Ctx, previous._view, current._view);
                    }
                    lastDrawnIndex = index;
                }
            }
        }

        this.Ctx.stroke();
        this.Ctx.restore();
    }

    static Line: any;
    static Point: any;
}

