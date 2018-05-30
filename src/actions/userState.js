
const userState = (data) => {
	return {
		type:'loginIn',
        data
	}
}
const changeLoginTip = (data) => {
	return {
		type:'changeLoginTip',
        data
	}
}
export {userState,changeLoginTip}