/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 11:34:54
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-18 14:50:49
 * @Description:
 */
//index.js
//获取应用实例
const app = getApp();
import request from "../../utils/request";
import QRCode from "../../utils/weapp-qrcode.js";

Page({
  data: {
    showQrCode: true,
    myCompanys: [],
    currentCompany: {},
  },
  onCloseAuthMenu() {},
  onAuthPhone(e) {
    console.log(e.detail);
  },
  onTapCompany(e) {
    wx.navigateTo({ url: "/pages/companyManage/index?status=chose" });
  },
  jump2AddCom(e) {
    wx.navigateTo({ url: "/pages/bindCompany/index?status=add" });
  },
  onChangeCompany: function ({ detail }) {
    this.choseCom(detail);
  },
  choseCom(company) {
    if (company.applyStatus === "pass") {
      this.setData({ showQrCode: true });
      this.genCompanyQrCode();
    } else {
      this.setData({ showQrCode: false });
    }
  },
  genCompanyQrCode: function () {
    request.get(app.api.getQrCodeStr, {}).then((res) => {
      new QRCode("companyInQrCode", {
        text: res.data,
        width: 200,
        height: 200,
        padding: 5, // 生成二维码四周自动留边宽度，不传入默认为0
        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        callback: (res) => {
          console.log(res.path);
          // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        },
      });
      setTimeout(() => {
        this.genCompanyQrCode();
      }, 290000);
    });
  },
  init() {
    app.login().then((res) => {
      wx.stopPullDownRefresh();
      const myComs = app.globalData.myCompanys;
      if (!app.util.isEmpty(myComs)) {
        this.setData({
          myCompanys: myComs,
          currentCompany: app.getDefaultCom(),
        });
        this.choseCom(this.data.currentCompany);
      }
    });
  },
  onPullDownRefresh: function () {
    this.init();
  },
  onLoad: function () {
    wx.stopPullDownRefresh();
    this.init();
  },
  onShow() {
    const myComs = app.globalData.myCompanys;
    if (!app.util.isEmpty(myComs)) {
      this.setData({
        myCompanys: myComs,
        currentCompany: app.getDefaultCom(),
      });
      this.choseCom(this.data.currentCompany);
    }
  },
  onShareAppMessage(obj) {
    return {
      path: "/pages/index/index",
      title: "智慧改变生活",
      imageUrl: "https://static.techmini.cn/shareImg0814155049.jpeg",
    };
  },
});
