import {  } from '';

/**
 * @namespace Chart.helpers.canvas
 */
export class TCanvas
{
    Clear(Ctx: CanvasRenderingContext2D, width: number, height: number)
    {
        Ctx.clearRect(0, 0, width, height);
    }

    /**
     * Creates a "path" for a rectangle with rounded corners at position (x, y) with a
     * given size (width, height) and the same `radius` for all corners.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D Context.
     * @param {Number} x - The x axis of the coordinate for the rectangle starting point.
     * @param {Number} y - The y axis of the coordinate for the rectangle starting point.
     * @param {Number} width - The rectangle's width.
     * @param {Number} height - The rectangle's height.
     * @param {Number} radius - The rounded amount (in pixels) for the four corners.
     * @todo handle `radius` as top-left, top-right, bottom-right, bottom-left array/object?
     */
    RoundedRect(Ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number)
    {
        if (radius)
        {
            let rx = Math.min(radius, width / 2);
            let ry = Math.min(radius, height / 2);

            Ctx.moveTo(x + rx, y);
            Ctx.lineTo(x + width - rx, y);
            Ctx.quadraticCurveTo(x + width, y, x + width, y + ry);
            Ctx.lineTo(x + width, y + height - ry);
            Ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height);
            Ctx.lineTo(x + rx, y + height);
            Ctx.quadraticCurveTo(x, y + height, x, y + height - ry);
            Ctx.lineTo(x, y + ry);
            Ctx.quadraticCurveTo(x, y, x + rx, y);
        }
        else
        {
            Ctx.rect(x, y, width, height);
        }
    }

    DrawPoint(Ctx: CanvasRenderingContext2D, style: any, radius: number, x: number, y: number)
    {
        let type, edgeLength, xOffset, yOffset, height, size;

        if (style && typeof style === 'object')
        {
            type = style.toString();
            if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]')
            {
                Ctx.drawImage(style, x - style.width / 2, y - style.height / 2, style.width, style.height);
                return;
            }
        }

        if (isNaN(radius) || radius <= 0)
        {
            return;
        }

        switch (style)
        {
            case 'triangle':
                Ctx.beginPath();
                edgeLength = 3 * radius / Math.sqrt(3);
                height = edgeLength * Math.sqrt(3) / 2;
                Ctx.moveTo(x - edgeLength / 2, y + height / 3);
                Ctx.lineTo(x + edgeLength / 2, y + height / 3);
                Ctx.lineTo(x, y - 2 * height / 3);
                Ctx.closePath();
                Ctx.fill();
                break;

            case 'rect':
                size = 1 / Math.SQRT2 * radius;
                Ctx.beginPath();
                Ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
                Ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
                break;

            case 'rectRounded':
                let offset = radius / Math.SQRT2;
                let leftX = x - offset;
                let topY = y - offset;
                let sideSize = Math.SQRT2 * radius;
                Ctx.beginPath();
                this.RoundedRect(Ctx, leftX, topY, sideSize, sideSize, radius / 2);
                Ctx.closePath();
                Ctx.fill();
                break;

            case 'rectRot':
                size = 1 / Math.SQRT2 * radius;
                Ctx.beginPath();
                Ctx.moveTo(x - size, y);
                Ctx.lineTo(x, y + size);
                Ctx.lineTo(x + size, y);
                Ctx.lineTo(x, y - size);
                Ctx.closePath();
                Ctx.fill();
                break;

            case 'cross':
                Ctx.beginPath();
                Ctx.moveTo(x, y + radius);
                Ctx.lineTo(x, y - radius);
                Ctx.moveTo(x - radius, y);
                Ctx.lineTo(x + radius, y);
                Ctx.closePath();
                break;

            case 'crossRot':
                Ctx.beginPath();
                xOffset = Math.cos(Math.PI / 4) * radius;
                yOffset = Math.sin(Math.PI / 4) * radius;
                Ctx.moveTo(x - xOffset, y - yOffset);
                Ctx.lineTo(x + xOffset, y + yOffset);
                Ctx.moveTo(x - xOffset, y + yOffset);
                Ctx.lineTo(x + xOffset, y - yOffset);
                Ctx.closePath();
                break;

            case 'star':
                Ctx.beginPath();
                Ctx.moveTo(x, y + radius);
                Ctx.lineTo(x, y - radius);
                Ctx.moveTo(x - radius, y);
                Ctx.lineTo(x + radius, y);
                xOffset = Math.cos(Math.PI / 4) * radius;
                yOffset = Math.sin(Math.PI / 4) * radius;
                Ctx.moveTo(x - xOffset, y - yOffset);
                Ctx.lineTo(x + xOffset, y + yOffset);
                Ctx.moveTo(x - xOffset, y + yOffset);
                Ctx.lineTo(x + xOffset, y - yOffset);
                Ctx.closePath();
                break;

            case 'line':
                Ctx.beginPath();
                Ctx.moveTo(x - radius, y);
                Ctx.lineTo(x + radius, y);
                Ctx.closePath();
                break;

            case 'dash':
                Ctx.beginPath();
                Ctx.moveTo(x, y);
                Ctx.lineTo(x + radius, y);
                Ctx.closePath();
                break;

            // Default includes circle
            default:
                Ctx.beginPath();
                Ctx.arc(x, y, radius, 0, Math.PI * 2);
                Ctx.closePath();
                Ctx.fill();
                break;
        }

        Ctx.stroke();
    }

    ClipArea(Ctx: CanvasRenderingContext2D, area: any)
    {
        Ctx.save();
        Ctx.beginPath();
        Ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
        Ctx.clip();
    }

    UnclipArea(Ctx: CanvasRenderingContext2D)
    {
        Ctx.restore();
    }

    LineTo(Ctx: CanvasRenderingContext2D, previous: any, target: any, flip?: boolean)
    {
        if (target.steppedLine)
        {
            if ((target.steppedLine === 'after' && !flip) || (target.steppedLine !== 'after' && flip))
            {
                Ctx.lineTo(previous.x, target.y);
            }
            else
            {
                Ctx.lineTo(target.x, previous.y);
            }
            Ctx.lineTo(target.x, target.y);
            return;
        }

        if (!target.tension)
        {
            Ctx.lineTo(target.x, target.y);
            return;
        }

        Ctx.bezierCurveTo(
            flip ? previous.controlPointPreviousX : previous.controlPointNextX,
            flip ? previous.controlPointPreviousY : previous.controlPointNextY,
            flip ? target.controlPointNextX : target.controlPointPreviousX,
            flip ? target.controlPointNextY : target.controlPointPreviousY,
            target.x,
            target.y);
    }
}
