import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { HEIGHTXD, getFontXD, WIDTHXD, getWidth } from '../../config/Function';
import R from 'assets/R';
import _ from 'lodash';

import ItemPicker from '../VOffice/common/ItemPicker';
import PickerSearch from '../../common/Picker/PickerSearch';
import { PostData, GetData } from '../../apis/helpers';
import { NetworkSetting } from '../../config/Setting';
import { showAlert, TYPE } from 'common/DropdownAlert';
import { createSession, createSessionMobile } from '../../apis/Functions/users';
import { connect } from 'react-redux';
import { getUserInfor } from '../../actions/users';
import i18n from 'assets/languages/i18n';
import { showLoading, hideLoading } from 'common/Loading/LoadingModal';
import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorageUtils from 'helpers/AsyncStorageUtils';
import { saveDeviceToken } from '../../apis/Functions/users'
import { initDeparment } from '../../actions/advanceRequest'


export const localFilter = (data, allowFields = [], search_text) => {
  if (!data) return [];
  if (!search_text || search_text === '') return data;

  let result = [];
  data.map(item => {
    if (!allowFields) {
      result.push(item);
    } else {
      let added = false;
      allowFields.map(param => {
        if (!added && (item[param + ''] + '').toLowerCase().includes(search_text.toLowerCase())) {
          result.push(item);
          added = true;
        }
      });
    }
  })
  return result;
}

class Login extends Component {
  user = null;
  userId = '';
  roleId = '';
  adOrgId = '1000000';
  departmentId = '';

  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      role: '',
      adOrgs: [],
      adOrg: '',
      departments: [],
      department: '',
      userName: '061714',
    }
  }

  componentDidMount() {
    this.loadCache();
  }

  loadCache = async () => {
    let roleCache = await AsyncStorage.getItem('loginRole');
    if (roleCache) {
      roleCache = JSON.parse(roleCache);
      this.roleId = roleCache.roleId;
      this.setState({ role: roleCache.role });
    }
    let adOrgCache = await AsyncStorage.getItem('loginAdOrg');
    if (adOrgCache) {
      adOrgCache = JSON.parse(adOrgCache);
      this.adOrgId = adOrgCache.adOrgId;
      this.setState({ adOrg: adOrgCache.adOrg });
    }
    let departmentCache = await AsyncStorage.getItem('loginDepartment');
    if (departmentCache) {
      departmentCache = JSON.parse(departmentCache);
      this.departmentId = departmentCache.departmentId;
      this.setState({ department: departmentCache.department });
    }
    let userCache = await AsyncStorage.getItem('loginUser');
    if (userCache) {
      userCache = JSON.parse(userCache);
      // console.log('userCache', userCache)
      this.user = userCache;
      this.userId = userCache.adUserId;
    }

    if (roleCache && adOrgCache && departmentCache && userCache) {
      // console.log(userCache)
      // console.log('detect cache, login')
      this.login(this.state.userName, userCache.adUserId, roleCache.roleId, adOrgCache.adOrgId, departmentCache.departmentId);
    } else {
      this.fetch();
    }
  }

  fetch = async () => {
    let roles = [];
    let adOrgs = [];
    let departments = [];

    this.userId = await this.fetchUserId();
    roles = await this.fetchRoles();
    // auto fill default data
    let role = '';
    const findRole = roles.filter(x => x.adRoleId === 1051);
    if (findRole && findRole.length > 0) {
      role = findRole[0].name;
      this.roleId = findRole[0].adRoleId;
    }

    adOrgs = await this.fetchAdOrgs();
    let adOrg = '';
    const findAdOrg = adOrgs.filter(x => x.adOrgId === 1000000);
    if (findAdOrg && findAdOrg.length > 0) {
      adOrg = findAdOrg[0].name;
      this.adOrgId = findAdOrg[0].adOrgId;
    }

    this.pickerAdOrg && this.pickerAdOrg.onChangeText('');
    departments = await this.fetchDepartment();
    let department = '';
    const findDepartment = departments.filter(x => x.departmentId === 1016763);
    if (findDepartment && findDepartment.length > 0) {
      department = findDepartment[0].name;
      this.departmentId = findDepartment[0].departmentId;
    }

    this.setState({ roles, adOrgs, departments, role, adOrg, department });
  }

  fetchAdOrgs = async (search_text = '') => {
    // get ad org
    try {
      if (this.state.fetchingAdOrgs) return;
      const response = await PostData(`${NetworkSetting.ROOT}/erp-service/adUserOrgaccessServiceRest/adUserOrgaccess/search`, {
        "adUserId": this.userId,
      }, false);

      // console.log('fetchAdOrgs', response.data)
      const data = response.data ? localFilter(response.data, ['adOrgName', 'adOrgId'], search_text).map(x => ({
        id: x.adOrgId,
        text: x.adOrgName,
        adOrgId: x.adOrgId,
        name: x.adOrgName,
        value: '',
      })) : [];

      // remove duplicate
      let result = [];
      data.map(item => {
        let exists = result.filter(x => x.adOrgId === item.adOrgId);
        if (!exists || exists.length === 0) result.push(item);
      })
      // console.log(result)
      return result;
    } catch (error) {
      console.log(error)
      return [];
    }
  }

  fetchRoles = async () => {
    try {
      const response = await GetData(`${NetworkSetting.ROOT}/erp-service/adRoleServiceRest/getByUserName/${this.state.userName}`);
      return response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  fetchDepartment = async (search_text = '') => {
    try {
      const response = await GetData(`${NetworkSetting.ROOT}/erp-service/cDepartmentServiceRest/getByOrgList/${this.adOrgId}/${this.state.userName}`);
      _.forEach(response.data, item => {
        if (item.isFinanceDepartment === 'Y') {
          console
          this.props.initDeparment({ departmentName: item.name, departmentId: item.departmentId })
        }
      })
      // console.log('fetchDepartment', response)
      return response.data ? localFilter(response.data, ['departmentId', 'name', 'text'], search_text) : [];
    } catch (error) {
      return [];
    }
  }

  fetchUserId = async () => {
    try {
      const response = await GetData(`${NetworkSetting.ROOT}/erp-service/adUserServiceRest/getUserInfoByUserName/${this.state.userName}`);
      this.user = response.data;
      return response.data ? response.data.adUserId : '';
    } catch (error) {
      console.log(error)
      return '';
    }
  }

  onLoginPress = () => {
    // console.log(this.userId, this.roleId, this.adOrgId, this.departmentId);
    const { userName, adOrg } = this.state;
    if (!this.roleId || this.roleId === '') {
      showAlert(TYPE.WARN, 'Cảnh báo', 'Vui lòng chọn vai trò đăng nhập.');
      return;
    }
    if (!adOrg || adOrg === '') {
      showAlert(TYPE.WARN, 'Cảnh báo', 'Vui lòng chọn đơn vị đăng nhập.');
      return;
    }
    if (!this.departmentId || this.departmentId === '') {
      showAlert(TYPE.WARN, 'Cảnh báo', 'Vui lòng chọn phòng ban đăng nhập.');
      return;
    }

    this.login(userName, this.userId, this.roleId, this.adOrgId, this.departmentId);
  }

  login = async (userName, userId, roleId, adOrgId, departmentId) => {
    try {
      const { role, adOrg, department } = this.state;
      // create session
      let bodyCreateSession = {
        userName: userName,
        userId: userId,
        roleId: roleId,
        orgIdList: [adOrgId],
        departmentIdList: [departmentId]
      }
      showLoading();
      const responseCreateSession = await createSession(bodyCreateSession);
      const responseCreateMobileSession = await createSessionMobile(bodyCreateSession);
      // console.log('responseCreateSession', responseCreateSession)
      if (responseCreateSession.status === 200) {
        // showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), 'Đăng nhập thành công');
        this.props.onLoginSuccess && this.props.onLoginSuccess();

        // save cache, do not remove await
        AsyncStorage.setItem('loginRole', JSON.stringify({ roleId: roleId, role }));
        AsyncStorage.setItem('loginAdOrg', JSON.stringify({ adOrgId: adOrgId, adOrg }));
        AsyncStorage.setItem('loginDepartment', JSON.stringify({ departmentId: departmentId, department }));

        const loggedIn = {
          userName, // user code
          adUserId: userId,
          roleId,
          adOrgId,
          adUserDepartmentId: departmentId,
          userFullName: this.user.fullname,
          roleName: this.state.role,
          adOrgName: this.state.adOrg,
          departmentName: this.state.department,
        }
        this.user.loggedIn = loggedIn;
        // save user cache with login info
        AsyncStorage.setItem('loginUser', JSON.stringify(this.user));
        // map to store
        this.props.getUserInfor(this.user);
        let fcmToken = await AsyncStorageUtils.get(AsyncStorageUtils.KEY.FCM_TOKEN);
        let body = {
          deviceToken: fcmToken
        }
        saveDeviceToken(body)
      }
    } catch (error) {
      console.log(error)
      error.config && console.log(error.config)
    } finally {
      hideLoading();
    }
  }

  render() {
    const { roles, role, adOrgs, adOrg, departments, department } = this.state;

    // console.log('render departments', departments);
    return (
      <ImageBackground style={{
        flex: 1,
        marginRight: -WIDTHXD(150),
        backgroundColor: '#ECF0FB'
      }}
        source={require('../../assets/images/login/login_bg.png')}>
        <SafeAreaView style={{ flex: 1, marginRight: WIDTHXD(150) }}>
          <Image
            style={{
              marginTop: HEIGHTXD(127),
              width: WIDTHXD(492),
              height: HEIGHTXD(309),
              alignSelf: 'center',
              marginBottom: HEIGHTXD(76),
              resizeMode: 'contain'
            }}
            source={require('../../assets/images/login/logo_with_text.png')}
          />
          <View style={{
            width: WIDTHXD(1004),
            minHeight: Platform.OS === 'android' ? HEIGHTXD(1273) : HEIGHTXD(1173),
            borderRadius: WIDTHXD(60),
            paddingLeft: WIDTHXD(72),
            paddingRight: WIDTHXD(74),
            backgroundColor: 'white',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,

            elevation: 2,
            alignSelf: 'center',
          }}>
            <Text style={styles.text_title}>Đăng nhập tài khoản</Text>
            <ItemPicker
              title='Vai trò'
              data={roles}
              containerStyles={{ paddingHorizontal: 0 }}
              width={WIDTHXD(858)}
              height={HEIGHTXD(120)}
              value={role}
              onValueChange={(_, item) => {
                this.setState({ role: item.name });
                this.roleId = item.adRoleId;
              }}
            />
            <Text style={styles.input_title}>Đơn vị</Text>
            <PickerSearch
              ref={ref => this.pickerAdOrg = ref}
              width={WIDTHXD(858)}
              title='Đơn vị'
              height={HEIGHTXD(120)}
              value={adOrg}
              data={adOrgs}
              findData={this.fetchAdOrgs}
              onValueChange={async (_, item) => {
                this.setState({ adOrg: item.name, department: '' });
                this.adOrgId = item.adOrgId;
                this.departmentId = '';
                this.pickerDepartment && this.pickerDepartment.onChangeText('')
              }}
            />
            <Text style={styles.input_title}>Phòng ban</Text>
            <PickerSearch
              ref={ref => this.pickerDepartment = ref}
              disabled={!departments || departments.length <= 0}
              width={WIDTHXD(858)}
              title='Phòng ban'
              tempDisabled={this.state.adOrg === ''}
              onShowPorm={() => showAlert(TYPE.WARN, 'Cảnh báo', 'Bạn phải chọn đơn vị trước khi chọn phòng ban.')}
              height={HEIGHTXD(120)}
              value={department}
              data={departments}
              findData={(text) => this.fetchDepartment(text)}
              onValueChange={(_, item) => {
                this.setState({ department: item.name });
                this.departmentId = item.departmentId;
              }}
            />
            <View style={{
              marginTop: HEIGHTXD(82),
              marginBottom: HEIGHTXD(91),
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between'
            }}>
              <TouchableOpacity style={{
                borderRadius: WIDTHXD(20),
                borderWidth: WIDTHXD(3),
                borderColor: '#D4D4D4',
                height: HEIGHTXD(120),
                width: WIDTHXD(400),
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: '#777777',
                  fontSize: getFontXD(Platform.OS === 'android' ? 40 : 48),
                  fontFamily: R.fonts.RobotoMedium
                }}>THOÁT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                borderRadius: WIDTHXD(20),
                height: HEIGHTXD(120),
                width: WIDTHXD(400),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1777F1'
              }} onPress={this.onLoginPress}>
                <Text style={{
                  color: '#fff',
                  fontSize: getFontXD(Platform.OS === 'android' ? 40 : 48),
                  fontFamily: R.fonts.RobotoMedium
                }}>ĐĂNG NHẬP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    )
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state,
  };
}

export default connect(mapStateToProps, { getUserInfor, initDeparment })(Login);

const styles = StyleSheet.create({
  text_title: {
    textAlign: "center",
    fontSize: getFontXD(60),
    color: '#0F4C81',
    fontFamily: R.fonts.RobotoMedium,
    marginTop: HEIGHTXD(90),
    marginBottom: HEIGHTXD(61),
  },
  input_title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
    marginTop: HEIGHTXD(30)
  }
})