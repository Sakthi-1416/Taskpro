export const initialState = {
  tasks: [],
  search: ""
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        tasks: action.payload
      };

    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload
      };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks]
      };

    case "REPLACE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.tempId ? action.payload.newTask : t
        )
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload)
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, completed: !t.completed }
            : t
        )
      };

    default:
      return state;
  }
}

export default appReducer;