import wx from 'weixin-js-sdk'
const aa=22
const afun=()=>{
   bfun()
}
function bfun(){
   alert('7788')
}
const getWxConfig=()=>{ 
    let url = location.href.split('#')[0] //获取锚点之前的链接
    
    fetch(`http://wmspda.skyworthdigital.com:9001/webApi/api/Common/GetSignature?url=${url}`).then((res)=>{
        return res.json()
    }).then(res => {
        console.log('WWWWWWWWWWWW:getWxConfig()')
        console.log("this.wxInit(res)")
        setTimeout(function(){
            alert('::::s')
        },0)
      
        wxInit(res)
         
    }).catch(e=>{
        return Promise.reject(e)
    })
}
function wxInit(res) {
    let self=this
    console.log(wx)

    console.log(wx)
    wx.config({
            debug: false,
            appId: 'ww58877fbb525792d1',
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: ['checkJsApi', 'scanQRCode']
    });
    
  
 }

 wx.ready(function() {
    wx.checkJsApi({
        jsApiList: ['scanQRCode'],
        success: function (res) {
            console.log('wx.checkJsApi-return:'+JSON.stringify(res))
            if(res.err_info){
                alert('dd')
            }else{
                alert('ddaa')
            }
        }
    });
})
wx.error(function(err) {
     console.log(JSON.stringify(err))
});

 export {getWxConfig,afun} 