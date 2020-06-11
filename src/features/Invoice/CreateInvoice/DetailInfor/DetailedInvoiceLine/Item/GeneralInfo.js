import React, { Component } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager, TextInput } from 'react-native';
import R from 'assets/R'
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import ApiInvoice from 'apis/Functions/invoice'
import { connect } from 'react-redux'
import { fetchListChanel } from 'actions/invoice'
import { getWidth, WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD } from '../../../../../../config'
import ItemSearch from '../../../../common/ItemSearch';
import ItemPicker from '../../../../common/ItemPicker';
import ItemInputText from '../../../../common/ItemInputText';
import global from '../../../../global'
import _ from 'lodash'

class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      reRender: false,
    };
    this.listUom = []
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideDetailGeneralInfor = this._hideDetailGeneralInfor.bind(this)
  }

  _hideDetailGeneralInfor = (isHide) => {
    this.setState({ expanded: isHide })
  }

  _findChanel = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }
    let res = await ApiInvoice.getListChanel(body)
    if (res && res.data) {
      let data = this._deleteItemLoadMore(res.data)
      return data
    } else {
      return []
    }
  }

  _findContract = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }

    let res = await ApiInvoice.searchContract(body)
    if (res && res.data) {
      let data = this._deleteItemLoadMore(res.data)
      return data
    } else {
      return []
    }
  }

  _findListPayUnit = async (query) => {
    let body = {
      adOrgId: this.props.adOrgId,
      isNotRequiredUser: 'true',
      isSize: true,
      name: query
    }
    let res = await ApiInvoice.searchListPayUnit(body)
    if (res && res.data) {
      let data = this._deleteItemLoadMore(res.data)
      return data
    } else {
      return []
    }
  }

  _findProduct = async (query) => {
    let body = {
      isSize: 'true',
      name: query,
      serviceType: this.props.invoiceInfo.serviceType === 'EW' ? 'EW' : ''
    }
    let res = await ApiInvoice.getCategoryProduct(body)
    if (res && res.data) {
      let data = this._deleteItemLoadMore(res.data)
      return data
    } else {
      return []
    }
  }

  _findDetailInvoice = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }
    let res = await ApiInvoice.searchDetailInvoiceByGroup(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  _deleteItemLoadMore = (result) => {
    _.forEach(result, (item, index) => {
      if (item.name === 'Tìm kiếm thêm' || item.text === 'Tìm kiếm thêm' || item.displayname === 'Tìm kiếm thêm') {
        result.splice(index, 1)
      }
    })
    return result
  }


  changeLayout = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expanded: !this.state.expanded });
  }

  async componentDidMount() {
    this.props.fetchListChanel({
      isSize: 'true',
      name: ''
    })
    let body = {
      isSize: 'true',
      name: ''
    }
    let res = await ApiInvoice.searchDetailInvoiceByGroup(body)
    if (res && res.data) {
    }
    let resUom = await ApiInvoice.getListCuom(body)
    if (resUom && resUom.data) {
      this.listUom = resUom.data
      this._reRender()
    }
  }

  _reRender() {
    this.setState({ reRender: !this.state.reRender })
  }

  render() {
    const { expanded } = this.state;

    global.isHideDetailGeneralInfor = !expanded
    global.updateHeader()
    const { self, invoiceInfo } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>{i18n.t('GENERAL_INFORMATION')}</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingBottom: HEIGHTXD(46) }}>
              <ItemSearch
                require={true}
                title="Mặt hàng"
                titlePopUP="Tìm kiếm mặt hàng"
                value={self.dataDetailedInvoice.mProductName}
                findData={this._findProduct}
                onValueChange={(value, item) => {
                  if (item) {
                    self.dataDetailedInvoice.mProductName = item.name
                    self.dataDetailedInvoice.mProductId = item.productId
                    self.dataDetailedInvoice.description = item.name
                  } else {
                    self.dataDetailedInvoice.mProductName = ''
                    self.dataDetailedInvoice.mProductId = null
                  }
                  this._reRender()
                }}
              />
              <ItemSearch
                require={true}
                title="Hợp đồng"
                titlePopUP="Tìm kiếm hợp đồng"
                value={self.dataDetailedInvoice.cContractName}
                findData={this._findContract}
                onValueChange={(value, item) => {
                  if (item) {
                    self.dataDetailedInvoice.cContractName = item.name
                    self.dataDetailedInvoice.cContractId = item.contractId
                  } else {
                    self.dataDetailedInvoice.cContractName = ''
                    self.dataDetailedInvoice.cContractId = null
                  }
                  this._reRender()
                }}
              />
              <ItemPicker
                title="Kênh"
                data={this.props.listChanel}
                value={self.dataDetailedInvoice.cChannelName}
                onValueChange={(value, items) => {
                  self.dataDetailedInvoice.cChannelName = items.name
                  self.dataDetailedInvoice.cChannelId = items.fwmodelId
                  this._reRender()
                }}
              />
              <ItemSearch
                title="Đơn vị quản trị"
                titlePopUP="Tìm kiếm đơn vị quản trị"
                value={self.dataDetailedInvoice.governanceOrgName}
                findData={this._findListPayUnit}
                onValueChange={(value, item) => {
                  if (item) {
                    self.dataDetailedInvoice.governanceOrgId = item.id
                    self.dataDetailedInvoice.governanceOrgName = item.name
                  } else {
                    self.dataDetailedInvoice.governanceOrgId = ''
                    self.dataDetailedInvoice.governanceOrgName = null
                  }
                  this._reRender()
                }}
              />
              <View style={styles.formEnterInfo}>
                <TextInput
                  multiline
                  maxLength={250}
                  value={self.dataDetailedInvoice.description}
                  onChangeText={value => {
                    this._reRender()
                    self.dataDetailedInvoice.description = value
                  }}
                  placeholder="Nội dung tên hàng hóa / dịch vụ"
                  style={styles.inputDes}
                />
              </View>

              <View style={{ flexDirection: 'row', width: WIDTHXD(1064), justifyContent: 'space-between', alignSelf: 'center', }}>
                <ItemInputText
                  require={true}
                  width={WIDTHXD(258)}
                  title="Số lượng"
                  isNum
                  maxLength={10}
                  value={self.dataDetailedInvoice.qty}
                  marginTop={HEIGHTXD(30)}
                  numberOfLines={1}
                  onChangeValue={(text) => {
                    let num = text.replace(/[^0-9.]/gi, '')
                    if (text === '') {
                      num = 0
                    }
                    self.dataDetailedInvoice.qty = parseInt(num)
                    const detailTax = (self.dataDetailedInvoice.tax && (!isNaN(self.dataDetailedInvoice.tax))) ? self.dataDetailedInvoice.tax : 0;

                    self.dataDetailedInvoice.requestBeforeTaxAmount = text * self.dataDetailedInvoice.price
                    self.dataDetailedInvoice.approvedBeforeTaxAmount = text * self.dataDetailedInvoice.price
                    self.dataDetailedInvoice.requestTaxAmount = self.dataDetailedInvoice.requestBeforeTaxAmount * detailTax / 100
                    self.dataDetailedInvoice.approvedTaxAmount = self.dataDetailedInvoice.approvedBeforeTaxAmount * detailTax / 100
                    self.dataDetailedInvoice.requestAmount = self.dataDetailedInvoice.requestBeforeTaxAmount + self.dataDetailedInvoice.requestTaxAmount
                    self.dataDetailedInvoice.approvedAmount = self.dataDetailedInvoice.approvedBeforeTaxAmount + self.dataDetailedInvoice.approvedTaxAmount
                    self._reRender()
                    this._reRender()
                  }}
                />
                <ItemPicker
                  require={true}
                  title="Đơn vị tính"
                  data={this.listUom}
                  width={WIDTHXD(332)}
                  value={self.dataDetailedInvoice.cUomName}
                  onValueChange={(value, items) => {
                    self.dataDetailedInvoice.cUomName = items.name
                    self.dataDetailedInvoice.cUomId = items.uomId
                    this._reRender()
                  }}
                />
                <ItemInputText
                  maxLength={10}
                  width={WIDTHXD(414)}
                  marginTop={HEIGHTXD(30)}
                  numberOfLines={1}
                  require={true}
                  title="Đơn giá"
                  isNum
                  value={self.dataDetailedInvoice.price}
                  onChangeValue={(text) => {
                    let num = text.replace(/[^0-9.]/gi, '')
                    if (text === '') {
                      num = 0
                    }
                    const detailTax = (self.dataDetailedInvoice.tax && (!isNaN(self.dataDetailedInvoice.tax))) ? self.dataDetailedInvoice.tax : 0;
                    self.dataDetailedInvoice.price = parseFloat(num)
                    self.dataDetailedInvoice.requestBeforeTaxAmount = self.dataDetailedInvoice.qty * parseFloat(num)
                    self.dataDetailedInvoice.approvedBeforeTaxAmount = self.dataDetailedInvoice.qty * parseFloat(num)
                    self.dataDetailedInvoice.requestTaxAmount = self.dataDetailedInvoice.qty * parseFloat(num) * detailTax / 100
                    self.dataDetailedInvoice.approvedTaxAmount = self.dataDetailedInvoice.qty * parseFloat(num) * detailTax / 100
                    self.dataDetailedInvoice.requestAmount = self.dataDetailedInvoice.requestBeforeTaxAmount + self.dataDetailedInvoice.requestTaxAmount
                    self.dataDetailedInvoice.approvedAmount = self.dataDetailedInvoice.approvedBeforeTaxAmount + self.dataDetailedInvoice.approvedTaxAmount
                    self._reRender()
                    this._reRender()
                  }}
                />
              </View>
              <ItemSearch
                title="Chi tiết tờ trình"
                titlePopUP="Tìm kiếm"
                value={self.dataDetailedInvoice.cStatementLineId}
                // findData={this._findDetailInvoice}
                onValueChange={(value, item) => {
                  if (item) {
                    self.dataDetailedInvoice.cStatementLineId = item.cStatementLineId
                  } else {
                    self.dataDetailedInvoice.cStatementLineId = null
                  }
                  this._reRender()
                }}
              />
              {
                invoiceInfo.groupChange && invoiceInfo.groupChange === '0' ?
                  <ItemPicker
                    require={false}
                    title="Loại thuế"
                    data={this.props.listTypeTax}
                    value={self.dataDetailedInvoice.cTaxCategoryName}
                    onValueChange={(value, items) => {
                      self.dataDetailedInvoice.cTaxCategoryName = items.name
                      self.dataDetailedInvoice.cTaxId = items.taxId
                      self.dataDetailedInvoice.tax = items.tax
                      self.dataDetailedInvoice.requestTaxAmount = self.dataDetailedInvoice.requestBeforeTaxAmount * items.tax / 100
                      self.dataDetailedInvoice.approvedTaxAmount = self.dataDetailedInvoice.approvedBeforeTaxAmount * items.tax / 100
                      self.dataDetailedInvoice.requestAmount = self.dataDetailedInvoice.requestBeforeTaxAmount + self.dataDetailedInvoice.requestTaxAmount
                      self.dataDetailedInvoice.approvedAmount = self.dataDetailedInvoice.approvedBeforeTaxAmount + self.dataDetailedInvoice.approvedTaxAmount

                      self._reRender()
                      this._reRender()
                    }}
                  /> : null}
            </View>
          )}
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    listChanel: state.invoiceReducer.listChanel,
  }
}
export default connect(mapStateToProps, { fetchListChanel })(GeneralInfo)
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),

    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    paddingVertical: WIDTHXD(30),
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(60),
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  inputDes: {
    textAlignVertical: 'top',
    minHeight: HEIGHTXD(160),
    fontSize: getFontXD(42),
    padding: 0,
    margin: 0

  },
  formEnterInfo: {
    paddingHorizontal: WIDTHXD(36),
    // height: HEIGHTXD(160),
    width: WIDTHXD(1064),
    marginTop: HEIGHTXD(30),
    paddingBottom: HEIGHTXD(26),
    borderColor: R.colors.borderGray,
    borderWidth: 0.5,
    borderRadius: WIDTHXD(20),
    alignSelf: 'center'
  }
})
