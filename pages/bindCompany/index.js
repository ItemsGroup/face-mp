/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-06 10:19:42
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-17 09:42:08
 * @Description:
 */
//index.js

import request from "../../utils/request";

//获取应用实例
const app = getApp();

Page({
  data: {
    faceImgs: [],
    selectedCompany: {
      id: "",
      companyName: "",
    },
    realName: "",
    idNumber: "",
    faceImgHash: "",
    errorMsg: {
      company: "",
      realName: "",
      idNumber: "",
      faceImg: "",
    },
    status: "add",
    modifyData: {},
    employeeId: "",
    authBackParams: "",
    submiting: false,
    showClaim: false,
  },
  onInputChange(e) {
    const name = e.target.dataset.name;
    const val = e.detail;
    this.setData({
      [name]: val,
    });
  },
  onClickBack() {
    const pages = getCurrentPages();
    if (pages.length > 1)
      wx.navigateBack({
        delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    else wx.navigateTo({ url: "/pages/index/index" });
  },
  bindCompany() {
    if (this.validAll()) {
      if (this.data.submiting) {
        wx.showToast({
          title: "提交中,请稍后", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: (res) => {},
        });
        return;
      } else {
        this.setData({
          submiting: true,
        });
      }
      const subData = {
        faceImgHash: this.data.faceImgHash,
        idCardNumber: this.data.idNumber,
        locateCompanyId: this.data.selectedCompany.id,
        name: this.data.realName,
        id: this.data.employeeId,
      };
      const requestUrl =
        this.data.status === "add" || this.data.status === "qrAdd"
          ? app.api.bindCompany
          : app.api.updateMyComInfo;
      request.post(requestUrl, subData).then((res) => {
        app.listMyCompanys().then((res) => {
          this.setData({
            submiting: false,
          });
          const pages = getCurrentPages();
          if (
            pages.length > 1 &&
            pages[pages.length - 2].route !== "pages/authUserInfo/index"
          )
            wx.navigateBack({
              delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
          else wx.switchTab({ url: "/pages/index/index" });
        });
      });
    } else {
      // wx.showToast({
      //   title: "请填写正确信息", //提示的内容,
      //   icon: "none", //图标,
      //   duration: 2000, //延迟时间,
      //   mask: true, //显示透明蒙层，防止触摸穿透,
      //   success: (res) => {},
      // });
    }
  },
  deleteFaceImg(e) {
    this.setData({
      faceImgHash: "",
      faceImgs: [],
      "errorMsg.faceImg": "头像不能为空",
    });
  },
  afterImgRead(e) {
    const file = e.detail.file;
    console.error(file.size / 1000);
    if (file.size > 1048576) {
      wx.showToast({
        title: "图片不能大于1M", //提示的内容,
        icon: "none", //图标,
        duration: 3000, //延迟时间,
        mask: false, //显示透明蒙层，防止触摸穿透,
        success: (res) => {},
      });
      return;
    }
    const that = this;
    request
      .get(app.api.qnUploadToken, {
        filenames:
          new Date().getTime() +
          file.path.substring(file.path.lastIndexOf(".")),
      })
      .then((res) => {
        const token = res.data;
        wx.uploadFile({
          url: "https://up-z0.qiniup.com",
          name: "file",
          filePath: file.path,
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: {
            token: token[0].token,
            key: token[0].hashCodeName,
          },
          success: function (resp) {
            const data = JSON.parse(resp.data);
            that.setData({
              faceImgHash: data.key,
              faceImgs: [
                {
                  url: app.globalData.qiniuUrlPrefix + data.key,
                  isImage: true,
                  deletable: true,
                },
              ],
              "errorMsg.faceImg": "",
            });
          },
          fail: function (resp) {
            console.error(resp);
          },
        });
      });
  },
  validOnBlur(e) {
    this.validParam(e.target.dataset.name);
  },
  validAll() {
    return (
      this.validParam("company") &&
      this.validParam("realName") &&
      this.validParam("faceImg")
    );
  },
  validParam(name) {
    switch (name) {
      case "idNumber":
        if (app.util.isEmpty(this.data.idNumber)) {
          break;
        } else if (!app.util.isIDNumber(this.data.idNumber)) {
          wx.showToast({
            title: "请输入正确的身份证号", //提示的内容,
            icon: "none", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: (res) => {},
          });
          this.setData({ "errorMsg.companyName": "请输入正确的身份证号" });
          return false;
        }
      case "company":
        if (
          app.util.isEmpty(this.data.selectedCompany.id) ||
          app.util.isEmpty(this.data.selectedCompany.companyName)
        ) {
          wx.showToast({
            title: "请选择入驻公司", //提示的内容,
            icon: "none", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: (res) => {},
          });
          this.setData({ "errorMsg.companyName": "请选择入驻公司" });
          return false;
        } else {
          this.setData({
            "errorMsg.companyName": "",
          });
          return true;
        }
        break;
      case "realName":
        if (app.util.isEmpty(this.data.realName)) {
          wx.showToast({
            title: "请输入姓名", //提示的内容,
            icon: "none", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: (res) => {},
          });
          this.setData({ "errorMsg.realName": "请输入姓名" });
          return false;
        } else if (this.data.realName.length < 2) {
          wx.showToast({
            title: "姓名长度最少为两位", //提示的内容,
            icon: "none", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: (res) => {},
          });
          this.setData({ "errorMsg.realName": "姓名长度最少为两位" });
          return false;
        } else {
          this.setData({ "errorMsg.realName": "" });
          return true;
        }
        break;
      case "faceImg":
        if (!app.util.isEmpty(this.data.faceImgHash)) {
          // if (app.util.isEmpty(this.data.faceImgHash)) {
          wx.showToast({
            title: "请选择头像", //提示的内容,
            icon: "none", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: (res) => {},
          });
          this.setData({ "errorMsg.faceImgHash": "请选择头像" });
          return false;
        } else {
          this.setData({ "errorMsg.faceImgHash": "" });
          return true;
        }
        break;
        return true;
    }
  },
  jump2SearchCompanyPage(e) {
    if (this.data.status === "add") {
      wx.navigateTo({ url: "/pages/searchCompany/index" });
    }
  },
  getQrCom(locateCompanyId) {
    request
      .get(app.api.locatCompanyDetail, { id: locateCompanyId }, app)
      .then((res) => {
        this.setData({
          selectedCompany: {
            companyName: res.data.companyName,
            id: locateCompanyId,
          },
        });
      });
  },
  onLoad: function (options) {
    if (
      app.util.isEmpty(options.q) &&
      app.util.isEmpty(this.data.authBackParams) &&
      app.util.isEmpty(options.authBackParams)
    ) {
      if (!app.util.isEmpty(options.status)) {
        this.setData({
          status: options.status,
        });
      }
      if (!app.util.isEmpty(options.comData)) {
        let data = JSON.parse(options.comData);
        this.setData({
          modifyData: data,
          employeeId: data.employeeId,
          selectedCompany: {
            companyName: data.companyName,
            id: data.id,
          },
          realName: data.name,
          idNumber: data.idCardNumber,
          faceImgHash: data.faceImgHash,
          faceImgs: [
            {
              url: data.faceImgUrl,
              isImage: true,
              deletable: true,
            },
          ],
          showClaim: data.claimStatus === "claimReject",
        });
      }
    } else {
      this.setData({
        status: "qrAdd",
      });
      if (!app.util.isEmpty(options.q)) {
        let q = decodeURIComponent(options.q);
        let urlParams = app.util.getURLParameters(q);
        let locateCompanyId = urlParams.locateCompanyId;
        app.login(urlParams).then((loginRes) => {
          this.getQrCom(locateCompanyId);
        });
      } else {
        let authBackParams = app.util.isEmpty(this.data.authBackParams)
          ? options.authBackParams
          : this.data.authBackParams;
        let urlParams = JSON.parse(authBackParams);
        let locateCompanyId = urlParams.locateCompanyId;
        this.getQrCom(locateCompanyId);
      }
    }
  },
});
