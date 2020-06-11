import React, { PureComponent } from 'react';
import VersionCheck from 'react-native-version-check';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import R from '../../assets/R';
import DimensionUtils from '../../helpers/DimensionUtils';

class VersionChecker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      version: '1.0',
      visible: false,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    // setTimeout(() => {
    //   this.setState({ visible: true });
    // }, 2000)
    if (__DEV__) return;
    VersionCheck.needUpdate().then(res => {
      if (res && res.isNeeded) {
        this.setState({ visible: true });
      }
    });
  }

  _renderDivider = () => <View style={styles.dividerStyle} />;

  onOutsidePressed = () => {
    this.setState({ visible: false });
  };

  onUpdatePressed = async () => {
    try {
      Linking.openURL(await VersionCheck.getStoreUrl());
    } catch (error) {}
    this.setState({ visible: false });
  };

  onRequestClose = () => null;

  renderBackdrop() {
    return (
      <TouchableWithoutFeedback onPress={this.onOutsidePressed}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.30)',
            // backgroundColor: 'red',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,

            width: DimensionUtils.width,
            height: DimensionUtils.height,
          }}
        />
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        transparent
        animationType="fade"
        style={{ position: 'absolute' }}
        visible={this.state.visible}
      >
        {this.renderBackdrop()}
        <View pointerEvents="box-none" style={styles.containerStyle}>
          <View style={styles.imageUpgradeContainer} zIndex={100}>
            <Image source={R.images.ic_upgrade} style={styles.imageUpgradeStyle} />
          </View>

          <View style={styles.contentContainerStyle}>
            <Text style={styles.titleStyle}>{R.strings.local.VersionChecker.title}</Text>
            <Text style={styles.versionLabelStyle}>
              {R.strings.local.VersionChecker.version}
              {' '}
              {this.state.version}
            </Text>

            <Text style={styles.descStyle}>{R.strings.local.VersionChecker.description}</Text>

            {this._renderDivider()}

            <TouchableOpacity onPress={this.onUpdatePressed} style={styles.notNowContainerStyle}>
              <Text style={styles.textNotNowStyle}>{R.strings.local.VersionChecker.updateAction}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  imageUpgradeStyle: {
    width: 50,
    height: 50,
    tintColor: R.colors.primaryColor
  },
  imageUpgradeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerStyle: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainerStyle: {
    marginTop: -40,
    paddingTop: 40,
    width: '100%',
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

  versionLabelStyle: {
    fontSize: 14,
    color: R.colors.grey600,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 8,
    textAlign: 'center',
  },

  descStyle: {
    fontSize: 16,
    color: R.colors.grey900,
    marginBottom: 20,
    paddingHorizontal: 10,
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
    width: '100%',
    textAlign: 'center',
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

export default VersionChecker;
