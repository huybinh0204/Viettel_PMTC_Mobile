import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import FastImage from 'react-native-fast-image';
import NavigationService from 'routers/NavigationService';
import { Intro } from 'routers/screenNames'
import R from '../../assets/R';
import { LoadingComponent } from '../Loading/LoadingComponent';

class NoInternetComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      loading: false
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    let countDownDate = new Date('2019/09/21 8:30').getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    if (!isConnected) {
      if (distance > 0) {
        NavigationService.reset(Intro, { distance, date: '2019-09-21', time: '8:30' })
      } else {
        if (this.state.isConnected !== isConnected) {
          this.setState({ isConnected });
        }
      }
    }
  };

  render() {
    return !this.state.isConnected ? (
      <View style={styles.offlineContainer}>
        <FastImage
          source={R.images.bg_cannot_connect}
          style={styles.imageStyle}
          resizeMode={FastImage.resizeMode.contain}
        />

        <Text style={styles.textStyle}>{R.strings.local.NoInternetComponent.no_internet_connection}</Text>
        <Text style={styles.subTextStyle}>
          {R.strings.local.NoInternetComponent.pls_check_your_internet_connection}
        </Text>
        <TouchableOpacity onPress={() => {
          this.setState({ loading: true })
          setTimeout(() => {
            NetInfo.isConnected.fetch().then(isConnected => {
              this.setState({ isConnected })
            });
            this.setState({ loading: false })
          }, 1500)
        }}
        >
          <Text style={{ alignSelf: 'center', color: 'blue' }}>NHẤN ĐỂ THỬ LẠI</Text>
        </TouchableOpacity>
        <LoadingComponent isLoading={this.state.loading} />
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  offlineText: {
    color: R.colors.white100
  },
  textStyle: {
    fontSize: 20,
    color: 'black',
    marginTop: 30
  },
  subTextStyle: {
    fontSize: 16,
    color: R.colors.borderC,
    marginVertical: 10
  },
  imageStyle: {
    width: '80%',
    height: 200
  }
});

export default NoInternetComponent;
