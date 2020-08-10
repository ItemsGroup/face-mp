/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-06 10:19:42
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-10 18:44:57
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
  },
  onInputChange(e) {
    const name = e.target.dataset.name;
    console.log(name, e.detail);
    if (name === "realName")
      this.setData({
        realName: e.detail,
      });
    else if (name === "idNumber")
      this.setData({
        idNumber: e.detail,
      });
  },
  bindCompany() {
    if (this.validAll()) {
      request
        .post(app.api.bindCompany, {
          faceImgHash: this.data.faceImgHash,
          idCardNumber: this.data.idNumber,
          locateCompanyId: this.data.selectedCompany.id,
          name: this.data.realName,
        })
        .then((res) => {
          if (res.code === 200) {
          }
        });
    }
  },
  deleteFaceImg(e) {
    this.setData({
      faceImgHash: "",
      faceImgs: [],
      "errorMsg.faceImg": "人脸图片不能为空",
    });
  },
  afterImgRead(e) {
    const file = e.detail.file;
    console.log("file:", e);
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
    console.log("validParams:", name);
    console.log("company:", this.data.selectedCompany);
    console.log("realName:", this.data.realName);
    console.log("faceImgHash:", this.data.faceImgHash);
    switch (name) {
      case "company":
        if (
          app.util.isEmpty(this.data.selectedCompany.id) ||
          app.util.isEmpty(this.data.selectedCompany.companyName)
        ) {
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
          this.setData({ "errorMsg.realName": "请输入姓名" });
          return false;
        } else if (this.data.realName.length < 2) {
          this.setData({ "errorMsg.realName": "姓名长度最少为两位" });
          return false;
        } else {
          this.setData({ "errorMsg.realName": "" });
          return true;
        }
        break;
      case "faceImg":
        if (app.util.isEmpty(this.data.faceImgHash)) {
          this.setData({ "errorMsg.faceImgHash": "请选择人脸识别照片" });
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
  onLoad: function (options) {
    if (!app.util.isEmpty(options.status)) {
      this.setData({
        status: options.status,
      });
    }
    if (!app.util.isEmpty(options.comData)) {
      let data = JSON.parse(options.comData);
      console.log(data);
      this.setData({
        modifyData: data,
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
      });
    }
  },
  onShow: function () {
    console.error(this.data.selectedCompany);
  },
});
