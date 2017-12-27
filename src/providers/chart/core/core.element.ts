import {CoreHelper} from './core.helper';

export class Element
{
    constructor(public helpers: CoreHelper)
    {
    }

    Interpolate(start: any, view: any, model: any, ease: number)
    {
        let keys = Object.keys(model);
        let i, ilen, key, actual, origin, target, type;

        for (i = 0, ilen = keys.length; i < ilen; ++i)
        {
            key = keys[i];

            target = model[key];

            // if a value is added to the model after pivot() has been called, the view
            // doesn't contain it, so let's initialize the view to the target value.
            if (!view.hasOwnProperty(key))
            {
                view[key] = target;
            }

            actual = view[key];

            if (actual === target || key[0] === '_')
            {
                continue;
            }

            if (!start.hasOwnProperty(key))
            {
                start[key] = actual;
            }

            origin = start[key];

            type = typeof target;

            if (type === typeof origin)
            {
                if (type === 'string')
                {
                    // c0 = color(origin);
                    // if (c0.valid)
                    // {
                    //     c1 = color(target);
                    //     if (c1.valid)
                    //     {
                    //         view[key] = c1.mix(c0, ease).rgbString();
                    //         continue;
                    //     }
                    // }
                }
                else if (type === 'number' && isFinite(origin) && isFinite(target))
                {
                    view[key] = origin + (target - origin) * ease;
                    continue;
                }
            }

            view[key] = target;
        }
    }

    Initialize()
    {
        this.Hidden = false;
    }

    Pivot(): Element
    {
        if (!this.View)
        {
            this.View = this.helpers.Clone(this.Model);
        }
        this.Start = {};
        return this;
    }

    Transition(ease: number)
    {
        let me = this;
        let model = me.Model;
        let start = me.Start;
        let view = me.View;

        // No animation -> No Transition
        if (!model || ease === 1)
        {
            me.View = model;
            me.Start = null;
            return me;
        }

        if (!view)
        {
            view = me.View = {};
        }

        if (!start)
        {
            start = me.Start = {};
        }

        this.Interpolate(start, view, model, ease);

        return me;
    }

    tooltipPosition(): {}
    {
        return {
            x: this.Model.x,
            y: this.Model.y
        };
    }

    hasValue(): boolean
    {
        return this.helpers.IsNumber(this.Model.x) && this.helpers.IsNumber(this.Model.y);
    }

    protected Children: any;
    protected Start: any;
    protected View: any;
    protected Model: any;
    protected Hidden: boolean = false;
    protected Loop: boolean = false;
}

