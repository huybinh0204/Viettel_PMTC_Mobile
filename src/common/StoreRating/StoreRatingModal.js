import React, { PureComponent } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import moment from 'moment';
import Utils from '../../helpers/Utils';
import AsyncStorageUtils from '../../helpers/AsyncStorageUtils';
import DateTimeUtils from '../../helpers/DateTimeUtils';
import R from '../../assets/R';

class StoreRatingModal extends PureComponent {
  static defaultProps = {
    thresholdDayToShow: 30 * DateTimeUtils.TIME_VALUE.DAY,
    googleStoreLink: '',
    appleStoreLink: '',
  };

  static propTypes = {
    googleStoreLink: PropTypes.string,
    appleStoreLink: PropTypes.string,
    thresholdDayToShow: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  async componentDidMount() {
    const currentTime = moment(new Date()).valueOf();

    let lastTimeOpenApp = await AsyncStorageUtils.get(
      AsyncStorageUtils.KEY.LAST_TIME_SHOW_RATING_DIALOG
    );

    let canShowRatingDialog = await AsyncStorageUtils.get(
      AsyncStorageUtils.KEY.CAN_SHOW_RATING_DIALOG
    );

    if (canShowRatingDialog == null) {
      canShowRatingDialog = 'true';
    }

    if (lastTimeOpenApp) {
      lastTimeOpenApp = Number(lastTimeOpenApp);

      const timeThreshold = currentTime - lastTimeOpenApp;

      if (timeThreshold >= this.props.thresholdDayToShow && canShowRatingDialog === 'true') {
        this.setState({ isVisible: true });
      } else {
        this.setState({ isVisible: false });
      }
    } else {
      AsyncStorageUtils.save(AsyncStorageUtils.KEY.LAST_TIME_SHOW_RATING_DIALOG, `${currentTime}`);
    }
  }

  _renderStars = () => (
    <TouchableOpacity onPress={this.onRatingPressed} style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map(value => (
        <Icon
          key={value.toString()}
          style={{ marginHorizontal: 8 }}
          name="ios-star-outline"
          size={25}
          color={R.colors.primaryColor}
        />
      ))}
    </TouchableOpacity>
  );

  _renderDivider = () => <View style={styles.dividerStyle} />;

  onRatingPressed = () => {
    this.setState({ isVisible: false });
    AsyncStorageUtils.save(AsyncStorageUtils.KEY.CAN_SHOW_RATING_DIALOG, 'false');
    Utils.openStore(this.props.googleStoreLink, this.props.appleStoreLink);
  };

  onNotNowPress = () => {
    const dateTimeStamp = moment(new Date()).valueOf();
    AsyncStorageUtils.save(
      AsyncStorageUtils.KEY.LAST_TIME_SHOW_RATING_DIALOG,
      JSON.stringify(dateTimeStamp)
    );
    this.setState({ isVisible: false });
  };

  render() {
    return (
      <Modal
        transparent
        animationType="fade"
        style={{ position: 'absolute' }}
        visible={this.state.isVisible}
      >
        <View style={styles.containerStyle}>
          <View style={styles.contentContainerStyle}>
            <FastImage
              style={styles.logoStyle}
              source={R.images.app_icon}
              resizeMode={FastImage.resizeMode.contain}
            />

            <Text style={styles.titleStyle}>Enjoying React Native?</Text>
            <Text style={styles.descStyle}>Tap a star to rate it on the App Store</Text>

            {this._renderDivider()}

            {this._renderStars()}

            {this._renderDivider()}

            <TouchableOpacity onPress={this.onNotNowPress} style={styles.notNowContainerStyle}>
              <Text style={styles.textNotNowStyle}>Not Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainerStyle: {
    width: '80%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

  logoStyle: {
    width: 65,
    height: 65,
    marginVertical: 20,
  },
  titleStyle: {
    fontWeight: '600',
    fontSize: 20,
    color: 'black',
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  descStyle: {
    fontSize: 18,
    color: 'black',
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  notNowContainerStyle: {
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textNotNowStyle: {
    fontSize: 20,
    color: R.colors.primaryColor,
  },

  starContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  dividerStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: R.colors.borderC,
  },
});

export default StoreRatingModal;
