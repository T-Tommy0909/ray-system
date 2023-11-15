// From https://youmightnotneed.com/lodash/
export const generateUniqueId = (
  (counter) =>
  (str = '') =>
    `${str}${++counter}`
)(0);

/**
 * 要素がユニークかどうか判定する関数
 */
export const isUniqueArray = <T>(array: ReadonlyArray<T>) => {
  const setElements = new Set(array);
  return setElements.size === array.length;
};
