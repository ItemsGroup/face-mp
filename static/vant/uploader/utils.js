/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 14:57:05
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-15 14:34:11
 * @Description:
 */
const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}
export function isImageFile(item) {
  if (item.type) {
    return item.type.indexOf("image") === 0;
  }
  if (item.path) {
    return isImageUrl(item.path);
  }
  if (item.url) {
    return isImageUrl(item.url);
  }
  return false;
}
export function isVideo(res, accept) {
  return accept === "video";
}
export function chooseFile({
  accept,
  multiple,
  capture,
  compressed,
  maxDuration,
  sizeType,
  camera,
  maxCount,
}) {
  switch (accept) {
    case "image":
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: multiple ? Math.min(maxCount, 9) : 1,
          sourceType: capture,
          sizeType,
          success: resolve,
          fail: reject,
        });
      });
    case "media":
      return new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: multiple ? Math.min(maxCount, 9) : 1,
          sourceType: capture,
          maxDuration,
          sizeType,
          camera,
          success: resolve,
          fail: reject,
        });
      });
    case "video":
      return new Promise((resolve, reject) => {
        wx.chooseVideo({
          sourceType: capture,
          compressed,
          maxDuration,
          camera,
          success: resolve,
          fail: reject,
        });
      });
    default:
      return new Promise((resolve, reject) => {
        wx.chooseMessageFile({
          count: multiple ? maxCount : 1,
          type: "file",
          success: resolve,
          fail: reject,
        });
      });
  }
}
export function isFunction(val) {
  return typeof val === "function";
}
export function isObject(val) {
  return val !== null && typeof val === "object";
}
export function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
