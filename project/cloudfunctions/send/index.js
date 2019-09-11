// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  var options = {
    method: 'POST',
    uri: 'https://demo.yaokantv.com:8214/xcx/v1/c=ctrlAc',
    body: {
      deviceId: '',
      mode: 1,
      speed: 0,
      temp: 26,
      windUd: 0,
      windLr: 1,
      power: 0
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'appId': '',
      'openId': '',
      'signature': '',
      'timeStamp': ''
    },
    json: true // Automatically stringifies the body to JSON
  };
  return rp(options)
    .then(function (body) {
      console.log(body);
      return body;
    })
    .catch(function(err){
      console.log(err)
    })
}