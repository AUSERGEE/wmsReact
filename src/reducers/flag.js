
const flag = (state = 1, action) => {
	switch (action.type) {
		case 'updateFlag':
		  return 2
		default:
		  return state
	}
}

const fetchList = (state = {},action) => {
	switch (action.type) {
		case 'fetchDataSave':
		  return {...action.data}
		default:
		  return state
	}
}

export {flag,fetchList}