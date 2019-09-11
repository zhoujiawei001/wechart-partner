// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  var options = {
    method: 'GET',
    uri: 'https://demo.yaokantv.com:8214/xcx/v1/remotes',
    headers: {
      'appId': event.appId,
      'openId': event.openId,
      'signature': event.signature,
      'timeStamp': event.timeStamp
    },
    json: true // Automatically stringifies the body to JSON
  };
  return rp(options)
    .then(function (body) {
      console.log(body);
      return body;
    })
    .catch(function (err) {
      console.log(err)
    })
}