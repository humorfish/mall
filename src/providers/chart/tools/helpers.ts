/**
 * @namespace Chart.helpers
 */
import {TCanvas, TEasing} from './index';

export class THelpers
{
    constructor()
    {
        this.Canvas = new TCanvas();
        this.Easing = new TEasing();
    }

    /**
     * An empty function that can be used, for example, for optional callback.
     */
    Noop(): any
    {
    }

    /**
     * Returns a unique id, sequentially generated from a global variable.
     * @returns {Number}
     * @function
     */
    Id: number = 0;
    Uuid(): number
    {
        return this.Id++;
    }

    /**
     * Returns true if `value` is neither null nor undefined, else returns false.
     * @param {*} value - The value to test.
     * @returns {Boolean}
     * @since 2.7.0
     */
    IsNullOrUndef(v: any): boolean
    {
        return v === null || typeof v === 'undefined';
    }

    /**
     * Returns true if `value` is an array, else returns false.
     * @param {*} value - The value to test.
     * @returns {Boolean}
     * @function
     */
    IsArray(v: any): boolean
    {
        return Array.isArray(v) ||
            Object.prototype.toString.call(v) === '[object Array]';
    }

    /**
     * Returns true if `value` is an object (excluding null), else returns false.
     * @param {*} value - The value to test.
     * @returns {Boolean}
     * @since 2.7.0
     */
    IsObject(v: any): boolean
    {
        return v !== null && Object.prototype.toString.call(v) === '[object Object]';
    }

    /**
     * Returns `value` if defined, else returns `defaultValue`.
     * @param {*} value - The value to return if defined.
     * @param {*} defaultValue - The value to return if `value` is undefined.
     * @returns {*}
     */
    GetValueOrDefault(v: any, defaultV: any): any
    {
        return typeof v === 'undefined' ? defaultV : v;
    }

    /**
     * Returns value at the given `index` in array if defined, else returns `defaultValue`.
     * @param {Array} value - The array to lookup for value at `index`.
     * @param {Number} index - The index in `value` to lookup for value.
     * @param {*} defaultValue - The value to return if `value[index]` is undefined.
     * @returns {*}
     */
    GetValueAtIndexOrDefault(v: any, Idx: number, defaultV: any): any
    {
        return this.GetValueOrDefault(this.IsArray(v) ? v[Idx] : v, defaultV);
    }

    /**
     * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
     * value returned by `fn`. If `fn` is not a function, this method returns undefined.
     * @param {Function} fn - The function to call.
     * @param {Array|undefined|null} args - The arguments with which `fn` should be called.
     * @param {Object} [thisArg] - The value of `this` provided for the call to `fn`.
     * @returns {*}
     */
    CallCallback(fn: any, args: any, thisArg: any): any
    {
        if (fn && typeof fn.call === 'function')
            return fn.apply(thisArg, args);
    }

    /**
        * Note(SB) for performance sake, this method should only be used when loopable type
        * is unknown or in none intensive code (not called often and small loopable). Else
        * it's preferable to use a regular for() loop and save extra function calls.
        * @param {Object|Array} loopable - The object or array to be iterated.
        * @param {Function} fn - The function to call for each item.
        * @param {Object} [thisArg] - The value of `this` provided for the call to `fn`.
        * @param {Boolean} [reverse] - If true, iterates backward on the loopable.
        */
    Each(loopable: any | Array<any>, fn: Function, thisArg?: any, reverse?: boolean)
    {
        let i, len, keys;
        if (this.IsArray(loopable))
        {
            len = loopable.length;
            if (reverse)
            {
                for (i = len - 1; i >= 0; i--)
                {
                    fn.call(thisArg, loopable[i], i);
                }
            }
            else
            {
                for (i = 0; i < len; i++)
                {
                    fn.call(thisArg, loopable[i], i);
                }
            }
        }
        else if (this.IsObject(loopable))
        {
            keys = Object.keys(loopable);
            len = keys.length;
            for (i = 0; i < len; i++)
            {
                fn.call(thisArg, loopable[keys[i]], keys[i]);
            }
        }
    }

    /**
        * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
        * @see http://stackoverflow.com/a/14853974
        * @param {Array} a0 - The array to compare
        * @param {Array} a1 - The array to compare
        * @returns {Boolean}
        */
    ArrayEquals(a0: Array<any>, a1: Array<any>): boolean
    {
        let i, ilen, v0, v1;

        if (!a0 || !a1 || a0.length !== a1.length)
        {
            return false;
        }

        for (i = 0, ilen = a0.length; i < ilen; ++i)
        {
            v0 = a0[i];
            v1 = a1[i];

            if (v0 instanceof Array && v1 instanceof Array)
            {
                if (! this.ArrayEquals(v0, v1))
                {
                    return false;
                }
            }
            else if (v0 !== v1)
            {
                // NOTE: two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }

        return true;
    }

    /**
        * Returns a deep copy of `source` without keeping references on objects and arrays.
        * @param {*} source - The value to clone.
        * @returns {*}
        */
    Clone(source: any): any
    {
        if (this.IsArray(source))
        {
            return source.map(this.Clone);
        }

        if (this.IsObject(source))
        {
            let target: any = {};
            let keys = Object.keys(source);
            let klen = keys.length;
            let k = 0;

            for (; k < klen; ++k)
            {
                target[keys[k]] = this.Clone(source[keys[k]]);
            }

            return target;
        }

        return source;
    }

    /**
    * The default merger when Chart.this.merge is called without merger option.
    * Note(SB): this method is also used by configMerge and scaleMerge as fallback.
    * @private
    */
    _Merger(key: string, target: any, source: any, options: any)
    {
        let tval = target[key];
        let sval = source[key];

        if (this.IsObject(tval) && this.IsObject(sval))
        {
            this.Merge(tval, sval, options);
        }
        else
        {
            target[key] = this.Clone(sval);
        }
    }

    /**
    * Merges source[key] in target[key] only if target[key] is undefined.
    * @private
    */
    _MergerIf(key: string, target: any, source: any)
    {
        let tval = target[key];
        let sval = source[key];

        if (this.IsObject(tval) && this.IsObject(sval))
        {
            this.MergeIf(tval, sval);
        }
        else if (!target.hasOwnProperty(key))
        {
            target[key] = this.Clone(sval);
        }
    }

    /**
    * Recursively deep copies `source` properties into `target` with the given `options`.
    * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
    * @param {Object} target - The target object in which all sources are merged into.
    * @param {Object|Array(Object)} source - Object(s) to merge into `target`.
    * @param {Object} [options] - Merging options:
    * @param {Function} [options.merger] - The merge method (key, target, source, options)
    * @returns {Object} The `target` object.
    */
    Merge(target: any, source: any | Array<any>, options?: any): any
    {
        let sources = this.IsArray(source) ? source : [source];
        let ilen = sources.length;
        let merge, i, keys, klen, k;

        if (! this.IsObject(target))
        {
            return target;
        }

        options = options || {};
        merge = options.merger || this._Merger;

        for (i = 0; i < ilen; ++i)
        {
            source = sources[i];
            if (! this.IsObject(source))
            {
                continue;
            }

            keys = Object.keys(source);
            for (k = 0, klen = keys.length; k < klen; ++k)
            {
                merge(keys[k], target, source, options);
            }
        }

        return target;
    }

    /**
    * Recursively deep copies `source` properties into `target` *only* if not defined in target.
    * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
    * @param {Object} target - The target object in which all sources are merged into.
    * @param {Object|Array(Object)} source - Object(s) to merge into `target`.
    * @returns {Object} The `target` object.
    */
    MergeIf(target: any, source: any | Array<any>): any
    {
        return this.Merge(target, source, {merger: this._MergerIf});
    }

    Canvas: TCanvas;
    Easing: TEasing;
}



