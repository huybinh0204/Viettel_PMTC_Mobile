import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderProfile from './Avatar';
import { WIDTHXD, HEIGHTXD, getWidth, getFontXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { userData } = this.props
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.linearGradient}
          colors={R.colors.colorLinearProfile}
        />
        <View style={styles.wrapper}>
          <HeaderProfile
            onPress={() => { }}
            fullName={userData.userFullName}
            department={userData.roleName}
          />
          <View
            style={[styles.itemContainer, {marginTop: HEIGHTXD(94)}]}
          >
            <View style={styles.viewTxtTitle}>
              <Text style={styles.title}>Mã nhân viên</Text>
            </View>
            <Text style={[styles.title, styles.infor]}>
              {userData.userName}
            </Text>
          </View>
          <View
            style={styles.itemContainer}
          >
            <View style={styles.viewTxtTitle}>
              <Text style={styles.title}>Đơn vị</Text>
            </View>
            <Text style={[styles.title, styles.infor]}>
              {userData.adOrgName}
            </Text>
          </View>
          <View
            style={styles.itemContainer}
          >
            <View style={styles.viewTxtTitle}>
              <Text style={styles.title}>Phòng ban</Text>
            </View>
            <Text style={[styles.title, styles.infor]}>
              {userData.departmentName}
            </Text>
          </View>
          <View
            style={styles.itemContainer}
          >
            <View style={styles.viewTxtTitle}>
              <Text style={styles.title}>Vai trò</Text>
            </View>
            <Text style={[styles.title, styles.infor]}>
              {userData.roleName}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
  }
}
export default connect(mapStateToProps, {})(Profile);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  },
  wrapper: {
    width: WIDTHXD(1065),
    borderRadius: WIDTHXD(30),
    backgroundColor: R.colors.white,
    marginTop: -HEIGHTXD(390),
    elevation: 2,
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: HEIGHTXD(30)
  },
  linearGradient: {
    width: getWidth(),
    backgroundColor: R.colors.colorMain,
    height: HEIGHTXD(639.74 - 79)
  },
  flatList: {
    flex: 0,
    backgroundColor: R.colors.grey51,
    marginTop: HEIGHTXD(94)
  },
  itemContainer: {
    width: WIDTHXD(1065),
    paddingVertical: HEIGHTXD(39),
    backgroundColor: R.colors.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E6E6E6',
    flexDirection: 'row',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center'
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    color: R.colors.grey400,
    fontFamily: R.fonts.RobotoRegular
  },
  viewTxtTitle: {
    width: WIDTHXD(300)
  },
  infor: {
    color: R.colors.black0,
    marginLeft: WIDTHXD(30),
    flex: 1
  }
});
