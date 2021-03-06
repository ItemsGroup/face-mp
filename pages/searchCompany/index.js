/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-06 10:39:00
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-17 09:51:23
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
    showEmpty: false,
  },
  onClickBack() {
    wx.navigateBack({
      delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },
  selectCompany(e) {
    let item = e.target.dataset.item;
    let pages = getCurrentPages();
    let lastPage = pages[pages.length - 2];
    lastPage.setData({
      selectedCompany: item,
    });
    lastPage.setData({
      "errorMsg.company": "",
    });
    wx.navigateBack({
      delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },
  searchChange(e) {
    if (!app.util.isEmpty(e.detail)) {
      request
        .get(app.api.companyQuickSearch, {
          current: 1,
          size: 10,
          name: e.detail,
        })
        .then((res) => {
          this.setData({
            companys: res.data,
            showEmpty: true,
          });
          // if (app.util.isEmpty(res.data))
          //   wx.showToast({
          //     title: "没有搜索到相关公司", //提示的内容,
          //     icon: "none", //图标,
          //     duration: 2000, //延迟时间,
          //     mask: true, //显示透明蒙层，防止触摸穿透,
          //     success: (res) => {},
          //   });
        });
    }
  },
  onLoad: function () {},
});
