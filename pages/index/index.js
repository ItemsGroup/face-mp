/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-04 11:34:54
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-06 10:10:41
 * @Description:
 */
//index.js
//获取应用实例
const app = getApp();
import request from "../../utils/request";
import QRCode from "../../utils/weapp-qrcode.js";

Page({
  data: {
    myCompanys: [
      {
        text: "宇宙洪荒唯我独尊",
        value: 1,
      },
      {
        text: "公司2",
        value: 2,
      },
    ],
    currentCompany: 1,
  },
  onCloseAuthMenu() {},
  onAuthPhone(e) {
    console.log(e.detail);
  },
  changeCompany: function ({ detail }) {
    console.log("选择公司:", detail);
    this.genCompanyQrCode("aaaaaaaaaa" + detail);
  },
  genCompanyQrCode: function (company) {
    console.log("生成小程序二维码:", company);
    new QRCode("companyInQrCode", {
      text: "http://www.tongxingschool.com" + company,
      width: 280,
      height: 280,
      padding: 5, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path);
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
      },
    });
  },
  onLoad: function () {
    app.login().then((res) => {
      // this.genCompanyQrCode("a");
    });
  },
});
