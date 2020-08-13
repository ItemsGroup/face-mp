/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 11:51:19
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-12 16:41:49
 * @Description:
 */
//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    com: {},
  },
  jump2MyCompany() {
    wx.navigateTo({ url: "/pages/companyManage/index" });
  },
  jump2MyInfo() {
    wx.navigateTo({ url: "/pages/authUserInfo/index?showBack=1" });
  },
  parsePhone(phone) {
    if (app.util.isEmpty(phone)) return "";
    return phone.substring(0, 3) + "****" + phone.substring(6);
  },
  onLoad: function () {
    this.setData({
      com: app.getDefaultCom(),
      phone: this.parsePhone(app.globalData.userInfo.phone),
    });
  },
});
