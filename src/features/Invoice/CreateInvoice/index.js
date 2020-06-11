import React, { Component } from 'react';
import {
  KeyboardAvoidingView, Platform,
  TouchableHighlight, StyleSheet, View, Dimensions, Animated
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import i18n from 'assets/languages/i18n';
import LinearGradient from 'react-native-linear-gradient';
import { HEIGHTXD, getFontXD, WIDTHXD } from '../../../config/Function';
import R from '../../../assets/R';
import NavigationService from '../../../routers/NavigationService';
import HeaderForTabInvoice from '../../../common/Header/HeaderForTabInvoice';
import GeneralInfo from './GeneralInfor';
import DetailedInfo from './DetailInfor';
import Attachments from './Attachment';
import Confirm from 'common/ModalConfirm/Confirm';
import { showAlert, TYPE } from 'common/DropdownAlert';
import global from '../global';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class CreateInvoice extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'GeneralInformation', title: i18n.t('GENERAL_INFORMATION') },
      { key: 'DetailsInformation', title: i18n.t('DETAIL_INFORMATION') },
      { key: 'Attachments', title: i18n.t('ATTACK_T') },
    ],
    loading: true,
    indexBottom: 0,
    behavior: 'padding',
    search: '',
    swipeTabEnable: true,
    swiping: false,
    attachmentTabIndex: 0,
    reRender: false,
    invoiceInfo: {}
  };
  serviceTypeId = ''
  refreshAttachmentList = null;
  checkInformation = null;
  onCancelConfirm = null;
  loadDataInvoice = null;
  invoiceChange = null;

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
          let width = WIDTHXD(411)
          switch (i) {
            case 1: {
              width = WIDTHXD(435)
              break
            }
            case 2: {
              width = WIDTHXD(292)
              break
            }
            default: { }
          }
          return (
            <TouchableHighlight
              key={i}
              activeOpacity={0.6}
              underlayColor="transparent"
              onPress={() => this.confirmMoveTab(i, () => {
                this.setState({ index: i });
              })}
            >
              <Animated.View style={[styles.tabBar, { borderBottomColor: bcolor }, { width }]}>
                <Animated.Text style={[styles.textTab, { opacity }]}>{route.title}</Animated.Text>
              </Animated.View>
            </TouchableHighlight>
          );
        })}

      </LinearGradient>)
  };

  confirmMoveTab = (index, callback) => {
    // show alert require save invoice before move to other tab
    if (index !== 0 && this.state.index === 0 && !this.idInvoice) {
      showAlert(TYPE.WARN, 'Bạn phải lưu hoá đơn trước.');
      return;
    }

    // check if invoice data has changed
    if (index !== 0 && this.state.index === 0 && this.invoiceChange && this.invoiceChange()) {
      // show confirm dialog
      this.ConfirmPopup.setModalVisible(true);

      // rollback and go to tab if choose cancel
      this.onCancelConfirm = () => {
        this.rollbackInvoice && this.rollbackInvoice();
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

  onChangeBottomTab = (indexBottom) => {
    this.setState({ indexBottom })
  }

  componentDidMount() {
    this.idInvoice = this.props.navigation.getParam('idInvoice');
    if (this.idInvoice) {
      this.loadDataInvoice && this.loadDataInvoice(this.idInvoice);
      this.refreshAttachmentList && this.refreshAttachmentList();
    }
    global.setTabIndex = (index) => this.confirmMoveTab(index, () => this.setState({ index }))
  }

  reRender = () => this.setState({ reRender: !this.state.reRender });

  _renderScene = ({ route }) => {
    let idInvoice = this.props.navigation.getParam('idInvoice');
    let isEdit = false

    if (idInvoice) { isEdit = true }
    switch (route.key) {
      case 'GeneralInformation': {
        return <GeneralInfo
          setCheckInformation={(ref) => this.checkInformation = ref}
          refreshData={() => this.props.navigation.state.params.refreshData()}
          setIdInvoice={(idInvoices) => {
            this.idInvoice = idInvoices;
            this.isEdit = true;
            this.reRender();
          }}

          setInvoiceInfo={(invoiceInfo) => {
            this.setState({invoiceInfo})
          }}
          setDataHaveChange={ref => this.invoiceChange = ref}
          setLoadData={(ref) => this.loadDataInvoice = ref}
          setRollbackInvoice={(ref) => this.rollbackInvoice = ref}
          nextToDetail={() => {
            this.setState({ index: 1 })
          }}
          tabIndex={this.state.index}
          isEdit={isEdit}
          refreshAttachmentList={this.refreshAttachmentList}
          idInvoice={idInvoice}
        />
      }
      case 'DetailsInformation':
        return <DetailedInfo
          screenProps={{
            self: this,
            tabIndex: this.state.index,
            isEdit,
            invoiceInfo: this.state.invoiceInfo
          }} />
      case 'Attachments':
        return <Attachments
          screenProps={{
            idInvoice: idInvoice,
            swiping: this.state.swiping,
            setRefreshAttachmentList: (refresh) => this.refreshAttachmentList = refresh,
            onAttachmentTabChange: (attachmentTabIndex) => this.setState({ attachmentTabIndex }),
            tabIndex: this.state.index,
          }}
          navigationOptions={{
            dataItem: null
          }}
        />
      default:
        return null;
    }
  };

  componentWillMount() {
    this.props.navigation.state.params && this.props.navigation.state.params.refreshData()
  }

  _onChangeSearch = (search) => {
    this.setState({ search })
  }

  render() {
    const { index, search, swipeTabEnable } = this.state;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-60}
        behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={{ flex: 1 }}>
          <HeaderForTabInvoice
            title={i18n.t('INVOICE_T')}
            onPressLeft={() => {
              if (this.invoiceChange && this.invoiceChange()) {
                this.ConfirmPopup.setModalVisible(true);
                this.onCancelConfirm = () => {
                  this.props.navigation.state.params.refreshData()
                  NavigationService.pop()
                }
              } else {
                this.props.navigation.state.params.refreshData()
                NavigationService.pop()
              }
              // this.props.navigation.state.params.refreshData()
              // NavigationService.pop()
            }}
            attachmentIndex={2}
            attachmentTabIndex={this.state.attachmentTabIndex}
            onChangeSearch={(searchs) => { this._onChangeSearch(searchs) }}
            placeholderSearch="Tìm kiếm"
            setAttachmentTabIndex={() => this.setState({ attachmentTabIndex: 0 })}
            search={search}
            indexOfTab={index}
            onPressRight={() => { }}
          />
          <TabView
            renderTabBar={this._renderFooter}
            navigationState={this.state}
            swipeEnabled={false}
            renderScene={this._renderScene}
            onIndexChange={index => this.setState({ index })}
            initialLayout={initialLayout}
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
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default CreateInvoice;
const styles = StyleSheet.create({
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
  },
  container: {
    flex: 1
  }
});
