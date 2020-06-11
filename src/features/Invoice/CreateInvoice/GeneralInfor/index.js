import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiInvoice from 'apis/Functions/invoice'
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux'
import { LoadingComponent } from '../../../../common/Loading/LoadingComponent';
import BottomMenu from '../../../VOffice/CreateVOffice/GeneralInfor/ItemViews/BottomMenu';
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD, checkFormatArray } from '../../../../config/Function';
import ItemGeneralInfo from './ItemViews/ItemGeneralInfo';
import ItemMoneyInfo from './ItemViews/ItemMoneyInfo';
import ItemManagerInfo from './ItemViews/ItemManagerInfo';
import Confirm from '../../../../common/ModalConfirm/Confirm';
import dataInvoice from './datainvoice'
import global from '../../global';
import axios from 'axios';
import { showLoading, hideLoading } from 'common/Loading/LoadingModal';

class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      reRender: false,
      showLoadingCtn: false,
      isNext: false,

    };
    this.dataItem = JSON.parse(JSON.stringify(dataInvoice))
    this.dayToDueDate = 0
    this.idInvoice = 0
    this.createSuccess = false
  }

  menu = [
    {
      name: i18n.t('SAVE_T'),
      iconName: R.images.invoice.save,
      enable: true,
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.invoice.attach,
      enable: this.props.isEdit
    },
  ]

  componentDidMount() {
    const { isEdit, userData, idInvoice } = this.props
    this.idInvoice = idInvoice ? idInvoice : null
    // console.log(idInvoice, isEdit)
    if (isEdit) {
      this._loadData()
      this.refreshBottomMenu();
    } else {
      this.dataItem.adOrgId = userData.loggedIn.adOrgId
      this.dataItem.cDepartmentId = userData.loggedIn.adUserDepartmentId
      this.dataItem.createdby = userData.loggedIn.adUserId
      this.dataItem.updatedby = userData.loggedIn.adUserId
      this.dataItem.serviceType = R.strings.TYPE_GOODS_SERVIVE[0].id
      // backup this invoice
      this.invoiceBackup = JSON.parse(JSON.stringify(this.dataItem));
    }
    this.props.setCheckInformation && this.props.setCheckInformation(() => this._checkInformation());

    // data does not load when default tab is 0, try to reload data at parent component
    this.props.setLoadData && this.props.setLoadData((idInvoice) => {
      this.idInvoice = idInvoice;
      this._loadData()
    });

    // setDataHaveChange 
    this.props.setDataHaveChange && this.props.setDataHaveChange(() => this.haveChange());

    this.props.setRollbackInvoice && this.props.setRollbackInvoice(() => {
      this.dataItem = JSON.parse(JSON.stringify(this.invoiceBackup));
      this._reRender();
    });
  }

  haveChange = () => {
    if (!this.invoiceBackup) return false;
    if (!this.dataItem) return false;

    // console.log('hihi1', this.dataItem.cBpartnerId, this.invoiceBackup.cBpartnerId);
    return JSON.stringify(this.invoiceBackup) !== JSON.stringify(this.dataItem);
  }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
  }

  _loadData = async () => {
    showLoading();
    try {
      let { idInvoice } = this
      let body = { id: idInvoice };
      let resDetail = await apiInvoice.getDetailsInvoice(body);
      // console.log(resDetail.data)
      if (resDetail && resDetail.data) {
        this.dataItem = { ...this.dataItem, ...resDetail.data };
        // backup this invoice
        this.invoiceBackup = JSON.parse(JSON.stringify(this.dataItem));
        this.props.setInvoiceInfo(this.dataItem);
        this.setState({ reRender: !this.state.reRender });
        this.props.refreshAttachmentList && this.props.refreshAttachmentList();
      }
    } catch (error) {
      console.log(error)
    } finally {
      hideLoading();
    }
  }

  _onSuccess = () => {
    this._reRender();
  }

  _onPressIcon = (indexOfIcon, index, item) => {
    if (indexOfIcon === 2) {
      this.setState({ idSelected: item.apInvoiceId })
      this.ConfirmPopup.setModalVisible(true);
    } else {
      showAlert(TYPE.WARN, i18n.t('NOTIFICATION_T'), i18n.t('FUCTION_UPDATE'))
      this.setState({ reRender: !this.state.reRender })
    }
  }

  _checkInformation = () => {
    let { groupChange, serviceType, template, symbol, invoiceNo, cBpartnerId, description, cCurrencyId, taxCode, sellerName, currencyRate, } = this.dataItem;
    let arrayTitleRequire = ['Kiểu hóa đơn', 'Loại hàng hóa dịch vụ', 'Mẫu số HĐ', 'Ký hiệu', 'Số hóa đơn', 'Mã số thuế', 'Tên người bán', 'Tỷ giá'];
    let arrayRequire = [groupChange, serviceType, template, symbol, invoiceNo, taxCode, sellerName, currencyRate];
    let isCorrect = checkFormatArray(arrayRequire)
    if (isCorrect === true) {
      this._onCompleteForm()
    } else {
      showAlert(TYPE.WARN, 'Thông báo', `Vui lòng điền ${arrayTitleRequire[isCorrect] ? arrayTitleRequire[isCorrect] : 'đầy đủ thông tin'}`)
    }
  }

  _onCompleteForm = async () => {
    const { isEdit, nextToDetail, refreshData, setIdInvoice, setInvoiceInfo } = this.props
    const { isNext } = this.state
    try {
      this.setState({ showLoadingCtn: true }, async () => {
        this.dataItem.requestBeforeTaxAmount = null
        this.dataItem.requestTaxAmount = null
        this.dataItem.requestAmount = null
        this.dataItem.approvedBeforeTaxAmount = null
        this.dataItem.approvedTaxAmount = null
        this.dataItem.approvedAmount = null
        const response = isEdit ? await apiInvoice.editInvoice(this.dataItem) : await apiInvoice.createInvoice(this.dataItem)
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', isEdit ? 'Sửa hóa đơn thành công' : 'Tạo hóa đơn thành công');
          this.createSuccess = true;
          this.dataItem.apInvoiceId = response.data.apInvoiceId;
          this.idInvoice = response.data.apInvoiceId
          this.partnerBackup = JSON.parse(JSON.stringify(this.dataItem));
          setIdInvoice(this.idInvoice);
          setInvoiceInfo(this.dataItem);
          this.refreshBottomMenu();
          if (isNext) {
            nextToDetail()
          }
          this._onSuccess()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', isEdit ? 'Sửa hóa đơn thất bại' : 'Tạo hóa đơn thất bại');
        }
        this.setState({ showLoadingCtn: false })
        refreshData()
        this._loadData()
      })
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Tạo hóa đơn thất bại')
    }
    this.setState({ isSent: true })
  }

  refreshBottomMenu = () => {
    this.menu[1].enable = this.idInvoice ? true : false;
    this._reRender();
  }

  _onChangeBottomMenu = (index) => {
    if (index === 0) {
      this._checkInformation()
    } else if (index === 1) {
      global.setTabIndex(2);
      setTimeout(() => {
        global.showAttachModal && global.showAttachModal();
      }, 700);
    }
  }

  render() {
    const { showLoadingCtn, loading, isNext, } = this.state
    const { nextToDetail, isEdit } = this.props
    if (loading) {
      return (
        <View style={styles.container}>
          <View>
            <ActivityIndicator animating color="#1C1C1C" size="large" />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginVertical: HEIGHTXD(30) }}>
            <ItemGeneralInfo
              self={this}
              item={this.dataItem}
            />
          </View>
          <ItemMoneyInfo
            self={this}
            item={this.dataItem}
          />

          <View style={{ marginTop: HEIGHTXD(30), paddingBottom: HEIGHTXD(180) }}>
            <ItemManagerInfo
              item={this.dataItem}
              self={this}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.createSuccess || !this.haveChange()) {
                  nextToDetail()
                } else {
                  this.ConfirmPopup.setModalVisible(true)
                  this.setState({ isNext: true })
                }
              }}
              style={{ alignItems: 'flex-end' }}
            >
              <View style={styles.button}>
                <Icon name="arrow-right" size={WIDTHXD(60)} color={R.colors.colorMain} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn lưu bản ghi này không?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => {
            if ((isNext && isEdit) || this.createSuccess) nextToDetail()
            this.dataItem = JSON.parse(JSON.stringify(this.invoiceBackup));
            // console.log('hihi2', this.dataItem.cBpartnerId, this.invoiceBackup.cBpartnerId);
            this._reRender();
          }}
          onPressRight={() => {
            this.ConfirmPopup.setModalVisible(true);
            this._checkInformation()
          }}
        />
        <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
        />
        <LoadingComponent isLoading={showLoadingCtn} />
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    listInvoice: state.invoiceReducer.listInvoice,
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, {})(GeneralInfo);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: R.colors.blueGrey51,
  },
  button: {
    marginTop: HEIGHTXD(42),
    marginBottom: HEIGHTXD(67),
    marginRight: WIDTHXD(86),
    width: WIDTHXD(137),
    height: WIDTHXD(137),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: WIDTHXD(137),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: R.colors.white
  }
})
