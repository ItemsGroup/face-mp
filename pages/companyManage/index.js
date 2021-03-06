/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-10 11:17:45
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-18 14:30:23
 * @Description:
 */
//index.js
//获取应用实例
import request from "../../utils/request";
const app = getApp();

Page({
  data: {
    status: "manage",
    myCompanys: [],
  },
  modifyCompany(e) {
    let comId = e.target.dataset.id;
    let com = this.data.myCompanys.find((item) => {
      return item.id === comId;
    });
    wx.navigateTo({
      url:
        "/pages/bindCompany/index?status=modify&comData=" + JSON.stringify(com),
    });
  },
  onClickBack() {
    wx.navigateBack({
      delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },
  bindCompany() {
    wx.navigateTo({ url: "/pages/bindCompany/index?status=add" });
  },
  calcCompanyClaim(e) {
    let id = e.target.dataset.id;
    let type = e.target.dataset.btn;
    request
      .post(app.api.calcCompanyClaim, { claimStatusEnum: type })
      .then((res) => {});
  },
  refreshMyCompanys() {
    app.listMyCompanys().then((res) => {
      this.setData({
        myCompanys: app.globalData.myCompanys,
      });
      wx.stopPullDownRefresh();
    });
  },
  onPullDownRefresh: function () {
    this.refreshMyCompanys();
  },
  onShow: function () {
    this.refreshMyCompanys();
  },
  checkPhone(authBackParams) {
    if (app.util.isEmpty(app.globalData.userInfo.phone)) {
      const url =
        "/pages/authUserInfo/index?backTo=/pages/bindCompany/index&authBackParams=" +
        (app.util.isEmpty(authBackParams)
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
    }
  },
  onLoad: function (options) {
    wx.stopPullDownRefresh();
    this.checkPhone();
    if (!app.util.isEmpty(options.status)) {
      this.setData({
        status: options.status,
      });
    }
    this.setData({
      myCompanys: app.globalData.myCompanys,
    });
  },
});
