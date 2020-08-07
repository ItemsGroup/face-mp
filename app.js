/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 11:05:23
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-06 12:12:51
 * @Description:
 */
import request from "./utils/request";

//this.js
App({
  globalData: {
    tenantId: "",
    token: "",
    refreshToken: "",
    locateCompanyId: "",
    openId: "",
    userInfo: null,
    // host: "http://192.168.31.23:80",
    host: "http://192.168.31.14:8800",
    // host: "http://localhost:80",
    clientId: "wechat_mp",
    clientSecret: "wechat_mp_secret",
  },
  api: {
    login: "/blade-auth/oauth/weChatToken",
    decodeUserInfo: "/blade-auth/decodeUserInfo",
    listMyCompany:
      "/device/c/locate-company-employee-apply/getLocateCompanyList",
    companyQuickSearch:
      "/device/c/locate-company-employee-apply/selectLocateCompanyListAll",
  },
  util: {
    isEmpty: (val) => val == null || !(Object.keys(val) || val).length,
    objectToQueryString: (queryParameters) => {
      return queryParameters
        ? Object.entries(queryParameters).reduce(
            (queryString, [key, val], index) => {
              const symbol = queryString.length === 0 ? "?" : "&";
              queryString +=
                typeof val === "string" ? `${symbol}${key}=${val}` : "";
              return queryString;
            },
            ""
          )
        : "";
    },
  },
  listMyCompanys() {
    return request.get(this.api.listMyCompany).then((res) => {
      console.error(res);
      if (this.util.isEmpty(res.data)) {
        console.error("公司列表为空,跳转绑定公司");
        wx.navigateTo({ url: "/pages/bindCompany/index" });
        // wx.navigateTo({ url: "/pages/searchCompany/index" });
      }
    });
  },
  login() {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: (resp) => {
          if (resp.errMsg === "login:ok") {
            request
              .post(this.api.login, resp, this)
              .then((res) => {
                console.log("登录成功", res);
                this.globalData.userInfo = res;
                this.globalData.tenantId = res.tenant_id;
                this.globalData.token = res.access_token;
                this.globalData.refreshToken = res.refresh_token;
                this.globalData.locateCompanyId = res.locateCompanyId;
                this.globalData.openId = res.openId;
                console.log(this.globalData);
                if (this.util.isEmpty(this.globalData.userInfo.phone)) {
                  wx.navigateTo({
                    url: "/pages/authUserInfo/index",
                    success: function (res) {
                      console.log(res);
                    },
                    fail: function (err) {
                      console.error(err);
                    },
                  });
                } else {
                  this.listMyCompanys().then((res) => {});
                  resolve(res);
                }
              })
              .catch((err) => {
                console.error("登录失败", err);
                wx.showToast({
                  title: err.message,
                  icon: "none",
                });
                reject(err);
              });
          } else {
            wx.showToast({
              title: "调用微信登录失败",
              duration: 2000,
            });
            reject();
          }
        },
        fail: (err) => {
          reject(err);
        },
        complete: (res) => {},
      });
    });
  },
  onLaunch: function () {},
});
