/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-05 15:41:56
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-05 16:49:59
 * @Description:
 */
//index.js
//获取应用实例
import request from "../../utils/request";

const app = getApp();

Page({
  data: {},
  onLoad: function () {},
  getPhone: function (e) {
    console.log(e);
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
            .login()
            .then((res) => {
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
