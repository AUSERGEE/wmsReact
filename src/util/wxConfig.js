function getConfig() { 
    console.log('lllogo')
    let url = location.href.split('#')[0] //获取锚点之前的链接
    fetch(`http://wmspda.skyworthdigital.com:9009/webApi/api/Common/GetSignature?url=${url}`).then((res)=>{
        return res.json()
    }).then(res => {
        wxInit(res);
        console.log(res)
    }).catch(e=>{
        console.log(e)
    })
}

function wxInit(res) {
    wx.config({
        debug: false,
        appId: 'ww58877fbb525792d1',
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: ['checkJsApi', 'scanQRCode']
   });
  
   wx.ready(function() {
      wx.checkJsApi({
          jsApiList: ['scanQRCode'],
          success: function (res) {
          }
      });
      console.log('dfd')
      wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              alert("扫描结果："+result);
              
          }
      });

   });
   wx.error(function(err) {
      console.log(JSON.stringify(err))
   });
 }


 export default getConfig