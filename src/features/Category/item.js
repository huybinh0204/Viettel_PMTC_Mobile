import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import NavigationService from 'routers/NavigationService';
import { ListPartner, ListCustomer, ListVOffice, ListInvoice, ListStatement, AdvanceRequest, ListApInvoiceGroupStatement } from 'routers/screenNames';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth, getLineHeightXD } from '../../config';
import R from '../../assets/R';


export default class ItemCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subItem: false,
      index: 0
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _onPressSubItem = async (item) => {
    if (item === 'Danh sách đề xuất đối tượng') { NavigationService.navigate(ListPartner) }
    if (item === 'Danh sách đối tượng') { NavigationService.navigate(ListCustomer, { onPressItem: () => { }, fromHome: true }) }
    if (item === 'Tờ trình') { NavigationService.navigate(ListStatement) }
    if (item === 'Đề nghị thanh toán') { NavigationService.navigate(AdvanceRequest) }
    if (item === 'Bảng THTT') { NavigationService.navigate(ListApInvoiceGroupStatement) }
    if (item === 'Thay đổi vai trò') {
      await AsyncStorage.removeItem('loginUser');
      await AsyncStorage.removeItem('loginRole');
      await AsyncStorage.removeItem('loginAdOrg');
      await AsyncStorage.removeItem('loginDepartment');
      RNRestart.Restart();
    }
    // console.log(item)
    if (item === 'Hóa đơn') { NavigationService.navigate(ListInvoice) }
    if (item === 'Trình ký Voffice') { NavigationService.navigate(ListVOffice) }
  }

  _renderSubItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.subItemContainer}
      key={index}
      onPress={() => this._onPressSubItem(item)}
    >
      <Text style={styles.txtSubItem}>{item}</Text>
    </TouchableOpacity>
  )

  _changeLayout = () => {
    LayoutAnimation.configureNext(
      {
        duration: 300,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ subItem: !this.state.subItem });
  }

  render() {
    const { item, index } = this.props
    return (
      <View style={[{ marginTop: -HEIGHTXD(1) }, item.marginTop && { marginTop: HEIGHTXD(item.marginTop) }]}>
        <TouchableOpacity
          style={styles.itemContainer}
          activeOpacity={0.8}
          disabled={item.subItem.length === 0}
          key={index}
          onPress={() => this._changeLayout()}
        >
          <View style={styles.viewLeft}>
            <View style={styles.viewIcon}>
              <Image
                resizeMode="contain"
                source={R.images[item.icon]}
                style={styles.icon}
              />
            </View>
            <Text style={styles.txtName}>{item.name}</Text>
          </View>
          {item.subItem.length > 0
            && (
              <Icon
                name={this.state.subItem ? 'ios-arrow-down' : 'ios-arrow-forward'}
                size={WIDTHXD(36)}
                color={R.colors.blueGrey201}
              />
            )
          }
          {(!this.state.subItem) && <View style={styles.line} />}
        </TouchableOpacity>
        {
          this.state.subItem && (
            <FlatList
              data={item.subItem}
              renderItem={this._renderSubItem}
              style={[styles.subFlatList, { backgroundColor: this.state.subItem ? R.colors.borderD4 : R.colors.white }]}
            />
          )
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  icon: {
    width: WIDTHXD(59),
    height: WIDTHXD(59),
  },
  itemContainer: {
    width: getWidth(),
    paddingVertical: HEIGHTXD(54),
    backgroundColor: R.colors.white,
    flexDirection: 'row',
    paddingLeft: WIDTHXD(51),
    paddingRight: WIDTHXD(74),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomWidth: 0.8,
    borderBottomColor: R.colors.borderD4,
    position: 'absolute',
    bottom: 0.2,
    width: WIDTHXD(981),
    right: 0
  },
  txtName: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginLeft: WIDTHXD(48),
  },
  viewIcon: {
    width: WIDTHXD(59),
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subItemContainer: {
    width: getWidth(),
    lineHeight: getLineHeightXD(50),
    paddingVertical: HEIGHTXD(36),
    paddingLeft: WIDTHXD(145),
    paddingRight: WIDTHXD(162),
    justifyContent: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: R.colors.borderD4,
    backgroundColor: R.colors.blueGrey51,
  },
  txtSubItem: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
  },
  subFlatList: {
    backgroundColor: R.colors.borderD4,
  }
})
