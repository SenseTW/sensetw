/**
 * @see `src/types/map-dispatch.d.ts`
 */
export function mapDispatch(obj) {
  return function (dispatch) {
    switch (typeof obj) {
      case 'object': {
        let ret = {};
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            ret[key] = mapDispatch(obj[key])(dispatch);
          }
        }
        return ret;
      }
      case 'function': {
        return function(...args) {
          return dispatch(obj.apply(this, args));
        };
      }
      default:
        return obj;
    }
  };
};