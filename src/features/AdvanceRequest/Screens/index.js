import React, { Component } from 'react';
import {
  SafeAreaView, StatusBar, Text, Dimensions, StyleSheet, View,
  ActivityIndicator, Platform, KeyboardAvoidingView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'
import moment from 'moment'
import { HEIGHTXD, getFontXD, WIDTHXD } from '../../../config/Function';
import R from '../../../assets/R';
import NavigationService from '../../../routers/NavigationService';
import { NetworkSetting } from '../../../config/Setting';
import Header from '../Headers';
import GeneralInfo from './GeneralInfo';
import DetailInfo from './DetailInfo/index';
import ApprovalInfo from './ApprovalInfo';
import PayInfo from './PayInfo';
import Attack from './Attack';
import SubmissionProcess from './SubmissonProcess'
import AdvanceRequest from '../../../apis/Functions/advanceRequest'
import BotomMenu from '../common/BottomMenu';
import {
  createGeneralInfo, updateRequestAmount, actionInputSearch, saveBeforeExit,
  disableEdit, updateListAdvanceRequest, uploadFileAttackSuccess, updateAdvanceRequestId, coVoffice
} from '../../../actions/advanceRequest';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import { showLoading, hideLoading } from '../../../common/Loading/LoadingModal'
import global from '../global'
import ModalPrint from '../../../common/PrintedVotes/index'
import ModalAttachment from '../../../common/FilePicker/ModalAttachment'
import Confirm from '../../../common/ModalConfirm/Confirm';


const icons = [
  {
    key: 'save',
    value: 'Lưu',
    active: require('../../../assets/images/menu/save.png'),
    disable: require('../../../assets/images/menu/saved.png'),
    press: require('../../../assets/images/menu/savep.png')
  },
  {
    key: 'co',
    value: 'CO',
    active: require('../../../assets/images/menu/co.png'),
    disable: require('../../../assets/images/menu/cod.png'),
    press: require('../../../assets/images/menu/cop.png')
  },
  {
    key: 'ra',
    value: 'RA',
    active: require('../../../assets/images/menu/ra.png'),
    disable: require('../../../assets/images/menu/rad.png'),
    press: require('../../../assets/images/menu/rap.png')
  },
  {
    key: 'attack',
    value: 'Đính kèm',
    active: require('../../../assets/images/menu/attack.png'),
    disable: require('../../../assets/images/menu/attackd.png'),
    press: require('../../../assets/images/menu/attackp.png')
  },
  {
    key: 'print',
    value: 'Phiếu In',
    active: require('../../../assets/images/menu/print.png'),
    disable: require('../../../assets/images/menu/printd.png'),
    press: require('../../../assets/images/menu/printp.png')
  },
]

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const renderLabel = ({ route, focused }) => (
  <View style={{
    marginBottom: HEIGHTXD(32),
    width: WIDTHXD(374),
  }}
  >
    <Text
      style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}
    >
      {route.title}
    </Text>
  </View>
)

const renderTabbar = props => (
  <LinearGradient
    colors={R.colors.colorHeaderGradienMenuTab}
  >
    <TabBar
      {...props}
      style={styles.tabStyle}
      renderLabel={renderLabel}
      scrollEnabled={true}
      indicatorStyle={styles.indicatorStyle}
    />
  </LinearGradient>)
class AdvanceRequestDeatail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      nextToLine: false,
      visible: false,
      icPressMenu: -1,
      isPressMenu: false,
      activeMenu: 1,
      indexIcon: global.SHOW_ICON_EYE,
      changeIconPreview: false,
      isListDetail: false,
      isListApproval: false,
      isListPayInfo: false,
      color: null,
      isActiveCo: false,
      isRa: false,
      isActivePrint: false,
      isActiveAttack: false,
      isActiveSave: true,
      loading: false,
      isCreateGeneral: false,
      data: {},
      listCurrency: [],
      scrollEnabled: true,
      swipeEnabled: false,
      openModalPrint: false,
      isCancel: false,
      tempIndex: null,
      docStatus: 'DR',
      prevIndex: null,
      routes: [
        { key: 1, title: 'Thông tin chung' },
        { key: 2, title: 'Thông tin chi tiết' },
        { key: 3, title: 'Đính kèm' },
        { key: 4, title: 'Thông tin duyệt' },
        { key: 5, title: 'Thông tin chi' },
        { key: 6, title: 'Thông tin trình ký' },
      ],
    }
  }

  componentDidMount() {
    if (this.props.navigation.state.params.id) {
      showLoading()
      this.setState({ color: this.props.navigation.state.params.color })
      this._getDetailItem(this.props.navigation.state.params.id);
      this.props.updateAdvanceRequestId(this.props.navigation.state.params.id)
    }
    this._isCreateGeneral();
  }

  componentWillReceiveProps(nextProps) {
  }

  _checkSave = (index) => {
    if (!this.props.savedBeforeExit) {
      this.setState({ prevIndex: index })
      return true
    } else {
      this.ConfirmPopup.setModalVisible(true)
      this.setState({ prevIndex: index })
      return false
    }
  }

  _isCreateGeneral = () => {
    if (this.props.navigation.state.params === 'create') {
      this.props.coVoffice(false, null)
      this.props.disableEdit(true)
      this.setState({ isCreateGeneral: true, swipeEnabled: false, isActiveAttack: false, isActivePrint: false, isActiveCo: false })
    } else if (this.props.navigation.state.params.type === 'create') {
      const data = this._getDataApplyToState(this.props.navigation.state.params.data)
      this.setState({
        isCreateGeneral: true,
        swipeEnabled: false,
        isActiveAttack: false,
        isActivePrint: false,
        isActiveCo: false,
        data
      })
    } else {
      this.setState({ isCreateGeneral: false, swipeEnabled: true, isActiveAttack: true, isActivePrint: true, isActiveCo: true })
    }
  }

  _getDataApplyToState = response => {
    const body = {
      adOrgId: this.props.adOrgId,
      createdby: this.props.adUserId,
      updatedby: this.props.adUserId,
      cDepartmentId: this.props.cDepartmentId,
      approvedAmount: null,
      description: '',
      cCostCategoryId: null,
      paymentMethod: null,
      requestType: null,
      requestAmount: null,
      paymentOrgId: null,
      paymentOrgName: null,
      isactive: 'Y',
      documentNo: '',
      transDate: moment(new Date()).format('DD/MM/YYYY'),
      currencyRate: 0,
      fwmodelId: null,
      isSize: true,
      cCurrencyId: null,
      cStatementId: null,
      cBpartnerName: null,
      cCurrencyName: null,
      cBpartnerId: null,
      cAdvanceRequestId: 0,
      cDocumentTypeId: 2,
      cDocumentsignId: null,
      cPayrollId: null,
      cCashFlowId: null,
      cSalaryId: null,
      cCostCategoryName: null,
      cSalaryName: null,
      cPayrollName: null,
      cCashFlowName: null,
      updated: new Date().getTime(),
    }
    body.requestType = parseInt(response.type, 10) === 0 ? 0 : 5
    body.approvedAmount = parseInt(response.type, 10) === 0 ? 0 : 5
    body.paymentOrgId = this.props.adOrgId
    body.paymentOrgName = this.props.adOrgName
    body.cBpartnerId = response.cBpartnerId
    body.cBpartnerName = response.cBpartnerName
    body.transDate = response.transDate
    body.cCurrencyId = response.cCurrencyId
    return body
  }

  _isActivePrint = () => {
    let active = true
    const { data } = this.state
    if (this.state.isRa) {
      if (data.issignerrecord === 'Y' && (data.signerstatus && ['1', '2', '4'].includes(data.signerstatus))) {
        active = true
      } else if (data.issignerrecord === 'N') active = true
    } else {
      active = false
    }
    return active
  }

  _getDetailItem = async (id) => {
    try {
      const response = await AdvanceRequest.getItemAdvanceRequest(id)
      console.log('RESPONSE DETAIL---', response)
      if (response && response.status === 200) {
        if (response.data.docstatus === 'CO') {
          this.props.disableEdit(false)
          this.setState({ isRa: true, isActiveCo: false, isActiveSave: false, isActiveAttack: false, docStatus: response.data.docstatus })
        }
        if (response.data.createdby === this.props.adUserId && response.data.docstatus !== 'CO') {
          this.props.disableEdit(true)
        }
        if (response.data.isCompleteItSort === 'Y') {
          this.props.coVoffice(true, response.data.cDocumentsignId)
        }
        if (response.data.isCompleteItSort === 'N') {
          this.props.coVoffice(false, response.data.cDocumentsignId)
        }
        this.props.updateRequestAmount(response.data.requestAmount)
        this.setState({ data: response.data });
        global.DOCUMENT_NO = response.data.documentNo
        global.DOCUMENT_TYPE_ID = response.data.cDocumentTypeId
        global.CURRENCY_RATE = response.data.currencyRate
        global.CB_PARTNER_ID = response.data.cBpartnerId
        global.CB_PARTNER_NAME = response.data.cBpartnerName
        hideLoading()
      }
    } catch (err) {
    }
  }

  _onPressMenu = (index, bool) => {
    if (index === 0 && this.state.isActiveSave) {
      this.setState({ icPressMenu: index, isPressMenu: !this.state.isPressMenu }, () => {
        if (!this.state.isCreateGeneral) {
          if (this.state.isCancel && this.state.index === 0) NavigationService.pop()
        }
        // if (bool) this._changeIndexPage(this.state.prevIndex)
      })
    } else if (index === 4 && this.state.isRa) {
      this._refModalPrint.setModalVisible(true)
    } else if (index === 1 && this.state.isActiveCo) {
      this._CO()
    } else if (index === 2) {
      this._RA()
    } else if (index === 3 && this.state.isActiveAttack) {
      this._refModalAttackment.show()
      this._onIndexChange(2)
    } else if (index === -1) {
      this.setState({ nextToLine: true, index: 1, indexIcon: global.SHOW_ICON_SEARCHKEY, activeMenu: global.HIDE_BOTTOM_MENU }, () => {
        // if (bool) this._changeIndexPage(this.state.prevIndex)
      })
    }
  }

  _CO = async () => {
    try {
      const body = {
        ad_table_id: global.TABLE_ID_CO,
        record_id: this.state.data.cAdvanceRequestId,
        ad_org_id: this.state.data.adOrgId,
        c_dept_id: this.state.data.cDepartmentId,
        updatedby: this.props.adUserId
      }
      const response = await AdvanceRequest.CO(body)
      if (response.status === 200) {
        if (response.data.returnMessage) {
          showAlert(TYPE.WARN, 'CO thất bại', response.data.returnMessage)
        } else {
          this.setState({ isActiveCo: false, isRa: true, isActiveAttack: false, isActiveSave: false })
          this.props.updateListAdvanceRequest(true)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Hoàn thành đề nghị thanh toán thành công')
          this.setState({ docStatus: 'CO' })
        }
      }
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Hoàn thành đề nghị thanh toán thất bại')
    }
  }

  _RA = async () => {
    try {
      const body = {
        ad_table_id: global.TABLE_ID_CO,
        record_id: this.state.data.cAdvanceRequestId,
        ad_org_id: this.state.data.adOrgId,
        c_dept_id: this.state.data.cDepartmentId,
        updatedby: this.props.adUserId,
        ad_window_id: this.props.adOrgId
      }
      const response = await AdvanceRequest.RA(body)
      if (response.status === 200) {
        this.setState({ isActiveCo: true, isRa: false, isActiveAttack: true, isActiveSave: true })
        this.props.updateListAdvanceRequest(true)
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Hủy hoàn thành đề nghị thanh toán thành công')
        this.setState({ docStatus: 'RA' })
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành đề nghị thanh toán thất bại')
      }
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành đề nghị thanh toán thất bại')
    }
  }

  returnData = (obj) => {
    const { activeMenu, indexIcon, toDetail } = obj
    if (this.state.index === 2) {
      this.setState({ activeMenu: 1, indexIcon, isListDetail: toDetail, data: { ...this.state.data, requestAmount: this.props.requestAmount } })
    } else {
      this.setState({ activeMenu, indexIcon, isListDetail: toDetail, data: { ...this.state.data, requestAmount: this.props.requestAmount } })
    }
  }

  returnDataApproval = (obj) => {
    const { activeMenu, indexIcon, toDetail } = obj
    this.setState({ activeMenu, indexIcon, isListApproval: toDetail })
  }

  returnDataPayInfo = (obj) => {
    const { activeMenu, indexIcon, toDetail } = obj
    this.setState({ activeMenu, indexIcon, isListPayInfo: toDetail })
  }

  setId = (id) => {
    let { data } = this.state
    data.cAdvanceRequestId = id
    if (this.state.nextToLine) {
      this.setState({
        data,
        swipeEnabled: false,
        isActiveAttack: true,
        isActiveCo: true,
        isActivePrint: true,
        index: 1,
        indexIcon: global.SHOW_ICON_SEARCHKEY,
        activeMenu: global.HIDE_BOTTOM_MENU
      })
    } else {
      this.setState({
        data,
        swipeEnabled: false,
        isActiveAttack: true,
        isActiveCo: true,
        isActivePrint: true,
      })
    }
  }

  returnExpanded = () => {
    this.setState({ changeIconPreview: !this.state.changeIconPreview })
  }

  _nextToLine = () => {
    this._onPressMenu(-1)
  }

  _updateState = (data) => {
    this.setState({ data })
  }

  _renderScene = ({ route }) => {
    let id = this.state.data.cAdvanceRequestId
    let { cBpartnerId, documentNo, cDocumentTypeId, description, transDate, docstatus, cDepartmentId, isFinish } = this.state.data
    let { isPressMenu, icPressMenu, index, color } = this.state;
    switch (route.key) {
      case 1:
        return <GeneralInfo
          onCreateSuccess={() => this.setState({ swipeEnabled: false, isCreateGeneral: false })}
          isPressMenu={isPressMenu}
          icPressMenu={icPressMenu}
          value={this.state.data}
          docStatus={this.state.docStatus}
          tabActive={index}
          isCreate={this.state.isCreateGeneral}
          nextToLine={this._nextToLine}
          setId={this.setId}
          returnExpanded={this.returnExpanded}
          disableEdit={this.props.disableEdit}
          updateState={this._updateState}
        />
      case 2:
        return <DetailInfo
          screenProps={{
            disableEdit: this.props.disableEdit,
            id,
            cBpartnerId,
            isPressMenu,
            icPressMenu,
            tabActive: index,
            color,
            returnData: this.returnData,
            transDate,
            docstatus,
            cDepartmentId,
            isFinish,
            documentNo
          }}
        />
      case 3:
        return <Attack
          disableEdit={this.props.disableEdit}
          screenProps={{ id: this.state.data.cAdvanceRequestId }}
        />
      case 4:
        return <ApprovalInfo
          screenProps={{ id, isPressMenu, icPressMenu, tabActive: index, color, returnData: this.returnDataApproval, disableEdit: this.props.disableEdit }}
        />
      case 5:
        return <PayInfo
          screenProps={{ id, documentNo, cDocumentTypeId, description, returnData: this.returnDataPayInfo, disableEdit: this.props.disableEdit }}
        />
      case 6:
        return <SubmissionProcess id={this.state.data.cAdvanceRequestId} />
      default:
        return null;
    }
  };

  _closeScene = (index) => {
    if (this.state.isListApproval) {
      global.goBackToListApprovalInfo()
    } if (this.state.isListDetail && (index !== 0 || index === 2)) {
      global.goBackToListDetail()
    } if (this.state.isListPayInfo) {
      global.goBackToListPayInfo()
    }
  }

  _checkCloseInput = () => {
    if (this.props.inputSearch) {
      this.props.actionInputSearch(false)
    }
  }

  _accept = (item) => {
    NavigationService.navigate('DetailAttack', item)
  }

  _uploadFile = response => {
    showLoading()
    if (response) {
      const url = NetworkSetting.ROOT
        .concat(`/erp-service/adAttachmentServiceRest/attachFile/${global.TABLE_ID}/${this.state.data.cAdvanceRequestId}/1/${this.props.adUserId}/${this.props.adUserId}`)
      const formData = new FormData()
      if (typeof (response) === 'object' && response.length >= 0) {
        response.map(item => formData.append('attachments', item))
      } else {
        formData.append('attachments', response)
      }
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.returnMessage === 'Upload file thành công') {
          hideLoading()
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải lên file thành công')
          this.props.uploadFileAttackSuccess()
        } else {
          showAlert(TYPE.WARN, 'Thông báo', res.data.returnMessage)
        }
      }).catch(err => {
        hideLoading()
        showAlert(TYPE.ERROR, 'Thông báo', 'Upload file thất bại')
      })
    }
  }

  _onCapturePhoto = (response) => {
    this._uploadFile(response)
  }

  _onChooseFile = (response) => {
    this._uploadFile(response)
  }

  _onChoosePhoto = response => {
    this._uploadFile(response)
  }

  _changeIndexPage = (index) => {
    let indexIcon = 0
    let activeMenu = 1
    if (index === 1) {
      indexIcon = global.SHOW_ICON_SEARCHKEY
      activeMenu = global.HIDE_BOTTOM_MENU
      this.setState({ index, indexIcon, activeMenu, swipeEnabled: false })
      this._closeScene(index)
      this._checkCloseInput()
    } else if (index === 2) {
      indexIcon = global.HIDE_ICON
      activeMenu = global.SHOW_BOTTOM_MENU
    } else if (index === 3 || index === 4) {
      indexIcon = global.SHOW_DOUBLE_ICON
      activeMenu = global.HIDE_BOTTOM_MENU
    } else if (index === 5) {
      indexIcon = global.HIDE_ICON
      activeMenu = global.HIDE_BOTTOM_MENU
    }
    this._closeScene(index)
    this._checkCloseInput()
    this.setState({ index, indexIcon, activeMenu, swipeEnabled: true })
  }

  _onIndexChange = (index) => {
    if (this.state.isCreateGeneral) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn cần tạo thông tin chung để có thể tiếp tục')
    } else {
      if (this._checkSave(index)) {
        this._changeIndexPage(index)
      }
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title="Đề Nghị Thanh Toán"
            onPressLeft={() => NavigationService.pop()}
            onPressRight={() => { }}
          />
          <View>
            <ActivityIndicator animating color={R.colors.colorMain} size="small" />
          </View>
        </SafeAreaView>
      )
    }
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={WIDTHXD(-200)}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ModalPrint ref={ref => { this._refModalPrint = ref }} accept={this._accept} />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn lưu bản ghi này trước khi thoát không ?"
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => {
            if (this.state.prevIndex === -1) NavigationService.pop()
            else {
              this.props.saveBeforeExit(false)
              this._changeIndexPage(this.state.prevIndex)
            }
          }}
          onPressRight={() => {
            this._onPressMenu(0, true)
          }}
        />
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor={R.colors.colorWhite} />
          <ModalAttachment
            onCapturePhoto={this._onCapturePhoto}
            onChoosePhoto={this._onChoosePhoto}
            onChooseFile={this._onChooseFile}
            ref={ref => { this._refModalAttackment = ref }}
          />
          <Header
            tabActive={this.state.index}
            indexIcon={this.state.indexIcon}
            title="Đề Nghị Thanh Toán"
            colorTab={true}
            onPressLeft={() => NavigationService.pop()}
            onPressRight={() => { }}
            changeIconPreview={this.state.changeIconPreview}
            checkSave={() => this._checkSave(-1)}
          />
          <TabView
            swipeEnabled={false}
            renderTabBar={renderTabbar}
            navigationState={this.state}
            renderScene={this._renderScene}
            onIndexChange={index => this._onIndexChange(index)}
            initialLayout={initialLayout}
          />

        </View>
        <BotomMenu
          onPress={this._onPressMenu}
          icons={icons}
          activeMenu={this.state.activeMenu}
          isActiveSave={this.state.isActiveSave}
          isActiveCo={this.state.isActiveCo}
          isActivePrint={this._isActivePrint()}
          isActiveAttack={this.state.isActiveAttack}
          isRa={this.state.isRa}
          indexTab={this.state.index}
        />
      </KeyboardAvoidingView>
    );
  }
}
function mapStateToProps(state) {
  console.log('STORE ---', state)
  return {
    inputSearch: state.advanceRequestReducer.inputSearch,
    requestAmount: state.advanceRequestReducer.requestAmount,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adOrgName: state.userReducers.userData.loggedIn.adOrgName,
    adUserId: state.userReducers.userData.adUserId,
    savedBeforeExit: state.advanceRequestReducer.savedBeforeExit,
    enableEdit: state.advanceRequestReducer.enableEdit,
  }
}

export default connect(
  mapStateToProps,
  {
    createGeneralInfo,
    updateRequestAmount,
    actionInputSearch,
    disableEdit,
    updateListAdvanceRequest,
    uploadFileAttackSuccess,
    saveBeforeExit,
    updateAdvanceRequestId,
    coVoffice
  }
)(AdvanceRequestDeatail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activeTabTextColor: {
    color: R.colors.white,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
    opacity: 1,
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'cyan',
    height: HEIGHTXD(200),
  },
  tabTextColor: {
    color: R.colors.white,
    opacity: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
  },
  tabStyle: {
    elevation: 0,
    backgroundColor: 'transparent',
  },
  indicatorStyle: {
    backgroundColor: R.colors.white,
    height: HEIGHTXD(12)
  }
});
