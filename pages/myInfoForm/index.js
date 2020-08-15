/*
 * @Author: 蜈蚣钻屁眼
 * @Date: 2020-08-11 16:37:24
 * @LastEditors: 蜈蚣钻屁眼
 * @LastEditTime: 2020-08-11 17:36:45
 * @Description:
 */
//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    faceImgs: [],
    phone: "",
    realName: "",
    idNumber: "",
    faceImgHash: "",
    errorMsg: {
      phone: "",
      realName: "",
      idNumber: "",
      faceImg: "",
    },
  },
  onInputChange(e) {
    const name = e.target.dataset.name;
    const val = e.detail;
    this.setData({
      [name]: val,
    });
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
  onLoad: function () {
    const loginInfo = app.globalData.userInfo;
    this.setData({
      phone: loginInfo.phone,
    });
  },
});
