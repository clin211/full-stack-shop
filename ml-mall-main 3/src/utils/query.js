/**
 * @description 对象转query字符串
 * @param {Record<string,any>} queryObj
 * @return {string}
 */
export const query = queryObj =>
  Object.keys(queryObj ?? {})
    .map(key =>
      key.concat(
        '=',
        typeof queryObj[key] === 'string'
          ? queryObj[key]
          : JSON.stringify(queryObj[key])
      )
    )
    .join('&');
