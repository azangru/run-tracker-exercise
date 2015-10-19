const initialState = {
  test: 'THIS IS TEST!',
  username: '',
  firstName: '',
  lastName: '',
  role: '',
  isLoggedIn: false,
  runs: []
};

let userReducer = (state=initialState, action) => {
  switch (action.type) {
  case 'LOGIN_SUCCESSFUL':
    return {
      ...state,
      username: action.username,
      firstName: action.firstName,
      lastName: action.lastName,
      role: action.role,
      isLoggedIn: true
    };
  case 'LOGIN_FAILED':
    return {
      ...state,
      error: action.error
    };
  default:
    return initialState;
  }
};

export default userReducer;
