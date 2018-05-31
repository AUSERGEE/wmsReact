
let initUserState = {user:'',pwd:'',login:false,User_ScanerID:'',loginTip:false}
const userState = (state = initUserState,action) => {
	switch (action.type) {
		case 'loginIn':
			return {...action.data}
		case 'changeLoginTip':
		  return {...state,...action.data}
		default:
		  return state
	}
}

export {userState}