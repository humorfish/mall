/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @namespace Chart.helpers.easingEffects
 * @see http://www.robertpenner.com/easing/
 */
export class TEasing
{
    Linear(t: number)
    {
        return t;
    }

    EaseInQuad(t: number)
    {
        return t * t;
    }

    EaseOutQuad(t: number)
    {
        return -t * (t - 2);
    }

    EaseInOutQuad(t: number)
    {
        if ((t /= 0.5) < 1)
        {
            return 0.5 * t * t;
        }
        return -0.5 * ((--t) * (t - 2) - 1);
    }

    EaseInCubic(t: number)
    {
        return t * t * t;
    }

    EaseOutCubic(t: number)
    {
        return (t = t - 1) * t * t + 1;
    }

    EaseInOutCubic(t: number)
    {
        if ((t /= 0.5) < 1)
        {
            return 0.5 * t * t * t;
        }

        return 0.5 * ((t -= 2) * t * t + 2);
    }

    EaseInQuart(t: number)
    {
        return t * t * t * t;
    }

    EaseOutQuart(t: number)
    {
        return -((t = t - 1) * t * t * t - 1);
    }

    EaseInOutQuart(t: number)
    {
        if ((t /= 0.5) < 1)
        {
            return 0.5 * t * t * t * t;
        }
        return -0.5 * ((t -= 2) * t * t * t - 2);
    }

    EaseInQuint(t: number)
    {
        return t * t * t * t * t;
    }

    EaseOutQuint(t: number)
    {
        return (t = t - 1) * t * t * t * t + 1;
    }

    EaseInOutQuint(t: number)
    {
        if ((t /= 0.5) < 1)
        {
            return 0.5 * t * t * t * t * t;
        }
        return 0.5 * ((t -= 2) * t * t * t * t + 2);
    }

    EaseInSine(t: number)
    {
        return -Math.cos(t * (Math.PI / 2)) + 1;
    }

    EaseOutSine(t: number)
    {
        return Math.sin(t * (Math.PI / 2));
    }

    EaseInOutSine(t: number)
    {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }

    EaseInExpo(t: number)
    {
        return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
    }

    EaseOutExpo(t: number)
    {
        return (t === 1) ? 1 : -Math.pow(2, -10 * t) + 1;
    }

    EaseInOutExpo(t: number)
    {
        if (t === 0)
        {
            return 0;
        }
        if (t === 1)
        {
            return 1;
        }
        if ((t /= 0.5) < 1)
        {
            return 0.5 * Math.pow(2, 10 * (t - 1));
        }
        return 0.5 * (-Math.pow(2, -10 * --t) + 2);
    }

    EaseInCirc(t: number)
    {
        if (t >= 1)
        {
            return t;
        }
        return -(Math.sqrt(1 - t * t) - 1);
    }

    EaseOutCirc(t: number)
    {
        return Math.sqrt(1 - (t = t - 1) * t);
    }

    EaseInOutCirc(t: number)
    {
        if ((t /= 0.5) < 1)
        {
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }

    EaseInElastic(t: number)
    {
        let s = 1.70158;
        let p = 0;
        let a = 1;
        if (t === 0)
        {
            return 0;
        }
        if (t === 1)
        {
            return 1;
        }
        if (!p)
        {
            p = 0.3;
        }
        if (a < 1)
        {
            a = 1;
            s = p / 4;
        }
        else
        {
            s = p / (2 * Math.PI) * Math.asin(1 / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    }

    EaseOutElastic(t: number)
    {
        let s = 1.70158;
        let p = 0;
        let a = 1;
        if (t === 0)
        {
            return 0;
        }
        if (t === 1)
        {
            return 1;
        }
        if (!p)
        {
            p = 0.3;
        }
        if (a < 1)
        {
            a = 1;
            s = p / 4;
        }
        else
        {
            s = p / (2 * Math.PI) * Math.asin(1 / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    }

    EaseInOutElastic(t: number)
    {
        let s = 1.70158;
        let p = 0;
        let a = 1;
        if (t === 0)
        {
            return 0;
        }
        if ((t /= 0.5) === 2)
        {
            return 1;
        }
        if (!p)
        {
            p = 0.45;
        }
        if (a < 1)
        {
            a = 1;
            s = p / 4;
        }
        else
        {
            s = p / (2 * Math.PI) * Math.asin(1 / a);
        }
        if (t < 1)
        {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
    EaseInBack(t: number)
    {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    }

    EaseOutBack(t: number)
    {
        const s = 1.70158;
        return (t = t - 1) * t * ((s + 1) * t + s) + 1;
    }

    EaseInOutBack(t: number)
    {
        let s = 1.70158;
        if ((t /= 0.5) < 1)
        {
            return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
        }
        return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    }

    EaseInBounce(t: number)
    {
        return 1 - this.EaseOutBounce(1 - t);
    }

    EaseOutBounce(t: number)
    {
        if (t < (1 / 2.75))
        {
            return 7.5625 * t * t;
        }
        if (t < (2 / 2.75))
        {
            return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
        }
        if (t < (2.5 / 2.75))
        {
            return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
        }
        return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
    }

    EaseInOutBounce(t: number)
    {
        if (t < 0.5)
        {
            return this.EaseInBounce(t * 2) * 0.5;
        }
        return this.EaseOutBounce(t * 2 - 1) * 0.5 + 0.5;
    }
}

