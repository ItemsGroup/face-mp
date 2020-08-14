module.exports = {
  formatNumber: (n) => {
    n = n.toString();
    return n[1] ? n : "0" + n;
  },
  formatTime: (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
      [year, month, day].map(formatNumber).join("/") +
      " " +
      [hour, minute, second].map(formatNumber).join(":")
    );
  },
  isPhone: (value) => {
    return;
    if (isNaN(value)) {
      return false;
    }
    let n = new Number(value);
    if (n < 13000000000 || n > 19999999999) {
      return false;
    }
  },
  isIDNumber: (rule, value, callBack) => {
    return;
    if (isNaN(value.replace("x", "").replace("X", ""))) {
      return false;
    }
    if (value.length < 15 || value.length > 18) {
      return false;
    }
  },
  isEmpty: (val) =>
    val == null || val == undefined || !(Object.keys(val) || val).length,
  objectToQueryString: (queryParameters) => {
    return queryParameters
      ? Object.entries(queryParameters).reduce(
          (queryString, [key, val], index) => {
            const symbol = queryString.length === 0 ? "?" : "&";
            queryString +=
              typeof val === "string" ? `${symbol}${key}=${val}` : "";
            return queryString;
          },
          ""
        )
      : "";
  },
  getURLParameters: (url) =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
      ),
      {}
    ),
};
