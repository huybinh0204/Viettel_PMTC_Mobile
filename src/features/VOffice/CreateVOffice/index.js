import React, { Component } from 'react';
import {
  KeyboardAvoidingView, Platform,
  TouchableHighlight, StyleSheet, View, Dimensions, Animated, ScrollView
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import i18n from 'assets/languages/i18n';
import LinearGradient from 'react-native-linear-gradient';
import { HEIGHTXD, getFontXD, WIDTHXD } from '../../../config/Function';
import R from '../../../assets/R';
import NavigationService from '../../../routers/NavigationService';
import HeaderForTabInvoice from '../../../common/Header/HeaderForTabInvoice';
import GeneralInfo from './GeneralInfor';
import VOfficeFile from './VOfficeFile';
import ListSigner from './ListSigner';
import Receivers from './Receivers';
import global from '../global';
import Confirm from 'common/ModalConfirm/Confirm';
import { showAlert, TYPE } from 'common/DropdownAlert';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class CreateInvoice extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'General', title: i18n.t('GENERAL_INFORMATION') },
      { key: 'Files', title: 'File trình ký' },
      { key: 'Singers', title: 'Danh sách ký' },
      { key: 'Receivers', title: 'Cá nhân nhận VB' },
    ],
    loading: true,
    indexBottom: 0,
    behavior: 'padding',
    search: ''
  };

  isEdit = true;
  viewOnly = false;
  cDocumentsignId = null;

  constructor(props) {
    super(props);
    this.isEdit = this.props.navigation.getParam('isEdit', true)
    this.viewOnly = this.props.navigation.getParam('viewOnly', false)
    this.cDocumentsignId = this.props.navigation.getParam('cDocumentsignId')
    console.log(this.cDocumentsignId, this.isEdit, this.viewOnly)
  }

  checkInformation = null;
  onCancelConfirm = null;
  loadDataVOffice = null;
  vofficeChange = null;
  rollbackVOffice = null;

  _renderFooter = props => {
    const inputRange = props.navigationState.routes.map((key, i) => i)
    return (
      <LinearGradient
        colors={R.colors.colorHeaderGradienMenuTab}
        style={styles.tab}
      >
        <ScrollView
          ref={ref => this.scrollTab = ref}
          style={{ width: '100%' }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
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
            let paddingLeft = WIDTHXD(30);
            let paddingRight = WIDTHXD(30);

            switch (i) {
              case 0:
              case 3:
                paddingLeft = WIDTHXD(41);
                break;
            }
            return (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="transparent"
                onPress={() => this.confirmMoveTab(i, () => {
                  this.setState({ index: i });
                  if (i >= 2) {
                    this.scrollTab && this.scrollTab.scrollToEnd();
                  } else {
                    this.scrollTab && this.scrollTab.scrollTo({ x: 0 });
                  }
                })}
              >
                <Animated.View style={[styles.tabBar, { borderBottomColor: bcolor }, { paddingLeft, paddingRight }]}>
                  <Animated.Text style={[styles.textTab, { opacity }]}>{route.title}</Animated.Text>
                </Animated.View>
              </TouchableHighlight>
            );
          })}
        </ScrollView>
      </LinearGradient>)
  };

  onChangeBottomTab = (indexBottom) => {
    this.setState({ indexBottom })
  }

  confirmMoveTab = (index, callback) => {
    // show alert require save invoice before move to other tab
    if (index !== 0 && this.state.index === 0 && !this.cDocumentsignId) {
      showAlert(TYPE.WARN, 'Bạn phải lưu trình ký VOffice trước.');
      return;
    }

    // check if invoice data has changed
    if (index !== 0 && this.state.index === 0 && this.vofficeChange && this.vofficeChange()) {
      // show confirm dialog
      this.ConfirmPopup.setModalVisible(true);

      // rollback and go to tab if choose cancel
      this.onCancelConfirm = () => {
        this.rollbackVOffice && this.rollbackVOffice();
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
    let cDocumentsignId = this.props.navigation.getParam('cDocumentsignId')
    let isEdit = false
    if (cDocumentsignId !== undefined) { isEdit = true }

    // remove by BA
    // if (isEdit) {
    //   this.setState({ index: 1 })
    // }
    this.cDocumentsignId = cDocumentsignId;
    // console.log(cDocumentsignId)
    global.setTabIndex = (index) => this.confirmMoveTab(index, () => this.setState({ index }))
  }

  _renderScene = ({ route }) => {
    // let cDocumentsignId = this.props.navigation.getParam('cDocumentsignId')
    // let isEdit =  this.props.navigation.getParam('cDocumentsignId', false)

    // if (cDocumentsignId) { isEdit = true }
    switch (route.key) {
      case 'General': {
        return <GeneralInfo
          refreshData={() => this.props.navigation.state.params.refreshData()}
          setcDocumentsignId={(cDocumentsignIds) => {
            this.cDocumentsignId = cDocumentsignIds
            this.isEdit = true
          }}
          setDataHaveChange={ref => this.vofficeChange = ref}
          setLoadData={(ref) => this.loadDataVOffice = ref}
          setRollbackVOffice={(ref) => this.rollbackVOffice = ref}
          nextToDetail={() => {
            this.setState({ index: 1 })
          }}
          isEdit={this.isEdit}
          viewOnly={this.viewOnly}
          tabIndex={this.state.index}
          cDocumentsignId={this.cDocumentsignId}
        />
      }
      case 'Files':
        return <VOfficeFile screenProps={{
          self: this,
          cDocumentsignId: this.cDocumentsignId,
          isEdit: this.isEdit,
          tabIndex: this.state.index
        }} />
      case 'Singers':
        return <ListSigner
          tabIndex={this.state.index}
          isEdit={this.isEdit}
          viewOnly={this.viewOnly}
          cDocumentsignId={this.cDocumentsignId} />
      case 'Receivers':
        return <Receivers
          tabIndex={this.state.index}
          isEdit={this.isEdit}
          viewOnly={this.viewOnly}
          cDocumentsignId={this.cDocumentsignId} />
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
    const { index, search } = this.state
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-60}
        behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={{ flex: 1 }}>
          <HeaderForTabInvoice
            title="Trình ký VOffice"
            onPressLeft={() => {
              if (!global.isAddingUserSign || index !== 2) {
                this.props.navigation.state.params.refreshData()
                NavigationService.pop()
              } else {
                global.setListUserSignMode(true);
              }
            }}
            disableSearch={true}
            onChangeSearch={(searchs) => { this._onChangeSearch(searchs) }}
            placeholderSearch="Tìm kiếm"
            search={search}
            disableEye={true}
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
    // width: WIDTHXD(411),
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
