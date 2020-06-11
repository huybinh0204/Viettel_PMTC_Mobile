import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Animated
} from 'react-native';
import i18n from 'assets/languages/i18n';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import R from '../../assets/R';
import NavigationService from '../../routers/NavigationService';
import { TabView } from 'react-native-tab-view';
import Notification from './Notification'
import ActionHistory from './ActionHistory'
import HeaderForNotification from '../../common/Header/HeaderForNotification';
import { readNotificationRequest } from '../../apis/Functions/notification'
import { connect } from 'react-redux'
import { updateNotifyNumber } from '../../actions/users'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
class NotificationParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      refreshList: false,
      loading: false,
      routes: [
        { key: 'Notification', title: i18n.t('NOTICE_T') },
        { key: 'ActionHistory', title: i18n.t('ACTION_HISTORY_T') },
      ],
    }
  }

  _goToProfile = () => {
    NavigationService.navigate('Profile')
  }

  _renderFooter = props => {
    const inputRange = props.navigationState.routes.map((key, i) => i)
    return (
      <LinearGradient
        colors={R.colors.colorHeaderGradienMenuTab}
        style={styles.tab}
      >
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(
              inputIndex => (inputIndex === i ? 1 : 0.5)
            ),
          });
          const bcolor = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(
              inputIndex => (inputIndex === i ? '#fff' : '#22AEFB')
            ),
          });
          return (
            <TouchableHighlight
              key={i}
              activeOpacity={0.6}
              underlayColor="transparent"
              onPress={() => {
                this.setState({ index: i });
              }}
            >
              <Animated.View style={[styles.tabBar, { borderBottomColor: bcolor }, { width: WIDTHXD(560) }]}>
                <Animated.Text style={[styles.textTab, { opacity }]}>{route.title}</Animated.Text>
              </Animated.View>
            </TouchableHighlight>
          );
        })
        }

      </LinearGradient >)
  };

  onChangeBottomTab = (indexBottom) => {
    this.setState({ indexBottom })
  }

  componentDidMount() {
    this.idInvoice = this.props.navigation.getParam('idInvoice');
    if (this.idInvoice) {
      this.loadDataInvoice && this.loadDataInvoice(this.idInvoice);
      this.refreshAttachmentList && this.refreshAttachmentList();
    }
  }

  _renderScene = ({ route }) => {
    if (route.key === 'Notification') {
      return <Notification
      refreshList={this.state.refreshList}
      index={this.props.index} />
    } else {
      return <ActionHistory index={this.props.index}/>
    }

  }

/**
 * read all notification
 */
  _readAllNotify = async () => {
    this.setState({ loading: true })
    let body = {
      userId: this.props.userData.adUserId
    }
    const response = await readNotificationRequest(body)
    if (response && response.status === 200) {
      this.setState({
        refreshList: !this.state.refreshList
      })
      this.props.updateNotifyNumber(0)
    }

    this.setState({ loading: false })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderForNotification
          title={i18n.t('NOTICE_T')}
          readAllNotifcation={() => this._readAllNotify() }
          index={this.state.index}
          onPressLeft={() => this.props.onBackScreen()}
        />
        <TabView
          renderTabBar={this._renderFooter}
          navigationState={this.state}
          swipeEnabled={true}
          renderScene={this._renderScene}
          initialLayout={initialLayout}
          onIndexChange={index => this.setState({ index })}
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
  }
}
export default connect(mapStateToProps, { updateNotifyNumber })(NotificationParent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,

  },
  flatList: {
    flex: 0,
    backgroundColor: R.colors.blueGrey51,
    paddingBottom: HEIGHTXD(3),
    paddingTop: HEIGHTXD(26)
  },
  tabTextColor: {
    color: R.colors.white,
    opacity: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
  },
  tab: {
    flexDirection: 'row',
    backgroundColor: R.colors.colorMain,
  },
  tabBar: {
    justifyContent: 'center',
    paddingVertical: HEIGHTXD(49),
    width: WIDTHXD(411),
    paddingTop: HEIGHTXD(61),
    alignItems: 'center',
    borderBottomWidth: 2
  },
  textTab: {
    color: '#fff',
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  }
})
