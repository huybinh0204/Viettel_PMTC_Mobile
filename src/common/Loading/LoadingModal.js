import React, { PureComponent } from 'react';
import { View, Modal, StatusBar } from 'react-native';
import Spinner from 'react-native-spinkit';
import PropTypes from 'prop-types';
import R from '../../assets/R';
import LoadingManager from './LoadingManager';
import { SkypeIndicator } from 'react-native-indicators';
import { WIDTHXD } from '../../config';

const TIME_OUT = 15 * 1000;

export function showLoading() {
  const ref = LoadingManager.getDefault();

  if (!!ref) {
    ref.showLoading();
  }
}

export function hideLoading() {
  const ref = LoadingManager.getDefault();

  if (!!ref) {
    ref.hideLoading();
  }
}

class LoadingModal extends PureComponent {
  static defaultProps = {
    spinnerSize: 40,
    // 'CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots',
    // 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle',
    // 'FadingCircleAlt', 'Arc', 'ArcAlt'
    spinnerType: 'Circle',
    spinnerColor: R.colors.white0,
  };

  static propTypes = {
    spinnerSize: PropTypes.number,
    spinnerType: PropTypes.string,
    spinnerColor: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(R.colors.black40p);
  }

  componentWillUnmount() {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(R.colors.header);
  }

  hideLoading = () => {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    this.setState({ isVisible: false });
  };

  showLoading = (timeOut = TIME_OUT) => {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ isVisible: false });
    }, timeOut);
    this.setState({ isVisible: true });
  };

  render() {
    // return (
    //   <Modal
    //     transparent
    //     animationType="fade"
    //     visible={this.state.isVisible}
    //   >
    //     <StatusBar
    //       barStyle="dark-content"
    //       backgroundColor={R.colors.black40p}
    //     />
    //     <View
    //       style={{
    //         backgroundColor: R.colors.black40p,
    //         flex: 1,
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}
    //     >
    //       <Spinner
    //         isVisible
    //         size={this.props.spinnerSize}
    //         type={this.props.spinnerType}
    //         color={this.props.spinnerColor}
    //       />
    //     </View>
    //   </Modal>
    // );
    if (!this.state.isVisible) return null;
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        height: '100%',
        // paddingRight: WIDTHXD(74),
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#00000077'
      }}>
        <SkypeIndicator color='#fff' />
      </View>
    )
  }
}

export default LoadingModal;
