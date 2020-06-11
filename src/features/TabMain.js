// @flow
import React, { PureComponent, Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabView } from 'react-native-tab-view';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import ModalAdd from 'common/ModalAdd';
import i18n from '../assets/languages/i18n';
import R from '../assets/R';
import { getWidth, getFontXD, getLineHeightXD, WIDTHXD, HEIGHTXD, popupCancel } from '../config';
import Search from './Search';
import Notification from './Notification'
import Category from './Category';
import RouterHome from './Home/RouterHome';
import { updateNotifyNumber } from '../actions/users'
import { getNotificationListRequest } from '../apis/Functions/notification'
import { TabAddStatement, TabAddApInvoiceGroupStatement, CreateInvoice } from 'routers/screenNames';
import NavigationService from 'routers/NavigationService';

class TabIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touching: false
    }
  }

  render() {
    const { icon, isFocus, isAdd, title, index, notifyNumber } = this.props;
    const { touching } = this.state;

    const colorIndicator = isFocus ? R.colors.colorMain : R.colors.white;
    const colorIcon = (isFocus || touching) ? R.colors.colorMain : R.colors.grayText;
    return (
      <TouchableOpacity style={{
        width: getWidth() / 5,
        // height: HEIGHTXD(220),
        alignItems: 'center'
      }}
        activeOpacity={1}
        onPressIn={() => this.setState({ touching: true })}
        onPressOut={() => this.setState({ touching: false })}
        onPress={this.props.onPress}>
        <View style={{
          width: WIDTHXD(122),
          height: HEIGHTXD(6),
          borderBottomLeftRadius: WIDTHXD(6),
          borderBottomRightRadius: WIDTHXD(6),
          backgroundColor: colorIndicator,
          alignSelf: 'center',
          top: 0
        }} />
        <View style={{ flexDirection: 'row' }}>
          <Image style={{
            width: WIDTHXD(isAdd ? 165 : 75),
            height: WIDTHXD(isAdd ? 165 : 75),
            resizeMode: 'contain',
            marginTop: HEIGHTXD(isAdd ? 8 : 22),
          }}
            source={isFocus ? icon.active : icon.inactive} />
          {index === 2 && notifyNumber > 0 ?
            <Text style={{
              fontSize: getFontXD(30),
              fontFamily: R.fonts.RobotoRegular,
              opacity: 1,
              minWidth: WIDTHXD(50),
              height: WIDTHXD(50),
              marginLeft: -HEIGHTXD(30),
              marginTop: HEIGHTXD(15),
              color: R.colors.white,
              backgroundColor: R.colors.redDA,
              borderRadius: WIDTHXD(25),
              textAlign: 'center',
              padding: WIDTHXD(3)
            }}>{notifyNumber}</Text>
            : null}
        </View>
        {
          isAdd ? null : (<Text style={{
            fontSize: getFontXD(33),
            fontFamily: R.fonts.RobotoRegular,
            opacity: 1,
            marginTop: HEIGHTXD(10),
            color: colorIcon,
          }}>{title}</Text>)
        }
      </TouchableOpacity >
    )
  }
}

class TabMain extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      notifyNumber: 0,
      routes: [
        {
          key: 'Home', title: i18n.t('HOME_T'), icon: {
            active: require('../assets/images/tabbar/icon_home_active.png'),
            inactive: require('../assets/images/tabbar/icon_home_inactive.png'),
          },
          isAdd: false
        },
        {
          key: 'Search', title: i18n.t('SEARCH_T'), icon: {
            active: require('../assets/images/tabbar/icon_search_active.png'),
            inactive: require('../assets/images/tabbar/icon_search_inactive.png'),
          },
          isAdd: false
        },
        {
          key: 'Notification', title: i18n.t('NOTIFICATION_T'), icon: {
            active: require('../assets/images/tabbar/icon_notification_active.png'),
            inactive: require('../assets/images/tabbar/icon_notification_inactive.png'),
          },
          isAdd: false
        },
        {
          key: 'Category', title: i18n.t('CATEGORY_T'), icon: {
            active: require('../assets/images/tabbar/icon_menu_active.png'),
            inactive: require('../assets/images/tabbar/icon_menu_inactive.png'),
          },
          isAdd: false
        },
      ],
      routeAdd: {
        key: 'Add', title: '', icon: {
          active: require('../assets/images/tabbar/icon_add_active.png'),
          inactive: require('../assets/images/tabbar/icon_add_active.png'),
        },
        isAdd: true
      },
      index: 0,
      listAccount: []
    };
  }

  componentWillUnmount() {
    this.setState({ notifyNumber: this.props.notifyNumber })
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps(nextProps) {
    console.log('tabmain nextProps', nextProps)

    if (nextProps.notifyNumber !== this.props.notifyNumber) {
      this.setState({ notifyNumber: nextProps.notifyNumber })
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.notifyNumber !== this.props.notifyNumber) {
      this.setState({ notifyNumber: this.props.notifyNumber })
    }
  }

  handleBackPress = () => {
    if (this.state.index === 0) {
      if (this.props.exitApp) {
        popupCancel(i18n.t('Exit_App'), i18n.t('Do_you_want_to_exit'), () => BackHandler.exitApp())
      } else this.props.navigationHome.pop()
    } else {
      this.setState({ index: 0 })
    }
    return true;
  }

  _renderTabBar = (props) => {
    const { routeAdd } = this.state;
    return (
      <View>
        <View style={styles.styleTabbar}>
          {props.navigationState.routes.map((route, i) => {
            return (
              <>
                <TabIcon
                  onPress={() => {
                    this.setState({ index: i });
                    (i === 0 && !this.props.exitApp) && this.props.navigationHome.pop();
                  }}
                  title={route.title}
                  isFocus={i === this.state.index}
                  isAdd={route.isAdd}
                  icon={route.icon}
                  index={i}
                  notifyNumber={this.state.notifyNumber} />
                {i === 1 ? (
                  <TabIcon
                    onPress={() => {
                      routeAdd.isAdd && this._onPressAdd();
                    }}
                    title={routeAdd.title}
                    isFocus={false}
                    isAdd={routeAdd.isAdd}
                    index={i}
                    notifyNumber={this.state.notifyNumber}
                    icon={routeAdd.icon} />
                ) : null}
              </>);
          })}
        </View>
      </View>
    )
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getNotifyNumber()
    console.log('tabmain props', this.props)
  }

  getNotifyNumber = async () => {
    const body = { userId: this.props.userData.adUserId, start: 0, maxResult: 10, sortDir: 'DESC', sortField: 'CREATED' }
    console.log('body', body)
    const response = await getNotificationListRequest(body);
    console.log('response', response)
    this.props.updateNotifyNumber((response.data.data && response.data.data.length > 0) ? response.data.data[0].countReadNo : 0)
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'Home':
        return <RouterHome />;
      case 'Search':
        return <Search navigation={this.props.navigation} />;
      case 'Notification':
        return <Notification navigation={this.props.navigation} onBackScreen={() => this._onBackScreen()} index={this.state.index} />;
      case 'Category':
        return <Category />;
      default:
        return null;
    }
  };

  _onBackScreen = () => {
    this.setState({ index: 0 })
  }
  _onPressAdd = () => {
    this.ModalAdd.setModalVisible(true)
  }

  _onChange = (index) => {
    switch (index) {
      case 0:
        NavigationService.navigate(TabAddStatement, {
          callBackListStatement: (item) => {
            // this.refreshData();
          }
        }
        );
        break;
      case 1:
        NavigationService.navigate('AdvanceRequestInfo', 'create');
        break;
      case 2:
        NavigationService.navigate(TabAddApInvoiceGroupStatement, { id: 0 })
        break;
      case 3:
        NavigationService.navigate(CreateInvoice, { refreshData: ()=>{} })
        break;
    }
  }

  render() {
    return (
      <>
        <NavigationEvents
          onWillFocus={payload => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
          }}
          onDidFocus={payload => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
          }}
          onWillBlur={payload => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
          }}
          onDidBlur={payload => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
          }}
        />
        <TabView
          navigationState={this.state}
          renderTabBar={this._renderTabBar}
          renderScene={this.renderScene}
          style={{ flex: 1 }}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: getWidth(), height: 0 }}
          tabBarPosition="bottom"
          // lazy={true}

          lazyPreloadDistance={1}
        />
        <ModalAdd ref={ref => { this.ModalAdd = ref }} onChange={this._onChange} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
    notification: state.userReducers.notification,
    notifyNumber: state.userReducers.notifyNumber,
    exitApp: state.locationReducers.exitApp,
    navigationHome: state.locationReducers.navigationHome
  }
}

export default connect(mapStateToProps, { updateNotifyNumber })(TabMain);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleTabbar: {
    height: HEIGHTXD(210),
    width: getWidth(),
    backgroundColor: R.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  container: {
    flex: 1,
    backgroundColor: R.colors.white100,
    justifyContent: 'flex-end',
  },
  itemContainer: {
    width: getWidth() / 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconName: {
    color: R.colors.colorMain,
    fontSize: getFontXD(30),
    lineHeight: getLineHeightXD(30),
    fontFamily: R.fonts.MontserratMedium,
    opacity: 1,
    marginTop: HEIGHTXD(20)
  },
  btnAdd: {
    borderRadius: WIDTHXD(120) / 2,
    backgroundColor: R.colors.colorMain,
    justifyContent: 'center',
    width: WIDTHXD(120),
    height: WIDTHXD(120),
    alignItems: 'center',
    shadowColor: '#0000003D',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 1,
  },
  barIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 10,
    width: getWidth() / 4,
    backgroundColor: R.colors.colorMain,
  }
});
