// Thành công, may mắn, hạnh phúc.
import React, { Component } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { connect } from 'react-redux'
import NoInternetComponent from './common/NoInternet';
import VersionChecker from './common/VersionChecker';
import StoreRatingModal from './common/StoreRating/StoreRatingModal';
import FirebaseNotification from './helpers/FirebaseNotification'
import R from './assets/R';
import Login from 'features/Login';
import DropdownAlert from 'react-native-dropdownalert';
import { WIDTHXD, HEIGHTXD } from './config';
import DropdownManager from 'common/DropdownAlert/DropdownManager';
import LoadingManager from 'common/Loading/LoadingManager';
import LoadingModal from '../src/common/Loading/LoadingModal';
import { saveNotification } from './actions/users'

class RootView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      openFromNotification: false,
      notification: {}
    }
  }

  componentDidMount() {
    LoadingManager.register(this.loadingRef);
    DropdownManager.register(this.dropDownAlertRef);
  }

  componentWillUnmount() {
    LoadingManager.unregister(this.loadingRef);
    DropdownManager.unregister(this.dropDownAlertRef);
  }

  onReceived = (notification) => {
  }

  onOpened = (notification) => {
    this.setState({ openFromNotification: true, notification: notification })
    this.props.saveNotification(notification)
  }

  renderContent = () => {
    const loggedIn = this.state.loggedIn;

    if (!loggedIn) {
      return (
        <Login onLoginSuccess={() => this.setState({ loggedIn: true })} />
      )
    } else {
      return (
        <>
          <SafeAreaView style={styles.containertTop} />
          <SafeAreaView style={styles.containerBottom}>
            {this.props.children}
            <NoInternetComponent />
            <FirebaseNotification
              onReceived={this.onReceived}
              onOpened={this.onOpened}
            />
            <StoreRatingModal />
            <VersionChecker />
          </SafeAreaView>
        </>
      )
    }
  }

  render() {
    // console.log(this.state.loggedIn)
    return (
      <>
        {this.renderContent()}
        <DropdownAlert
          inactiveStatusBarBackgroundColor={R.colors.colorMain}
          activeStatusBarBackgroundColor={R.colors.colorMain}
          successImageSrc={R.images.iconSuccess}
          titleStyle={{ color: '#fff' }}
          messageStyle={{ color: '#fff' }}
          warnImageSrc={R.images.warnIcon}
          errorImageSrc={R.images.iconError}
          infoImageSrc={R.images.iconNotification}
          closeInterval={1000}
          ref={ref => {
            this.dropDownAlertRef = ref;
          }}
          warnColor={R.colors.orange400}
          defaultContainer={{
            borderBottomRightRadius: WIDTHXD(30),
            borderBottomLeftRadius: WIDTHXD(30),
            paddingTop: HEIGHTXD(30),
            paddingVertical: HEIGHTXD(30),
            paddingHorizontal: WIDTHXD(20)
          }}
        />
        <LoadingModal
          ref={ref => {
            this.loadingRef = ref;
          }}
        />
      </>);
  }
}

const styles = StyleSheet.create({
  containertTop: {
    flex: 0,
    backgroundColor: R.colors.colorMain
  },
  containerBottom: {
    flex: 1,
    backgroundColor: R.colors.white,
  },

});
function mapStateToProps(state) {
  return {
    Account: state.userReducers.data,
  };
}

export default connect(mapStateToProps, {
  saveNotification
})(RootView);
