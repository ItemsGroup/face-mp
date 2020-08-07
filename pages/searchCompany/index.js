/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-06 10:39:00
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-06 14:35:52
 * @Description:
 */
//index.js
//获取应用实例
import request from "../../utils/request";
const app = getApp();

Page({
  data: {
    searchKeyWord: "",
    companys: [],
  },
  selectCompany(e) {
    let item = e.target.dataset.item;
    let pages = getCurrentPages();
    let lastPage = pages[pages.length - 2];
    lastPage.setData({
      selectedCompany: item,
    });
    lastPage.setData({
      ["errorMsg.company"]: errorMsg,
    });
    wx.navigateBack({
      delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },
  searchChange(e) {
    console.log(e.detail);
    request
      .get(app.api.companyQuickSearch, {
        current: 1,
        size: 10,
        name: e.detail,
      })
      .then((res) => {
        this.setData({
          companys: res.data,
        });
      });
  },
  onLoad: function () {},
});
