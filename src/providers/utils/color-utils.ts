/**
 * Given a rgb, it will darken/lighten
 * http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 *
 * @export
 * @param {any} { r, g, b }
 * @param {any} percent
 * @returns
 */
export function shadeRGBColor(r: number, g: number, b: number, percent: number)
{
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    r = (Math.round((t - r) * p) + r);
    g = (Math.round((t - g) * p) + g);
    b = (Math.round((t - b) * p) + b);

    return `rgb(${r}, ${g}, ${b})`;
}
