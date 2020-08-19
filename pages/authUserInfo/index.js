/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-05 15:41:56
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-18 14:48:36
 * @Description:
 */
//index.js
//获取应用实例
import request from "../../utils/request";

const app = getApp();

Page({
  data: {
    showBack: true,
    authBackParams: "",
    backTo: "",
    isClickBack: false,
  },
  onUnload() {
    if (!this.data.isClickBack) {
      const pages = getCurrentPages();
      if (pages.length > 2) {
        const url = "/" + pages[pages.length - 3].route;
        if (url === "/pages/index/index" || url === "/pages/my/index")
          wx.switchTab({ url: url });
        else wx.redirectTo({ url: url });
      }
    }
  },
  onLoad: function (options) {
    this.setData({
      showBack: options.showBack === "1",
      backTo: app.util.isEmpty(options.backTo) ? "" : options.backTo,
    });
    if (!app.util.isEmpty(options.authBackParams))
      this.setData({ authBackParams: options.authBackParams });
  },
  onClickBack() {
    this.setData({
      isClickBack: true,
    });
    this.setAuthBackParams();
    if (app.util.isEmpty(this.data.backTo))
      wx.navigateBack({
        delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    else wx.navigateTo({ url: this.data.backTo });
  },
  setAuthBackParams() {
    const pages = getCurrentPages();
    const lastPage = pages[pages.length - 2];
    if (!app.util.isEmpty(this.data.authBackParams))
      lastPage.setData({
        authBackParams: this.data.authBackParams,
      });
  },
  getPhone: function (e) {
    let data = e.detail;
    if (data.errMsg === "getPhoneNumber:ok") {
      let encryptedData = data.encryptedData;
      let iv = data.iv;
      request
        .get(app.api.decodeUserInfo, {
          encryptedData,
          iv,
          openId: app.globalData.openId,
          sourceScope: "mini",
        })
        .then((res) => {
          app
            .login(this.data.authBackParams)
            .then((loginRes) => {
              this.setAuthBackParams();
              this.setData({
                isClickBack: true,
              });
              wx.navigateBack({
                delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
              });
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    }
  },
});
