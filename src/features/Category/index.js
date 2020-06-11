import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { HEIGHTXD, getWidth } from '../../config';
import R from '../../assets/R';
import HeaderProfile from '../../common/Header/HeaderProfile';
import NavigationService from '../../routers/NavigationService';
import AdvanceRequest from '../../apis/Functions/advanceRequest'
import ItemCategory from './item'

const data = require('./dataCategory.json');

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this._getListRoleMenu()
  }

  _getListRoleMenu = async () => {
    try {
      // const response = await AdvanceRequest.getListRoleMenu({ adRoleId: this.props.adRoleId })
      // console.log('RESPONSE', response)
    } catch (err) {
      // console.log('ERROR', err)
    }
  }

  _goToProfile = () => {
    NavigationService.navigate('Profile')
  }

  render() {
    const loggedIn = this.props.userData ? this.props.userData.loggedIn : null;
    const fullName = loggedIn ? loggedIn.userFullName : '';
    const departmentName = loggedIn ? loggedIn.departmentName : '';

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={R.colors.colorHeaderGradien}
          style={{ height: Platform.OS === 'android' ? HEIGHTXD(295) : HEIGHTXD(264), width: getWidth(), position: 'absolute', left: 0, top: 0 }}
        />
        <HeaderProfile
          fullName={fullName}
          department={departmentName}
          onPress={this._goToProfile}
        />
        <FlatList
          data={data.data}
          renderItem={({ item, index }) => <ItemCategory item={item} index={index} />}
          style={styles.flatList}
          extraData={this.state}
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData,
    adRoleId: state.userReducers.userData.loggedIn.roleId,
  };
}

export default connect(mapStateToProps, {})(Category);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  },
  flatList: {
    flex: 0,
    backgroundColor: R.colors.blueGrey51,
    marginTop: HEIGHTXD(31)
  }
})
