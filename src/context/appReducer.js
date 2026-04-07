export const initialState = {
  tasks:[]
}

function appReducer (state,action){
  switch (action.type) {
    case "SET_DATA":
      return {...state,tasks:action.payload}
  
    default:
      return {state}
      break;
  }
}

export default appReducer