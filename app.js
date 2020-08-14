/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 11:05:23
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-14 10:00:30
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
    qiniuUrlPrefix: "http://qeh9ngol7.bkt.clouddn.com/",
    myCompanys: [],
  },
  api: {
    login: "/blade-auth/oauth/weChatToken",
    decodeUserInfo: "/blade-auth/decodeUserInfo",
    listMyCompany:
      "/device/c/locate-company-employee-apply/getLocateCompanyList",
    companyQuickSearch:
      "/device/c/locate-company-employee-apply/selectLocateCompanyListAll",
    qnUploadToken: "/qiNiu/clientUploadToken",
    bindCompany: "/device/c/locate-company-employee-apply/applyCompany",
    updateMyComInfo: "/device/c/mine/updateMineInfo",
    listAllMyCompany:
      "/device/c/locate-company-employee-apply/getLocateCompanyListAll",
    calcCompanyClaim:
      "/device/c/locate-company-employee-apply/calcCompanyClaim",
    getQrCodeStr: "/device/c/locate-company-employee-apply/getOpenQr",
    locatCompanyDetail:
      "/device/c/locate-company-employee-apply/getLocateCompanyDetail",
  },
  util: {
    isEmpty: (val) =>
      val == null || val == undefined || !(Object.keys(val) || val).length,
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
    getURLParameters: (url) =>
      (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => (
          (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
        ),
        {}
      ),
  },
  getDefaultCom() {
    const coms = this.globalData.myCompanys;
    let defaultCom = coms.find((item) => {
      return item.isDefault === 1;
    });
    if (this.util.isEmpty(defaultCom))
      defaultCom = coms.find((item) => {
        return item.occupationStatus === "on";
      });
    return this.util.isEmpty(defaultCom) ? coms[0] : defaultCom;
  },
  listMyCompanys(authBackParams) {
    return new Promise((resolve, reject) => {
      request.get(this.api.listAllMyCompany).then((res) => {
        const pages = getCurrentPages();
        if (
          this.util.isEmpty(res.data) &&
          pages[pages.length - 1].route !== "pages/bindCompany/index"
        ) {
          if (this.util.isEmpty(authBackParams))
            wx.navigateTo({ url: "/pages/bindCompany/index?status=add" });
          else
            wx.navigateTo({
              url:
                "/pages/bindCompany/index?authBackParams=" +
                (typeof authBackParams === "string"
                  ? authBackParams
                  : JSON.stringify(authBackParams)),
            });
          // wx.navigateTo({ url: "/pages/searchCompany/index" });
        } else {
          this.globalData.myCompanys = res.data.map((item) => {
            item.value = item.id;
            item.text = item.companyName;
            item.faceImgUrl = this.globalData.qiniuUrlPrefix + item.faceImgHash;
            return item;
          });
          resolve(res);
        }
      });
    });
  },
  login(authBackParams) {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: (resp) => {
          if (resp.errMsg === "login:ok") {
            request
              .post(this.api.login, resp, this)
              .then((res) => {
                this.globalData.userInfo = res;
                this.globalData.tenantId = res.tenant_id;
                this.globalData.token = res.access_token;
                this.globalData.refreshToken = res.refresh_token;
                this.globalData.locateCompanyId = res.locateCompanyId;
                this.globalData.openId = res.openId;
                if (this.util.isEmpty(this.globalData.userInfo.phone)) {
                  const url =
                    "/pages/authUserInfo/index?authBackParams=" +
                    (this.util.isEmpty(authBackParams)
                      ? ""
                      : typeof authBackParams === "string"
                      ? authBackParams
                      : JSON.stringify(authBackParams));
                  wx.navigateTo({
                    url: url,
                    success: function (res) {},
                    fail: function (err) {
                      console.error(err);
                    },
                  });
                } else {
                  this.listMyCompanys(authBackParams).then((companysRes) => {
                    resolve({
                      login: res,
                      companysRes: companysRes,
                    });
                  });
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
