/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-06 10:19:42
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-07 08:56:21
 * @Description:
 */
//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    selectedCompany: {
      id: "",
      companyName: "",
    },
    realName: "",
    idNumber: "",
    errorMsg: {
      company: "",
      realName: "",
      idNumber: "",
    },
  },
  validOnBlur(e) {
    this.validParam(e.target.dataset.name);
  },
  validParam(name) {
    switch (name) {
      case "company":
        if (
          app.util.isEmpty(this.data.selectedCompany.id) ||
          app.util.isEmpty(this.data.selectedCompany.companyName)
        ) {
          this.setData({ "errorMsg.companyName": "请选择入驻公司" });
          return false;
        }
        return true;
        break;
      case "realName":
        if (app.util.isEmpty(this.data.realName)) {
          this.setData({ "errorMsg.realName": "请输入姓名" });
          return false;
        } else if (this.data.realName.length < 2) {
          this.setData({ "errorMsg.realName": "姓名长度最少为两位" });
          return false;
        }
        return true;
        break;
      case "idNumber":
        if (app.util.isEmpty(this.data.idNumber)) {
          this.setData({ "errorMsg.idNumber": "请输入身份证号" });
          return false;
        }
        return true;
        break;
        return true;
    }
  },
  jump2SearchCompanyPage() {
    wx.navigateTo({ url: "/pages/searchCompany/index" });
  },
  onLoad: function () {},
  onShow: function () {
    console.error(this.data.selectedCompany);
  },
});
