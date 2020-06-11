A.I.Solution

How to use login:
- After login sucess, login data has been saved to AsyncStore and auto map to Redux store
- Look at userReducers (default)
const initialState = {
  ...
  userData: {
    ...
    adUserId: 21447,
    loggedIn: {
      userName: '', // user code
      userFullName: '',
      adUserId: 0,
      adUserId: userId,
      roleId: 0,
      roleName: '',
      adOrgId: 0,
      adOrgName: '',
      adUserDepartmentId: 0,
      departmentName: '',
    }
  },
};

- Use Redux connect to map data, example:

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, { })(YourScreenComponent);

- Now you can use login data inside component via props, example:
let adOrgId = this.props.userData.loggedIn.adOrgId;
let roleId = this.props.userData.loggedIn.roleId;
let departmentId = this.props.userData.loggedIn.adUserDepartmentId;
let adUserId = this.props.userData.loggedIn.adUserId;

- Note: DO NOT use adOrgId and adUserDepartmentId inside userData