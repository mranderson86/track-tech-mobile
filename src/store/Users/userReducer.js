// Estado do usuário
const INITIAL_STATE = {
  authenticate: false,
  token: "",
  user: {}
};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "UPDATE_USER": {
      const { authenticate, user, token } = action.payload;
      const newState = { ...state, authenticate, user, token };
      return newState;
    }

    default:
      return state;
  }
}

export default userReducer;
