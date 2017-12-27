
/**
 * Throttle a function
 *
 * @export
 * @param {*}      func
 * @param {number} wait
 * @param {*}      [options]
 * @returns
 */
export function throttle(func: any, wait: number, options?: any) {
  options = options || {};
  let context: any;
  let args: any;
  let result: any;
  let timeout: any = null;
  let previous = 0;

  function later() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
  }

  function aa() {
    const now = +new Date();

    if (!previous && options.leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);
    context = aa;
    args = arguments;

    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  }

  return aa;
}
