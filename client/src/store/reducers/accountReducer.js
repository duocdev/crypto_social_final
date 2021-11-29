let init = JSON.parse(sessionStorage.getItem('account'))
if(init == null) init = {username: null}

const accountReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_ACCOUNT':
            sessionStorage.setItem('account', JSON.stringify(action.payload));
            return action.payload;
        case 'CLEAR_ACCOUNT':
            sessionStorage.removeItem('account');
            return { username: null };
        case 'UPDATE_ACCOUNT':
            sessionStorage.setItem('account', JSON.stringify(action.payload));
            return action.payload;

        default:
            return state;
    }
}

export default accountReducer;