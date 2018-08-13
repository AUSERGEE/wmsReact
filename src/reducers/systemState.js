
let initSysState = {devToolShow:false}
const systemState = (state = initSysState,action) => {
	switch (action.type) {
		case 'devToolToggle':
			return {...action.data}
		default:
		  return state
	}
}

export {systemState}