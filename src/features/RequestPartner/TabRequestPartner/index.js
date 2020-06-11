import React, { Component } from 'react';
import { SafeAreaView, TouchableHighlight, StyleSheet, View, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { TabView } from 'react-native-tab-view';
import i18n from 'assets/languages/i18n';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from 'routers/NavigationService';
import { HEIGHTXD, getFontXD, WIDTHXD, getWidth } from '../../../config/Function';
import R from '../../../assets/R';
import HeaderForTabInvoice from '../../../common/Header/HeaderForTabInvoice';
import Attachment from './Attachment';
import GeneralInfo from './GeneralInfor';
import { showAlert, TYPE } from 'common/DropdownAlert';
import Confirm from 'common/ModalConfirm/Confirm';
import global from './global';


const initialLayout = {
  height: 0,
  width: getWidth(),
};

class DetailInvoice extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'General', title: i18n.t('GENERAL_INFORMATION') },
      { key: 'Attachment', title: i18n.t('ATTACK_T') },
    ],
    loading: true,
    indexBottom: 0,
    attachmentTabIndex: 0,
    reRender: false,
  };

  // refresh attachment list in tab attachment
  refreshAttachmentList = null;
  checkInformation = null;
  onCancelConfirm = null;
  partnerChange = null;
  rollbackPartner = null;

  componentWillUnmount() {
    const reRender = this.props.navigation.state.params.reRender;
    reRender && reRender();
  }

  reRender = () => this.setState({ reRender: !this.state.reRender });

  _renderFooter = props => {
    const inputRange = props.navigationState.routes.map((key, i) => i)
    return (
      <LinearGradient
        colors={R.colors.colorHeaderGradienMenuTab}
        style={styles.tab}
      >
        <View style={{ flexDirection: 'row' }}>
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
            let width = WIDTHXD(569)
            switch (i) {
              case 1: {
                width = WIDTHXD(566)
                break
              }
              default: {
              }
            }
            return (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="transparent"
                onPress={() => this.confirmMoveTab(i, () => {
                  this.setState({ index: i });
                })}>
                <Animated.View style={[styles.tabBar, { borderBottomColor: bcolor }, { width }]}>
                  <Animated.Text style={[styles.textTab, { opacity }]}>{route.title}</Animated.Text>
                </Animated.View>
              </TouchableHighlight>
            );
          })}

        </View>
      </LinearGradient>
    )
  };

  _onChangeBottomMenu = (indexBottom) => {
    this.setState({ indexBottom })
  }

  confirmMoveTab = (index, callback) => {
    // show alert require save partner before move to other tab
    if (index !== 0 && this.state.index === 0 && !this.partner.cRequestPartnerId) {
      showAlert(TYPE.WARN, 'Bạn phải lưu đối tượng đề xuất trước.');
      return;
    }

    // check if partner data has changed
    if (index !== 0 && this.state.index === 0 && this.partnerChange && this.partnerChange()) {
      // show confirm dialog
      this.ConfirmPopup.setModalVisible(true);

      // rollback and go to tab if choose cancel
      this.onCancelConfirm = () => {
        this.rollbackPartner && this.rollbackPartner();
        callback && callback();
      };

      this.onAceptConfirm = () => {
        this.checkInformation && this.checkInformation();
        callback && callback();
      }
    } else {
      this.setState({ index });
    }
  }

  componentDidMount() {
    this.partner = this.props.navigation.getParam('item');
    global.setTabIndex = (index) => this.confirmMoveTab(index, () => this.setState({ index }))
  }

  _renderScene = ({ route }) => {
    let partner = this.partner;
    let idPartner = partner ? partner.cRequestPartnerId : null;

    switch (route.key) {
      case 'General': {
        return <GeneralInfo
          setCheckInformation={(ref) => this.checkInformation = ref}
          setPartner={(Partner) => {
            this.partner = Partner;
            this.reRender();
            this.refreshAttachmentList && this.refreshAttachmentList();
          }}
          setDataHaveChange={ref => this.partnerChange = ref}
          refreshAttachmentList={this.refreshAttachmentList}
          setRollbackPartner={(ref) => this.rollbackPartner = ref}
          navigation={this.props.navigation} />;
      }
      case 'Attachment':
        return <Attachment
          screenProps={{
            self: this,
            idPartner,
            disabled: this.props.navigation.getParam('disabled') ? true : false,
            setRefreshAttachmentList: (refresh) => this.refreshAttachmentList = refresh,
            onAttachmentTabChange: (attachmentTabIndex) => this.setState({ attachmentTabIndex }),
          }} />;
      default:
        return null;
    }
  };

  render() {
    const { index, search } = this.state

    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-60}
        behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderForTabInvoice
            title={i18n.t('PROPOSE_OBJECT')}
            disableSearch={true}
            disableEye={true}
            onPressLeft={() => {
              if (this.partnerChange && this.partnerChange()) {
                this.ConfirmPopup.setModalVisible(true);
                this.onCancelConfirm = () => {
                  this.props.navigation.state.params.refreshData()
                  NavigationService.pop()
                }
              } else {
                this.props.navigation.state.params.refreshData()
                NavigationService.pop()
              }
            }}
            search={search}
            attachmentIndex={1}
            attachmentTabIndex={this.state.attachmentTabIndex}
            setAttachmentTabIndex={() => this.setState({ attachmentTabIndex: 0 })}
            indexOfTab={index}
            onPressRight={() => { }}
          />
          <TabView
            renderTabBar={this._renderFooter}
            navigationState={this.state}
            renderScene={this._renderScene}
            onIndexChange={index => this.setState({ index })}
            initialLayout={initialLayout}
            swipeEnabled={false}
          />
          <Confirm
            ref={ref => { this.ConfirmPopup = ref }}
            title="Bạn có muốn lưu bản ghi này không ?"
            titleLeft="HUỶ BỎ"
            titleRight="ĐỒNG Ý"
            onPressLeft={() => this.onCancelConfirm && this.onCancelConfirm()}
            onPressRight={() => {
              this.onAceptConfirm && this.onAceptConfirm();
              this.ConfirmPopup.setModalVisible(false);
            }}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

export default DetailInvoice;
const styles = StyleSheet.create({
  tabTextColor: {
    color: R.colors.white,
    opacity: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
  },
  tabBar: {
    justifyContent: 'center',
    paddingVertical: HEIGHTXD(49),
    width: WIDTHXD(411),
    backgroundColor: 'transparent',
    paddingTop: HEIGHTXD(61),
    alignItems: 'center',
    borderBottomWidth: HEIGHTXD(12)
  },
  textTab: {
    color: '#fff',
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  },
  tab: {
    flexDirection: 'row',
    backgroundColor: R.colors.colorMain,
  },
});
