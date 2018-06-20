let recipienInitState={
     orderId:'',
     num:null,
     intitStorge:null,
     text:'',
     poVal:'',
     matail:'',
     org:'',
     checkStorge:false,
     IsSplitReceipt:0,
     cSupplierCode:'',
     supplierName:'',
     resetRecepientForm:false,
     QRCode:null,
     QRCodeDate:null,
     spareOrderId:''
}
const recipienState = (state=recipienInitState,action)=>{
    switch (action.type){
        case 'updateData':
          return {...state,...action.data}
        default:
          return state
    }
}

export {recipienState}

