import { CoreHelper } from './core.helper';

export class Ticks
{
    constructor()
    {

    }
}

/**
 * Namespace to hold formatters for different types of ticks
 * @namespace Chart.Ticks.formatters
 */
export class Formatters
{
    constructor(private helper: CoreHelper)
    {

    }

    /**
     * Formatter for value labels
     * @method Chart.Ticks.formatters.values
     * @param value the value to display
     * @return {String|Array} the label to display
     */
    Values(value: any): boolean
    {
        return this.helper.IsArray(value) ? value : '' + value;
    }

    /**
     * Formatter for linear numeric ticks
     * @method Chart.Ticks.formatters.linear
     * @param tickValue {Number} the value to be formatted
     * @param index {Number} the position of the tickValue parameter in the ticks array
     * @param ticks {Array<Number>} the list of ticks being converted
     * @return {String} string representation of the tickValue parameter
     */
    Linear(tickValue: number, index: number, ticks: Array<number>): string
    {
        // If we have lots of ticks, don't use the ones
        let delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];

        // If we have a number like 2.5 as the delta, figure out how many decimal places we need
        if (Math.abs(delta) > 1)
        {
            if (tickValue !== Math.floor(tickValue))
            {
                // not an integer
                delta = tickValue - Math.floor(tickValue);
            }
        }

        let logDelta = this.helper.Log10(Math.abs(delta));
        let tickString = '';

        if (tickValue !== 0)
        {
            let numDecimal = -1 * Math.floor(logDelta);
            numDecimal = Math.max(Math.min(numDecimal, 20), 0); // toFixed has a max of 20 decimal places
            tickString = tickValue.toFixed(numDecimal);
        }
        else
        {
            tickString = '0'; // never show decimal places for 0
        }

        return tickString;
    }

    Logarithmic(tickValue: number, index: number, ticks: Array<number>)
    {
        let remain = tickValue / (Math.pow(10, Math.floor(this.helper.Log10(tickValue))));

        if (tickValue === 0)
        {
            return '0';
        }
        else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1)
        {
            return tickValue.toExponential();
        }
        return '';
    }
}

/**
 * Namespace to hold generators for different types of ticks
 * @namespace Chart.Ticks.generators
 */
export class Generators
{
    constructor(private helper: CoreHelper)
    {

    }

    /**
     * Interface for the options provided to the numeric tick generator
     * @interface INumericTickGenerationOptions
     */
    /**
     * The maximum number of ticks to display
     * @name INumericTickGenerationOptions#maxTicks
     * @type Number
     */
    /**
     * The distance between each tick.
     * @name INumericTickGenerationOptions#stepSize
     * @type Number
     * @optional
     */
    /**
     * Forced minimum for the ticks. If not specified, the minimum of the data range is used to calculate the tick minimum
     * @name INumericTickGenerationOptions#min
     * @type Number
     * @optional
     */
    /**
     * The maximum value of the ticks. If not specified, the maximum of the data range is used to calculate the tick maximum
     * @name INumericTickGenerationOptions#max
     * @type Number
     * @optional
     */

    /**
     * Generate a set of linear ticks
     * @method Chart.Ticks.generators.linear
     * @param generationOptions {INumericTickGenerationOptions} the options used to generate the ticks
     * @param dataRange {IRange} the range of the data
     * @returns {Array<Number>} array of tick values
     */
    Linear(generationOptions: any, dataRange: any)
    {
        let ticks = [];
        // To get a "nice" value for the tick spacing, we will use the appropriately named
        // "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
        // for details.

        let spacing;
        if (generationOptions.stepSize && generationOptions.stepSize > 0) {
            spacing = generationOptions.stepSize;
        }
        else
        {
            let niceRange = this.helper.NiceNum(dataRange.max - dataRange.min, false);
            spacing = this.helper.NiceNum(niceRange / (generationOptions.maxTicks - 1), true);
        }
        let niceMin = Math.floor(dataRange.min / spacing) * spacing;
        let niceMax = Math.ceil(dataRange.max / spacing) * spacing;

        // If min, max and stepSize is set and they make an evenly spaced scale use it.
        if (generationOptions.min && generationOptions.max && generationOptions.stepSize)
        {
            // If very close to our whole number, use it.
            if (this.helper.AlmostWhole((generationOptions.max - generationOptions.min) / generationOptions.stepSize, spacing / 1000))
            {
                niceMin = generationOptions.min;
                niceMax = generationOptions.max;
            }
        }

        let numSpaces = (niceMax - niceMin) / spacing;
        // If very close to our rounded value, use it.
        if (this.helper.AlmostEquals(numSpaces, Math.round(numSpaces), spacing / 1000))
        {
            numSpaces = Math.round(numSpaces);
        }
        else
        {
            numSpaces = Math.ceil(numSpaces);
        }

        let precision = 1;
        if (spacing < 1)
        {
            precision = Math.pow(10, spacing.toString().length - 2);
            niceMin = Math.round(niceMin * precision) / precision;
            niceMax = Math.round(niceMax * precision) / precision;
        }
        ticks.push(generationOptions.min !== undefined ? generationOptions.min : niceMin);
        for (let j = 1; j < numSpaces; ++j)
        {
            ticks.push(Math.round((niceMin + j * spacing) * precision) / precision);
        }
        ticks.push(generationOptions.max !== undefined ? generationOptions.max : niceMax);

        return ticks;
    }

    /**
     * Generate a set of logarithmic ticks
     * @method Chart.Ticks.generators.logarithmic
     * @param generationOptions {INumericTickGenerationOptions} the options used to generate the ticks
     * @param dataRange {IRange} the range of the data
     * @returns {Array<Number>} array of tick values
     */
    Logarithmic(generationOptions: any, dataRange: any)
    {
        let ticks = [];
        let valueOrDefault = this.helper.GetValueOrDefault;

        // Figure out what the max number of ticks we can support it is based on the size of
        // the axis area. For now, we say that the minimum tick spacing in pixels must be 50
        // We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
        // the graph
        let tickVal = valueOrDefault(generationOptions.min, Math.pow(10, Math.floor(this.helper.Log10(dataRange.min))));

        let endExp = Math.floor(this.helper.Log10(dataRange.max));
        let endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
        let exp, significand;

        if (tickVal === 0)
        {
            exp = Math.floor(this.helper.Log10(dataRange.minNotZero));
            significand = Math.floor(dataRange.minNotZero / Math.pow(10, exp));

            ticks.push(tickVal);
            tickVal = significand * Math.pow(10, exp);
        }
        else
        {
            exp = Math.floor(this.helper.Log10(tickVal));
            significand = Math.floor(tickVal / Math.pow(10, exp));
        }
        let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;

        do
        {
            ticks.push(tickVal);

            ++significand;
            if (significand === 10)
            {
                significand = 1;
                ++exp;
                precision = exp >= 0 ? 1 : precision;
            }

            tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
        }
        while (exp < endExp || (exp === endExp && significand < endSignificand));

        let lastTick = valueOrDefault(generationOptions.max, tickVal);
        ticks.push(lastTick);

        return ticks;
    }
}
