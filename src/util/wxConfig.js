const aa=22
const getWxConfig=()=>{ 
    let url = location.href.split('#')[0] //获取锚点之前的链接
    
    fetch(`http://wmspda.skyworthdigital.com:9001/webApi/api/Common/GetSignature?url=${url}`).then((res)=>{
        return res.json()
    }).then(res => {
        console.log('WWWWWWWWWWWW:getWxConfig()')
        console.log("this.wxInit(res)")
        this.wxInit(res).then((res)=>{
            return Promise.resolve(res)
        })
    }).catch(e=>{
        return Promise.reject(e)
    })
}
function wxInit(res) {

    let self=this
    wx.config({
        debug: false,
        appId: 'ww58877fbb525792d1',
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: ['checkJsApi', 'scanQRCode']
   });
   wx.ready(function() {
     return new Promise((resolve,reject) => {
        wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: function (res) {
                console.log('wx.checkJsApi-return:'+JSON.stringify(res))
                if(res.err_info){
                    resolve(res)
                }else{
                    reject(res)
                }
            }
        });
      })
   });
   wx.error(function(err) {
      console.log(JSON.stringify(err))
   });
 }


 export default getWxConfig