/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 16:52:55
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-12 18:11:47
 * @Description:
 */
var app = getApp();
const base64 = require("./base64");

const request = (url, options, tApp) => {
  if (!app) app = tApp;
  let token = app.globalData.token;
  if (token) token = "bearer " + token;
  if (options.method === "POST" && !app.util.isEmpty(options.data)) {
    url = url + app.util.objectToQueryString(options.data);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.host}${url}`,
      method: options.method,
      data:
        options.method === "GET" ? options.data : JSON.stringify(options.data),
      header: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization:
          "Basic " +
          base64.encode(
            `${app.globalData.clientId}:${app.globalData.clientSecret}`
          ),
        "Blade-Auth": token,
      },
      success(res) {
        console.log("request==>", url, options.data);
        //获取状态码
        const status = res.data.code || res.statusCode;
        const message = res.data.msg || res.data.errMsg || "未知错误";
        console.log("resp==>", res);
        if (status === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            icon: "none",
            title: message, //提示的内容,
            duration: 2000, //延迟时间,
            success: (res) => {},
          });
          reject(res.data);
        }
      },
      fail(error) {
        console.error(error);
        reject(error.data);
      },
    });
  });
};

const get = (url, params = {}, tApp) => {
  return request(url, { method: "GET", data: params }, tApp);
};

const post = (url, params, tApp) => {
  return request(url, { method: "POST", data: params }, tApp);
};

const put = (url, params) => {
  return request(url, { method: "PUT", data: params });
};

// 不能声明DELETE（关键字）
const remove = (url, params) => {
  return request(url, { method: "DELETE", data: params });
};

module.exports = {
  get,
  post,
  put,
  remove,
};
