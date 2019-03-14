const COLLAPSED = 'COLLAPSED'
const CLOSE = 'CLOSE'
const OPEN = 'OPEN'

const ininState = {   
    collapsed:false
}

function toggle(data){
    return {type:COLLAPSED}
}
function close_success(){
    return {type:CLOSE}
}
function open_success(){
    return {type:OPEN}
}

//reducer
export function user(state=ininState,action){
    console.log(action)
    switch(action.type){
        case COLLAPSED:
            return {...state,collapsed:!state.collapsed}
        case CLOSE:
            return {...state,collapsed:true}
        case OPEN:
            return {...state,collapsed:false}
        default:
            return state
    }
}

export function toggleCollapsed(){
    return dispatch => {
        dispatch(toggle())
    }
}
export function close(){
    return dispatch => {
        dispatch(close_success())
    }
}

export function opens(){
    return dispatch => {
        dispatch(open_success())
    }
}



