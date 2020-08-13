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
      return (item.id = comId);
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
    });
  },
  onPullDownRefresh: function () {
    app.listMyCompanys().then((res) => {
      this.setData({
        myCompanys: app.globalData.myCompanys,
      });
    });
  },
  onLoad: function (options) {
    wx.stopPullDownRefresh();
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
